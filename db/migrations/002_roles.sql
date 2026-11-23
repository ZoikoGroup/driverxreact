-- Drixo least-privilege roles, migration 002. REVIEW ARTIFACT (Doc 05 section 10, Doc 08 section 10).
-- Role creation is often not permitted on managed Postgres or is done by IaC; adapt the CREATE ROLE
-- statements to your platform. The application must NOT own the schema or use a superuser (ARC-15).
-- Login credentials/passwords are provisioned outside this file (vault); roles here are NOLOGIN
-- group roles that your login roles should be granted membership in.

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'drixo_bff')       then create role drixo_bff nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'drixo_publisher') then create role drixo_publisher nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'drixo_retention') then create role drixo_retention nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'drixo_reporting') then create role drixo_reporting nologin; end if;
end $$;

grant usage on schema drixo to drixo_bff, drixo_publisher, drixo_retention, drixo_reporting;

-- ---- Public BFF: read approved knowledge via the view only; write only guest metadata ----
revoke all on all tables in schema drixo from drixo_bff;
grant select on drixo.approved_public_chunks to drixo_bff;
grant select, insert, update on drixo.guest_session to drixo_bff;
grant select, insert on drixo.turn_metadata, drixo.turn_source, drixo.session_event to drixo_bff;
grant select, insert, update on drixo.turn_feedback to drixo_bff;
-- Config, shortcuts and flows are read-only to the BFF.
grant select on drixo.release_config, drixo.shortcut, drixo.flow_definition, drixo.flow_step,
                drixo.flow_option, drixo.public_link to drixo_bff;
-- Deliberately NOT granted to drixo_bff: kb_source, kb_revision, kb_chunk, publication_audit,
-- retention_policy, daily_metric, and EXECUTE on any publisher function.

-- ---- Knowledge publisher: manages kb_* and audit through the guarded functions ----
revoke all on all tables in schema drixo from drixo_publisher;
-- Read-only on tables; ALL writes go through the SECURITY DEFINER functions below.
grant select on drixo.kb_source, drixo.kb_revision, drixo.kb_chunk, drixo.publication_audit,
                drixo.approved_public_chunks to drixo_publisher;
grant execute on function
  drixo.register_source(text, text, text, text, text, text),
  drixo.activate_source(text, text, text[]),
  drixo.add_draft_revision(text, text, text, text, text),
  drixo.submit_revision(uuid, text),
  drixo.approve_revision(uuid, text, timestamptz, timestamptz, text, boolean),
  drixo.revoke_revision(uuid, text, text),
  drixo.open_conflict(uuid, text, text),
  drixo.resolve_conflict(uuid, text, text)
to drixo_publisher;
-- The publisher can read no guest data (no grant on guest_session / turn_*).

-- ---- Retention worker: purge expired guest sessions only; cascades remove metadata ----
revoke all on all tables in schema drixo from drixo_retention;
grant select, delete on drixo.guest_session to drixo_retention;
grant select on drixo.retention_policy to drixo_retention;

-- ---- Reporting: aggregates only ----
revoke all on all tables in schema drixo from drixo_reporting;
grant select on drixo.daily_metric to drixo_reporting;
