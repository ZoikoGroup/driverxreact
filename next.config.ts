import type { NextConfig } from "next";

// Response hardening for the Drixo public API only (Doc 08 section 11: "safe content handling").
// These are JSON responses: they must never be framed, sniffed, cached by intermediaries, or leak the
// referrer. A site-wide CSP / HSTS belongs at the edge (decision for Platform/SRE) and is not set here
// so the rest of the website is unaffected.
const drixoApiHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Content-Security-Policy", value: "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  // Opt-in build directory. The default stays ".next". Setting NEXT_DIST_DIR lets a second dev server (for
  // example the certification run's) coexist with one you already have open: both would otherwise share
  // the same lock under .next/dev and the second refuses to start.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Do not advertise the framework in every response (information disclosure).
  poweredByHeader: false,
  images: {
    domains: ["api.driverxmobile.com"],
  },
  async headers() {
    return [{ source: "/api/v1/drixo/:path*", headers: drixoApiHeaders }];
  },
};

export default nextConfig;
