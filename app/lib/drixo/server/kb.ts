// DX-KB: approved-only retrieval (Doc 08 section 8/9, FR-018/061/066).
//
// Reads ONLY drixo.approved_public_chunks. That view recomputes eligibility (APPROVED, effective
// window, not revoked, no open conflict, ACTIVE public source) against now() on every query, so
// revocation and expiry apply immediately and there is deliberately NO answer cache to invalidate.
// A failed or slow DB means "no source", never a guess.
//
// This is extractive RAG: the answer text is the human-approved article text, served verbatim.
// There is no model in the loop in Phase 4 (Phase 5 adds optional, flag-gated synthesis).

import { getSql, type SqlClient } from "./db";
import { emit } from "./telemetry";

export interface KbSource {
  sourceId: string; // stable source_key, e.g. "S01"
  label: string;
  revision: string; // revision_code, e.g. "KB-006@1"
  url: string; // canonical https URL from kb_source
}

export interface KbHit {
  revisionId: string;
  text: string;
  source: KbSource;
  matched: number;
  meaningful: number;
}

const MAX_TOKENS = 12;

// ---- Circuit breaker (Doc 08 section 13: "separate circuit breakers for model and retrieval") ----
// Without it, a dead database makes EVERY knowledge question wait out the connection timeout. After
// N consecutive failures retrieval is skipped (fast NO_SOURCE) for a cooldown, then one trial call
// decides whether to close again. Counters are per instance by design (each instance protects itself).
const bg = globalThis as unknown as { __drixoKbBreaker?: { fails: number; openUntil: number } };
const breaker = () => (bg.__drixoKbBreaker ??= { fails: 0, openUntil: 0 });
const threshold = () => Number(process.env.DRIXO_KB_BREAKER_THRESHOLD) || 3;
const cooldownMs = () => Number(process.env.DRIXO_KB_BREAKER_COOLDOWN_MS) || 15_000;

function breakerOpen(): boolean {
  return breaker().openUntil > Date.now();
}
function recordFailure() {
  const b = breaker();
  b.fails++;
  if (b.fails >= threshold() && !breakerOpen()) {
    b.openUntil = Date.now() + cooldownMs();
    emit("kb_circuit_open", { reasonCode: "DB_FAILURES" });
  }
}
function recordSuccess() {
  const b = breaker();
  if (b.fails >= threshold()) emit("kb_circuit_closed", { reasonCode: "DB_RECOVERED" });
  b.fails = 0;
  b.openUntil = 0;
}
/** Test hook. */
export function resetKbBreaker() {
  bg.__drixoKbBreaker = { fails: 0, openUntil: 0 };
}
const minCoverage = () => Number(process.env.DRIXO_RETRIEVAL_MIN_COVERAGE) || 0.5;

