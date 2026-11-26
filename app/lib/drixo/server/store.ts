// KV abstraction for Drixo ephemeral state (sessions, CSRF binding, replay cache,
// rate counters). Doc 08 DX-KV.
//
// Two implementations:
//  - RedisKV  (DRIXO_REDIS_URL set): shared by every BFF instance. Required in production.
//  - MemoryKV (dev/sandbox only): per-process; sessions are invisible to other instances.
// Redis loss FAILS CLOSED (Doc 08 section 13, ARC-17): every error propagates, the request
// handler turns it into 503, and no CSRF/replay/step check is ever skipped. Production without
// Redis refuses to serve rather than silently falling back to per-process memory.

export interface KV {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttlSec: number): Promise<void>;
  /** Set only if absent. Returns true if written. */
  setNX<T>(key: string, value: T, ttlSec: number): Promise<boolean>;
  del(key: string): Promise<void>;
  /** Atomic counter with TTL set on first increment. */
  incr(key: string, ttlSec: number): Promise<number>;
  /**
   * Atomic compare-and-swap: apply mutate only if predicate(current) holds.
   * Returns the new value, or undefined if missing / predicate failed.
   */
  updateIf<T>(
    key: string,
    predicate: (v: T) => boolean,
    mutate: (v: T) => T,
    ttlSec: number,
  ): Promise<T | undefined>;
}

type Entry = { v: unknown; exp: number };

class MemoryKV implements KV {
  private m = new Map<string, Entry>();

  private live(key: string): Entry | undefined {
    const e = this.m.get(key);
    if (!e) return undefined;
    if (e.exp <= Date.now()) {
      this.m.delete(key);
      return undefined;
    }
    return e;
  }

  async get<T>(key: string) {
    return this.live(key)?.v as T | undefined;
  }
  async set<T>(key: string, value: T, ttlSec: number) {
    this.m.set(key, { v: value, exp: Date.now() + ttlSec * 1000 });
  }
  async setNX<T>(key: string, value: T, ttlSec: number) {
    if (this.live(key)) return false;
    this.m.set(key, { v: value, exp: Date.now() + ttlSec * 1000 });
    return true;
  }
  async del(key: string) {
    this.m.delete(key);
  }
  async incr(key: string, ttlSec: number) {
    const e = this.live(key);
    if (!e) {
      this.m.set(key, { v: 1, exp: Date.now() + ttlSec * 1000 });
      return 1;
    }
    e.v = (e.v as number) + 1;
    return e.v as number;
  }
  // Synchronous body => atomic within a single Node event loop.
  async updateIf<T>(
    key: string,
    predicate: (v: T) => boolean,
    mutate: (v: T) => T,
    ttlSec: number,
  ) {
    const e = this.live(key);
    if (!e || !predicate(e.v as T)) return undefined;
    const next = mutate(e.v as T);
    this.m.set(key, { v: next, exp: Date.now() + ttlSec * 1000 });
    return next;
  }
}

// ---------------------------------------------------------------- Redis
const INCR_LUA = `local n = redis.call('INCR', KEYS[1])
if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return n`;

// Compare-and-set on the exact serialized value: succeeds only if nobody changed the key since read.
const CAS_LUA = `local cur = redis.call('GET', KEYS[1])
if cur == ARGV[1] then redis.call('SET', KEYS[1], ARGV[2], 'EX', ARGV[3]) return 1 end
return 0`;

type RedisLike = {
  status: string;
  connect(): Promise<void>;
  get(k: string): Promise<string | null>;
  set(...args: (string | number)[]): Promise<string | null>;
  del(k: string): Promise<number>;
  eval(script: string, numKeys: number, ...args: (string | number)[]): Promise<unknown>;
};

class RedisKV implements KV {
  constructor(private r: RedisLike) {}

  /** Fail fast if Redis is unreachable: no offline queue, no unbounded waiting. */
  private async ready() {
    if (this.r.status === "ready") return;
    if (this.r.status === "wait" || this.r.status === "end") await this.r.connect();
    if (this.r.status !== "ready") throw new Error("redis not ready");
  }
  private ttl = (s: number) => Math.max(1, Math.ceil(s));

  async get<T>(key: string) {
    await this.ready();
    const raw = await this.r.get(key);
    return raw === null ? undefined : (JSON.parse(raw) as T);
  }
  async set<T>(key: string, value: T, ttlSec: number) {
    await this.ready();
    await this.r.set(key, JSON.stringify(value), "EX", this.ttl(ttlSec));
  }
  async setNX<T>(key: string, value: T, ttlSec: number) {
    await this.ready();
    return (await this.r.set(key, JSON.stringify(value), "EX", this.ttl(ttlSec), "NX")) === "OK";
  }
  async del(key: string) {
    await this.ready();
    await this.r.del(key);
  }
  async incr(key: string, ttlSec: number) {
    await this.ready();
    return Number(await this.r.eval(INCR_LUA, 1, key, this.ttl(ttlSec)));
  }
  async updateIf<T>(key: string, predicate: (v: T) => boolean, mutate: (v: T) => T, ttlSec: number) {
    await this.ready();
    for (let attempt = 0; attempt < 8; attempt++) {
      const raw = await this.r.get(key);
      if (raw === null) return undefined;
      const cur = JSON.parse(raw) as T;
      if (!predicate(cur)) return undefined;
      const next = mutate(cur);
      const ok = await this.r.eval(CAS_LUA, 1, key, raw, JSON.stringify(next), this.ttl(ttlSec));
      if (Number(ok) === 1) return next;
      // lost a race with another instance: re-read and re-evaluate the predicate against fresh state
    }
    throw new Error("kv contention");
  }
}

const g = globalThis as unknown as { __drixoKV?: KV };

export function getKV(): KV {
  if (g.__drixoKV) return g.__drixoKV; // survives dev HMR
  const url = process.env.DRIXO_REDIS_URL;
  if (url) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const IORedis = require("ioredis") as typeof import("ioredis");
    const client = new IORedis.default(url, {
      lazyConnect: true,
      enableOfflineQueue: false, // fail fast instead of queueing while Redis is down
      maxRetriesPerRequest: 1,
      connectTimeout: 1500,
      commandTimeout: 1000,
      retryStrategy: (n) => Math.min(n * 200, 2000), // keep reconnecting in the background
    });
    client.on("error", () => undefined); // errors surface per-command and become 503
    g.__drixoKV = new RedisKV(client as unknown as RedisLike);
    return g.__drixoKV;
  }
  if (process.env.NODE_ENV === "production") {
    if (process.env.DRIXO_ALLOW_MEMORY_STORE !== "true") {
      throw new Error("DRIXO_REDIS_URL is required in production (per-process memory is not shared across instances). Set DRIXO_ALLOW_MEMORY_STORE=true to opt in to in-memory storage on a SINGLE-process deployment.");
    }
    // Explicit opt-in: sessions, replay keys and rate limits live in this process only and are lost on restart.
    console.warn("[drixo] DRIXO_ALLOW_MEMORY_STORE=true: using in-memory store; run a single instance only");
  }
  g.__drixoKV = new MemoryKV();
  return g.__drixoKV;
}
