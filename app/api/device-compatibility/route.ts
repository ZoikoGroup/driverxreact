import { NextResponse } from "next/server";
import { cleanImei, getImeiError } from "../../utils/imei";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Server-side eSIM compatibility check.
 *
 * Runs the same provider chain the browser used to run directly:
 *   1. GoLite   esim_check     (cached results)
 *   2. BeQuick  query_device_info (on success, tell GoLite via esim_update)
 *   3. GoLite   esim_v_check   (final fallback)
 *
 * Keeping it here means the provider keys never reach the browser, and an
 * empty / non-JSON provider reply is handled instead of crashing the UI.
 *
 * Env: prefer server-only ESIM_SECRET_KEY / BEQUICK_TOKEN; falls back to the
 * existing NEXT_PUBLIC_* names so nothing breaks before the env is updated.
 */

const GOLITE_URL = "https://goliteapi.golitemobile.com/api/device_compatibility_checker/";
const BEQUICK_URL = "https://zoiko-atom-api.bequickapps.com/carriers/3/query_device_info";
const TIMEOUT_MS = 15_000;

const goliteKey = () => process.env.ESIM_SECRET_KEY || process.env.NEXT_PUBLIC_ESIM_SECRET_KEY || "";
const bequickToken = () => process.env.BEQUICK_TOKEN || process.env.NEXT_PUBLIC_BEQUICK_TOKEN || "";

/** POST JSON to a provider. Returns parsed JSON, or null if the call failed / reply was unusable. */
async function callProvider(
  name: string,
  url: string,
  headers: Record<string, string>,
  body: unknown
): Promise<any | null> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    const text = await res.text();
    if (!res.ok || !text.trim()) {
      console.warn(`[device-compatibility] ${name}: HTTP ${res.status}${text.trim() ? "" : " (empty body)"}`);
      return null;
    }
    try {
      return JSON.parse(text);
    } catch {
      console.warn(`[device-compatibility] ${name}: non-JSON reply (HTTP ${res.status})`, text.slice(0, 200));
      return null;
    }
  } catch (err) {
    console.warn(`[device-compatibility] ${name}: request failed`, err);
    return null;
  }
}

const golite = (action: string, imei: string) =>
  callProvider(`GoLite ${action}`, GOLITE_URL, { "X-Secret-Key": goliteKey() }, { action, imei });

export async function POST(req: Request) {
  let imei = "";
  try {
    const body = await req.json();
    imei = cleanImei(String(body?.imei ?? ""));
  } catch {
    // fall through to validation
  }

  const invalidReason = getImeiError(imei);
  if (invalidReason) {
    return NextResponse.json({ error: invalidReason }, { status: 400 });
  }

  // 1. GoLite cache
  const cached = await golite("esim_check", imei);
  if (cached?.compatible === true) {
    return NextResponse.json({ compatible: true, source: "golite" });
  }

  // 2. BeQuick
  const bequick = await callProvider(
    "BeQuick query_device_info",
    BEQUICK_URL,
    { "X-AUTH-TOKEN": bequickToken() },
    { device_serial: imei }
  );
  if (bequick?.esim_compatible === true) {
    // Record it in GoLite for next time (failure here doesn't affect the answer).
    await golite("esim_update", imei);
    return NextResponse.json({ compatible: true, source: "bequick" });
  }

  // 3. GoLite final check
  const finalCheck = await golite("esim_v_check", imei);
  if (finalCheck?.esimCompatible === true) {
    return NextResponse.json({ compatible: true, source: "golite_v" });
  }

  // Nothing answered at all -> we genuinely don't know; don't report "not compatible".
  if (cached === null && bequick === null && finalCheck === null) {
    return NextResponse.json(
      { error: "Device check is temporarily unavailable. Please try again or skip this step." },
      { status: 502 }
    );
  }

  return NextResponse.json({ compatible: false });
}