/** Hosts allowed for citation URLs (defense in depth on top of activate_source's allowlist). */
function sourceHosts(): string[] {
  return (process.env.DRIXO_SOURCE_HOSTS ?? "driverxmobile.com")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function citationUrlAllowed(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && !u.username && !u.password && sourceHosts().includes(u.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function tokenize(text: string): string[] {
  const toks = text.toLowerCase().match(/[a-z0-9]{2,}/g) ?? [];
  return [...new Set(toks)].slice(0, MAX_TOKENS);
}

interface TermRow {
  token: string;
  df: number; // approved chunks whose match vector contains this term
  meaningful: boolean; // false for stopwords under the english config
}

interface CandidateRow {
  revision_id: string;
  revision_code: string;
  source_key: string;
  source_title: string;
  canonical_url: string;
  public_text: string;
  matched_tokens: string[];
}

/**
 * Best approved article for the text, or undefined (=> NO_SOURCE).
 *
 * Matching is against each article's curated title + "user might ask" aliases. Terms are weighed
 * by how discriminating they are in the approved corpus: a query like "current data retention"
 * must not be answered by an article that merely shares the common words "current" and "data".
 *  - Informative terms = terms that appear in few approved articles, or in none (an unknown word
 *    like "retention" is the most informative miss of all).
 *  - If the query has informative terms, enough of THEM must match (coverage >= min coverage).
 *  - If it has none (only common words, e.g. "What is DriverX Mobile?"), all meaningful terms
 *    must match the same article.
 * Parameters only; user text never reaches SQL as syntax. Thresholds are first-pass values to be
 * calibrated on the evaluation set with real approved content (Doc 06).
 */
export async function retrieveApprovedTop(
  userText: string,
  max: number,
  sql: SqlClient | undefined = getSql(),
): Promise<KbHit[]> {
  if (!sql) return [];
  const tokens = tokenize(userText);
  if (tokens.length === 0) return [];
  if (breakerOpen()) {
    emit("kb_lookup", { kbResult: "BREAKER_OPEN" });
    return [];
  }
  try {
    const terms = await sql.query<TermRow>(
      `select t as token,
              (select count(*) from drixo.approved_public_chunks c where c.search_vec @@ plainto_tsquery('english', t))::int as df,
              numnode(plainto_tsquery('english', t)) > 0 as meaningful
         from unnest($1::text[]) as t`,
      [tokens],
    );
    const meaningful = terms.filter((t) => t.meaningful);
    if (meaningful.length === 0) {
      recordSuccess();
      return [];
    }
    // Corpus size only sets the "common word" cut-off, so an approximate figure is fine.
    const [{ n }] = await sql.query<{ n: number }>("select count(*)::int as n from drixo.approved_public_chunks");
    if (!n) {
      recordSuccess();
      emit("kb_lookup", { kbResult: "MISS" });
      return [];
    }
    const commonCutoff = Math.max(2, Math.ceil(n * 0.2));
    const informative = meaningful.filter((t) => t.df === 0 || t.df <= commonCutoff).map((t) => t.token);

    const rows = await sql.query<CandidateRow>(
      `select c.revision_id, c.revision_code, c.source_key, c.source_title, c.canonical_url, c.public_text,
              array(select t from unnest($1::text[]) as t where c.search_vec @@ plainto_tsquery('english', t)) as matched_tokens
         from drixo.approved_public_chunks c
        where c.search_vec @@ to_tsquery('english', $2)
        order by ts_rank(c.search_vec, to_tsquery('english', $2)) desc, c.revision_code
        limit 5`,
      [meaningful.map((t) => t.token), meaningful.map((t) => t.token).join(" | ")],
    );

    const hits: KbHit[] = [];
    for (const r of rows) {
      if (hits.length >= max) break;
      const matched = new Set(r.matched_tokens);
      let ok: boolean;
      if (informative.length > 0) {
        const hit = informative.filter((t) => matched.has(t)).length;
        ok = hit >= 1 && hit / informative.length >= minCoverage();
      } else {
        ok = r.matched_tokens.length === meaningful.length;
      }
      if (!ok || !citationUrlAllowed(r.canonical_url)) continue;
      hits.push({
        revisionId: r.revision_id,
        text: r.public_text,
        matched: r.matched_tokens.length,
        meaningful: meaningful.length,
        source: { sourceId: r.source_key, label: r.source_title, revision: r.revision_code, url: r.canonical_url },
      });
    }
    recordSuccess();
    if (hits.length > 0) emit("kb_lookup", { kbResult: "HIT", sourceId: hits[0].source.sourceId });
    else emit("kb_lookup", { kbResult: "MISS" });
    return hits;
  } catch {
    recordFailure();
    emit("kb_lookup", { kbResult: "ERROR" });
    return []; // KB unavailable / slow => safe NO_SOURCE
  }
}

/** Best single approved article, or undefined (=> NO_SOURCE). */
export async function retrieveApproved(
  userText: string,
  sql: SqlClient | undefined = getSql(),
): Promise<KbHit | undefined> {
  return (await retrieveApprovedTop(userText, 1, sql))[0];
}

/**
 * Final eligibility check immediately before a response is committed (DB-11, ARC-11):
 * every cited revision must still be in the approved view. Any error => not approved.
 */
export async function stillApproved(
  revisionIds: string[],
  sql: SqlClient | undefined = getSql(),
): Promise<boolean> {
  if (revisionIds.length === 0) return true;
  if (!sql) return false;
  if (breakerOpen()) return false; // cannot verify => do not serve
  try {
    const rows = await sql.query<{ n: number }>(
      "select count(distinct revision_id)::int as n from drixo.approved_public_chunks where revision_id = any($1::uuid[])",
      [revisionIds],
    );
    recordSuccess();
    return (rows[0]?.n ?? 0) === new Set(revisionIds).size;
  } catch {
    recordFailure();
    return false;
  }
}
