// Browser client for the five Drixo public endpoints (Doc 04).
//
// Security notes:
//  - The guest capability lives in an HttpOnly cookie the browser sends automatically; this
//    module never sees it. Only sessionId / csrfToken / contextVersion are held, in memory
//    for this tab. Nothing is written to localStorage, URLs or telemetry.
//  - Retries reuse the SAME Idempotency-Key and clientRequestId so a retried turn can never
//    create a second turn (FR-023). Automatic retries are bounded; 429 is never auto-retried.

import type { TurnResult } from "./types";

const BASE = "/api/v1/drixo/public";
const MAX_AUTO_RETRIES = 2;

export type DrixoErrorCode =
  | "STALE_CONTEXT" // quick reply / context out of date; offer restart
  | "SESSION_EXPIRED" // cookie/session gone or CSRF failed; a new session is needed
  | "RATE_LIMITED"
  | "UNAVAILABLE" // 5xx / network after bounded retries
  | "INVALID"
  | "UNKNOWN";

export class DrixoApiError extends Error {
  constructor(
    public code: DrixoErrorCode,
    public retryable: boolean,
    public retryAfterSec?: number,
  ) {
    super(code);
  }
}

export type TurnInput =
  | { type: "TEXT"; text: string }
  | { type: "SHORTCUT"; intentCode: string }
  | { type: "QUICK_REPLY"; stepId: string; optionId: string };

interface Pending {
  inputJson: string;
  key: string;
  clientRequestId: string;
  contextVersion: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const uuid = () => crypto.randomUUID();

export class DrixoClient {
  private sessionId?: string;
  private csrf?: string;
  private v = 0;
  private pending?: Pending; // a retryable failed turn, replayed with its original identity
  private creating?: Promise<void>;

  hasSession() {
    return !!this.sessionId;
  }

  reset() {
    this.sessionId = undefined;
    this.csrf = undefined;
    this.v = 0;
    this.pending = undefined;
    this.creating = undefined;
  }

  private async post(path: string, body: unknown, key: string, withCsrf: boolean): Promise<Response> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Idempotency-Key": key,
      "X-Request-ID": uuid(),
    };
    if (withCsrf && this.csrf) headers["X-Drixo-CSRF"] = this.csrf;
    return fetch(`${BASE}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      credentials: "same-origin",
      cache: "no-store",
    });
  }

  /** POST with bounded automatic retry on network failure / 503 / 504, same key + body. */
  private async postWithRetry(path: string, body: unknown, key: string, withCsrf: boolean): Promise<Response> {
    let lastErr: unknown;
    for (let attempt = 0; attempt <= MAX_AUTO_RETRIES; attempt++) {
      try {
        const res = await this.post(path, body, key, withCsrf);
        if (res.status !== 503 && res.status !== 504) return res;
        lastErr = new DrixoApiError("UNAVAILABLE", true);
      } catch {
        lastErr = new DrixoApiError("UNAVAILABLE", true);
      }
      if (attempt < MAX_AUTO_RETRIES) await sleep(600 * (attempt + 1));
    }
    throw lastErr;
  }

  private fail(res: Response): never {
    if (res.status === 409) throw new DrixoApiError("STALE_CONTEXT", false);
    if (res.status === 429) {
      throw new DrixoApiError("RATE_LIMITED", true, Number(res.headers.get("retry-after")) || undefined);
    }
    if (res.status === 404 || res.status === 401 || res.status === 403) {
      this.reset();
      throw new DrixoApiError("SESSION_EXPIRED", false);
    }
    if (res.status === 400 || res.status === 413 || res.status === 415) throw new DrixoApiError("INVALID", false);
    if (res.status >= 500) throw new DrixoApiError("UNAVAILABLE", true);
    throw new DrixoApiError("UNKNOWN", false);
  }

  async ensureSession(): Promise<void> {
    if (this.sessionId) return;
    this.creating ??= (async () => {
      const res = await this.postWithRetry(
        "/sessions",
        { locale: "en-US", clientInstanceId: uuid() },
        uuid(),
        false,
      );
      if (res.status !== 201) this.fail(res);
      const j = await res.json();
      this.sessionId = j.sessionId;
      this.csrf = j.csrfToken;
      this.v = j.contextVersion ?? 0;
    })().finally(() => {
      this.creating = undefined;
    });
    await this.creating;
  }

  async turn(input: TurnInput): Promise<{ turnId: string; result: TurnResult }> {
    await this.ensureSession();
    const inputJson = JSON.stringify(input);

    // Reuse the original identity only for a retry of the same failed input.
    const p: Pending =
      this.pending && this.pending.inputJson === inputJson
        ? this.pending
        : { inputJson, key: uuid(), clientRequestId: uuid(), contextVersion: this.v };

    try {
      const res = await this.postWithRetry(
        `/sessions/${this.sessionId}/turns`,
        { clientRequestId: p.clientRequestId, contextVersion: p.contextVersion, input },
        p.key,
        true,
      );
      if (res.status !== 200) this.fail(res);
      const j = await res.json();
      this.v = j.contextVersion;
      this.pending = undefined;
      return { turnId: j.turnId, result: j.result as TurnResult };
    } catch (e) {
      if (e instanceof DrixoApiError && e.retryable) this.pending = p;
      else this.pending = undefined;
      throw e;
    }
  }

  async feedback(turnId: string, helpful: boolean): Promise<void> {
    if (!this.sessionId) return;
    const res = await this.postWithRetry(
      `/sessions/${this.sessionId}/feedback`,
      { turnId, helpful },
      uuid(),
      true,
    );
    if (res.status !== 202) this.fail(res);
  }

  /** Revoke the server-side guest capability. Always resets local state, even on failure. */
  async end(reason: "USER_ENDED" | "RESTARTED"): Promise<void> {
    const id = this.sessionId;
    try {
      if (id) await this.postWithRetry(`/sessions/${id}/end`, { reason }, uuid(), true);
    } catch {
      /* local reset below; the server session also expires on its own */
    } finally {
      this.reset();
    }
  }
}
