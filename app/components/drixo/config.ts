import type { DrixoConfig } from "./types";

// Phase 2: config now comes from the same-origin BFF (Doc 04 GET /config). The browser
// never supplies links or flags; if this fails the widget shows the static fallback below
// instead of inventing cards (Doc 08 section 13).
export async function getDrixoConfig(): Promise<DrixoConfig> {
  const res = await fetch("/api/v1/drixo/public/config", {
    headers: { Accept: "application/json" },
    credentials: "same-origin",
  });
  if (!res.ok) throw new Error(`config ${res.status}`);
  return (await res.json()) as DrixoConfig;
}

// Static fallback when config cannot load: no session, no invented cards, just the
// published support route. Placeholder until D-01 / D-05 are closed.
export const FALLBACK_SUPPORT = { label: "Visit support", href: "/24-7-driver-support" };
