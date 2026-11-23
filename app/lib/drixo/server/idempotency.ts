// Idempotency / replay (Doc 04): same key + same canonical body => same outcome;
// same key + different body => 409 IDEMPOTENCY_CONFLICT.
//
// Stored responses live only in the ephemeral KV with a short TTL and are never
// persisted durably. Responses for POST /sessions contain a Set-Cookie value, so the
// replay cache must be a private, server-only store (Doc 08 DX-KV).

import { limits } from "./env";
import { problem, stableStringify } from "./http";
import { hmac } from "./security";
import { getKV } from "./store";

interface Stored {
  bodyHash: string;
  state: "pending" | "done";
  status?: number;
  body?: string;
  headers?: [string, string][];
}

export async function withIdempotency(
  scope: string,
  key: string,
  canonicalBody: unknown,
  cid: string,
  produce: () => Promise<Response>,
): Promise<Response> {
  const kv = getKV();
  const k = `i:${scope}:${key}`;
  const bodyHash = hmac(`body:${stableStringify(canonicalBody)}`);

  // The in-flight marker is short-lived: if the process or Redis dies mid-request, a retry with the
  // same key must not be blocked for the whole replay window.
  const claimed = await kv.setNX<Stored>(k, { bodyHash, state: "pending" }, Math.min(limits.replayTtlSec, 30));
  if (!claimed) {
    const prev = await kv.get<Stored>(k);
    if (!prev || prev.bodyHash !== bodyHash) {
      return problem(409, "IDEMPOTENCY_CONFLICT", cid, {
        detail: "Use a new request identifier.",
      });
    }
    if (prev.state === "pending" || prev.status === undefined) {
      // Original still in flight: same body, retry shortly. No second execution.
      return problem(409, "IDEMPOTENCY_CONFLICT", cid, {
        detail: "The original request is still processing.",
        retryable: true,
        headers: { "Retry-After": "1" },
      });
    }
    return new Response(prev.status === 204 || !prev.body ? null : prev.body, {
      status: prev.status,
      headers: [...(prev.headers ?? []), ["Idempotent-Replay", "true"]],
    });
  }

  let res: Response;
  try {
    res = await produce();
  } catch (e) {
    await kv.del(k); // allow a clean retry; nothing was committed
    throw e;
  }

  // Only successful outcomes are replayable. Errors release the key so a corrected retry works.
  if (res.status >= 200 && res.status < 300) {
    const body = res.status === 204 ? "" : await res.clone().text();
    const headers: [string, string][] = [];
    res.headers.forEach((v, name) => {
      if (name !== "set-cookie") headers.push([name, v]);
    });
    // Preserve every Set-Cookie for replay of POST /sessions.
    const cookies = (res.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.() ?? [];
    cookies.forEach((c) => headers.push(["set-cookie", c]));
    await kv.set<Stored>(
      k,
      { bodyHash, state: "done", status: res.status, body, headers },
      limits.replayTtlSec,
    );
  } else {
    await kv.del(k);
  }
  return res;
}
