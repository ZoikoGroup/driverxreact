// Postgres access for the public BFF (Doc 05 / Doc 08 DX-STORE).
//
// The BFF connects as the least-privilege `drixo_bff` role (002_roles.sql): it can read the
// approved_public_chunks view and write guest metadata, nothing else. Never point
// DRIXO_DATABASE_URL at an owner or superuser (ARC-15). Publication uses a different URL
// (DRIXO_PUBLISHER_DATABASE_URL) and lives in scripts/drixo-kb.mjs, never in this process.
//
// If DRIXO_DATABASE_URL is unset there is no knowledge base: retrieval returns nothing and the
// assistant answers NO_SOURCE. That is the safe default, not an error.

import type { Pool } from "pg";

export interface SqlClient {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
}

const g = globalThis as unknown as { __drixoPool?: Pool; __drixoSql?: SqlClient };

export function getSql(): SqlClient | undefined {
  const url = process.env.DRIXO_DATABASE_URL;
  if (!url) return undefined;
  if (g.__drixoSql) return g.__drixoSql;

  // Required lazily so builds and non-DB deployments never load the driver.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool: PgPool } = require("pg") as typeof import("pg");
  const pool = new PgPool({
    connectionString: url,
    max: Number(process.env.DRIXO_DB_POOL_MAX) || 5,
    connectionTimeoutMillis: 1500,
    idleTimeoutMillis: 10_000,
    statement_timeout: 2000, // bounded deadline: a slow DB degrades to NO_SOURCE, never hangs a turn
    application_name: "drixo-bff",
  });
  // A dropped idle connection must not crash the server.
  pool.on("error", () => undefined);
  g.__drixoPool = pool;
  g.__drixoSql = {
    async query<T>(text: string, params: unknown[] = []) {
      const res = await pool.query(text, params);
      return res.rows as T[];
    },
  };
  return g.__drixoSql;
}
