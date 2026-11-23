// HTTP helpers: RFC 7807 problem+json, correlation IDs, strict JSON body parsing.
// Uses only Web-standard Request/Response so it stays testable outside Next.

import { randomUUID } from "node:crypto";

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function correlationId(req: Request): string {
  const h = req.headers.get("x-request-id");
  return h && UUID_RE.test(h) ? `req-${h}` : `req-${randomUUID()}`;
}

export type ProblemCode =
  | "INVALID_INPUT"
  | "PAYLOAD_TOO_LARGE"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "UNAUTHORIZED"
  | "CSRF_FAILED"
  | "ORIGIN_BLOCKED"
  | "SESSION_NOT_FOUND"
  | "NOT_FOUND"
  | "STALE_CONTEXT"
  | "IDEMPOTENCY_CONFLICT"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE";

const TITLES: Record<number, string> = {
  404: "Not found",
  409: "Request conflicts with current state",
  503: "Service temporarily unavailable",
};

// Deliberately generic `detail`: never echo input, never leak internals.
export function problem(
  status: number,
  code: ProblemCode,
  correlation: string,
  opts: { detail?: string; retryable?: boolean; headers?: Record<string, string> } = {},
): Response {
  return new Response(
    JSON.stringify({
      type: "about:blank",
      title: TITLES[status] ?? "Request cannot be completed",
      status,
      code,
      detail: opts.detail ?? "Please try again later or use official support.",
      correlationId: correlation,
      retryable: opts.retryable ?? false,
    }),
    {
      status,
      headers: {
        "Content-Type": "application/problem+json",
        "Cache-Control": "no-store",
        ...opts.headers,
      },
    },
  );
}

export function json(
  status: number,
  body: unknown,
  headers: Record<string, string | string[]> = {},
): Response {
  const h = new Headers({ "Content-Type": "application/json", "Cache-Control": "no-store" });
  for (const [k, v] of Object.entries(headers)) {
    if (Array.isArray(v)) v.forEach((x) => h.append(k, x));
    else h.set(k, v);
  }
  return new Response(JSON.stringify(body), { status, headers: h });
}

export type BodyResult =
  | { ok: true; raw: string; value: unknown }
  | { ok: false; status: 400 | 413 | 415 };

export async function readJsonBody(req: Request, maxBytes: number): Promise<BodyResult> {
  const ct = (req.headers.get("content-type") ?? "").toLowerCase();
  if (!ct.startsWith("application/json")) return { ok: false, status: 415 };
  const declared = Number(req.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) return { ok: false, status: 413 };
  const raw = await req.text();
  if (Buffer.byteLength(raw, "utf8") > maxBytes) return { ok: false, status: 413 };
  try {
    return { ok: true, raw, value: JSON.parse(raw) };
  } catch {
    return { ok: false, status: 400 };
  }
}

/** Order-independent JSON for idempotency body comparison. */
export function stableStringify(v: unknown): string {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(",")}]`;
  const o = v as Record<string, unknown>;
  return `{${Object.keys(o)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${stableStringify(o[k])}`)
    .join(",")}}`;
}

export const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** True if obj has any key not in allowed (strict unknown-field rejection). */
export const hasUnknownKeys = (obj: Record<string, unknown>, allowed: string[]) =>
  Object.keys(obj).some((k) => !allowed.includes(k));
