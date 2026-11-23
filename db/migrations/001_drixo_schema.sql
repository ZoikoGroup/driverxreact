-- Drixo public AI assistant: PostgreSQL schema, migration 001 (forward-only).
-- Source: Document 05 (DXM-DXAI-DB-005) table dictionary; the companion .sql was not in the
-- project, so this DDL is derived from the dictionary + invariants and MUST be peer-reviewed
-- by Data Engineering / Security before any shared environment (Doc 05 milestone M1).
--
-- DEVIATIONS FROM DOC 05 (additive; update Doc 05 + DBML in the same PR that approves them):
--   kb_revision.conflict_status   needed so a source conflict suppresses retrieval (ARC-12, FR-066)
--   kb_chunk.search_aliases       non-displayed title + "user might ask" phrases; what retrieval matches on
--   kb_chunk.search_vec           generated tsvector (Doc 05 asks for a lexical GIN index)
--   publication_audit.action/..   extra action codes INGEST, SUBMIT, CONFLICT_OPEN, CONFLICT_RESOLVED
--
-- PRIVACY: no column exists for raw prompts, assistant text, phone, email, ICCID, IMEI, VIN,
-- payment data, location or IP (DB-01). tests/drixo/db.test.mjs lints this.
-- Retention durations are NOT set here (D-04 open); retention_policy rows start PENDING.

create schema if not exists drixo;

-- ---------------------------------------------------------------- governance
create table drixo.retention_policy (
  retention_class  text primary key,
  store_name       text not null,
  duration_seconds bigint,
  status           text not null default 'PENDING' check (status in ('PENDING', 'APPROVED')),
  approved_by      text,
  approved_at      timestamptz,
  -- Approval cannot be inferred from a blank duration (Doc 05).
  constraint retention_policy_approved_complete check (
    status = 'PENDING' or (duration_seconds > 0 and approved_by is not null and approved_at is not null)
  )
);

-- ---------------------------------------------------------------- knowledge
create table drixo.kb_source (
  source_id        uuid primary key default gen_random_uuid(),
  source_key       text not null unique check (source_key ~ '^[A-Za-z0-9_.-]{1,64}$'),
  canonical_url    text not null check (canonical_url ~ '^https://[A-Za-z0-9.-]+(:[0-9]+)?(/[^[:space:]]*)?$'),
  title            text not null,
  category         text not null,
  owner_team       text not null,
  visibility       text not null default 'PUBLIC' check (visibility = 'PUBLIC'),  -- P0: public only
  status           text not null default 'CANDIDATE' check (status in ('CANDIDATE', 'ACTIVE', 'HOLD', 'RETIRED')),
  last_verified_at timestamptz
);

create table drixo.kb_revision (
  revision_id      uuid primary key default gen_random_uuid(),
  source_id        uuid not null references drixo.kb_source (source_id),
  revision_code    text not null check (revision_code ~ '^[A-Za-z0-9_.@-]{1,80}$'),
  locale           text not null default 'en-US' check (locale = 'en-US'),
  status           text not null default 'DRAFT'
                   check (status in ('DRAFT', 'IN_REVIEW', 'APPROVED', 'RETIRED', 'REVOKED')),
  content_sha256   char(64) not null check (content_sha256 ~ '^[0-9a-f]{64}$'),
  effective_from   timestamptz,
  effective_until  timestamptz,
  approved_by      text,
  approved_at      timestamptz,
  revoked_at       timestamptz,
  conflict_status  text not null default 'NONE' check (conflict_status in ('NONE', 'OPEN')),
  unique (source_id, revision_code),
  constraint kb_revision_window check (effective_until is null or effective_from is null or effective_until > effective_from),
  -- An approved revision always carries who/when/effective window.
  constraint kb_revision_approved_complete check (
    status <> 'APPROVED' or (approved_by is not null and approved_at is not null and effective_from is not null)
  ),
  constraint kb_revision_revoked_stamped check (status <> 'REVOKED' or revoked_at is not null)
);
create index kb_revision_approval_lookup on drixo.kb_revision (status, effective_from, effective_until)
  where status = 'APPROVED';

create table drixo.kb_chunk (
  chunk_id        uuid primary key default gen_random_uuid(),
  revision_id     uuid not null references drixo.kb_revision (revision_id),
  ordinal         integer not null check (ordinal >= 0),
  public_text     text not null check (length(public_text) between 1 and 4000),
  embedding_ref   text,
  search_aliases  text check (search_aliases is null or length(search_aliases) <= 2000),
  -- Retrieval matches the curated title + "user might ask" aliases (editorial intent), not the body
  -- text; body-text matching made unrelated articles answer generic questions. Falls back to the
  -- body only when no aliases were supplied.
  search_vec      tsvector generated always as (
                    to_tsvector('english', coalesce(nullif(search_aliases, ''), public_text))
                  ) stored,
  unique (revision_id, ordinal)
);
create index kb_chunk_search_gin on drixo.kb_chunk using gin (search_vec);

create table drixo.public_link (
  link_id      uuid primary key default gen_random_uuid(),
  link_key     text not null unique check (link_key ~ '^[A-Z0-9_]{2,40}$'),
  label        text not null,
  url          text not null check (url ~ '^https://[A-Za-z0-9.-]+(:[0-9]+)?(/[^[:space:]]*)?$'),
  kind         text not null check (kind in ('SUPPORT', 'SIGN_IN', 'ACTIVATION', 'PLANS', 'COVERAGE', 'PRIVACY', 'FLEET', 'OTHER')),
  status       text not null default 'PENDING' check (status in ('PENDING', 'ACTIVE', 'SUSPENDED')),
  verified_by  text,
  verified_at  timestamptz,
  constraint public_link_active_verified check (status <> 'ACTIVE' or (verified_by is not null and verified_at is not null))
);

create table drixo.publication_audit (
  audit_id     uuid primary key default gen_random_uuid(),
  revision_id  uuid not null references drixo.kb_revision (revision_id),
  action       text not null check (action in (
                 'INGEST', 'SUBMIT', 'APPROVE', 'REJECT', 'REVOKE', 'RETIRE', 'EXPIRE', 'RESTORE',
                 'CONFLICT_OPEN', 'CONFLICT_RESOLVED')),
  actor_ref    text not null check (length(actor_ref) between 1 and 120),
  -- Controlled code, not free text: no sensitive comments in audit (Doc 05).
  reason_code  text not null check (reason_code ~ '^[A-Z0-9_]{2,64}$'),
  created_at   timestamptz not null default now()
);
create index publication_audit_revision on drixo.publication_audit (revision_id, created_at);

-- ---------------------------------------------------------------- experience
create table drixo.release_config (
  config_id           uuid primary key default gen_random_uuid(),
  version_code        text not null unique,
  locale              text not null default 'en-US' check (locale = 'en-US'),
  status              text not null default 'DRAFT' check (status in ('DRAFT', 'ACTIVE', 'RETIRED')),
  uploads             boolean not null default false,
  voice               boolean not null default false,
  live_handoff        boolean not null default false,
  authenticated_tools boolean not null default false,
  supplier_writes     boolean not null default false,
  safety_notice       text not null,
  published_at        timestamptz,
  -- P0 invariant: these powers stay off (DB-15). Enabling one needs a new migration + ADR.
  constraint release_config_p0_flags_off check (
    not uploads and not voice and not live_handoff and not authenticated_tools and not supplier_writes
  )
);
create unique index release_config_one_active on drixo.release_config (locale) where status = 'ACTIVE';

create table drixo.flow_definition (
  flow_id      uuid primary key default gen_random_uuid(),
  flow_code    text not null,
  version_code text not null,
  status       text not null default 'DRAFT' check (status in ('DRAFT', 'ACTIVE', 'RETIRED')),
  owner_team   text not null,
  published_at timestamptz,
  unique (flow_code, version_code)
);

create table drixo.flow_step (
  step_id     uuid primary key default gen_random_uuid(),
  flow_id     uuid not null references drixo.flow_definition (flow_id) on delete cascade,
  step_code   text not null,
  ui_state    text not null check (ui_state in ('S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S11')),
  step_kind   text not null check (step_kind in ('QUESTION', 'GUIDANCE', 'AUTH_GATE', 'SUPPORT', 'NO_SOURCE', 'SECRET_WARNING')),
  public_copy text not null,
  unique (flow_id, step_code),
  unique (flow_id, step_id),  -- target of the same-flow composite FKs below
  -- No markup / scripts / dynamic URLs in reviewed copy (links come from the registry).
  constraint flow_step_copy_safe check (public_copy !~* '(<[a-z/!]|javascript:|data:|https?://)')
);

create table drixo.flow_option (
  option_id        uuid primary key default gen_random_uuid(),
  flow_id          uuid not null,
  step_id          uuid not null,
  option_code      text not null check (option_code ~ '^[A-Za-z0-9_.:-]{1,64}$'),
  label            text not null,
  target_step_id   uuid,
  sort_order       smallint not null,
  unique (step_id, option_code),
  -- Option and target must belong to the SAME flow as the step: no cross-flow transitions (DB-16).
  foreign key (flow_id, step_id) references drixo.flow_step (flow_id, step_id) on delete cascade,
  foreign key (flow_id, target_step_id) references drixo.flow_step (flow_id, step_id)
);

create table drixo.shortcut (
  shortcut_id    uuid primary key default gen_random_uuid(),
  config_id      uuid not null references drixo.release_config (config_id) on delete cascade,
  intent_code    text not null check (intent_code in (
                   'FIX_CONNECTION', 'ACTIVATE_SIM_ESIM', 'PLANS_HOTSPOT', 'BILLING_TOPUPS', 'FLEET_IOT', 'DRIVER_BENEFITS')),
  label          text not null,
  display_order  integer not null check (display_order between 1 and 6),
  target_flow_id uuid references drixo.flow_definition (flow_id),
  unique (config_id, intent_code),
  unique (config_id, display_order)
);

-- ---------------------------------------------------------------- guest metadata
create table drixo.guest_session (
  session_id          uuid primary key,
  capability_hmac     bytea not null,
  locale              text not null default 'en-US' check (locale = 'en-US'),
  mode                text not null default 'GUEST' check (mode = 'GUEST'),
  state               text not null default 'ACTIVE' check (state in ('ACTIVE', 'ENDED', 'EXPIRED')),
  context_version     integer not null default 0 check (context_version >= 0),
  current_ui_state    text not null default 'S01' check (current_ui_state in (
                        'S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10', 'S11', 'S12', 'S13')),
  created_at          timestamptz not null default now(),
  idle_expires_at     timestamptz not null,
  absolute_expires_at timestamptz not null,
  ended_at            timestamptz,
  constraint guest_session_expiry_order check (idle_expires_at <= absolute_expires_at)
);
create index guest_session_expiry on drixo.guest_session (idle_expires_at);

create table drixo.turn_metadata (
  turn_id           uuid primary key,
  session_id        uuid not null references drixo.guest_session (session_id) on delete cascade,
  client_request_id uuid not null,
  context_version   integer not null check (context_version >= 1),
  input_type        text not null check (input_type in ('TEXT', 'SHORTCUT', 'QUICK_REPLY')),
  intent_code       text,
  response_class    text not null check (response_class in (
                      'GUIDANCE', 'QUESTION', 'AUTH_GATE', 'SUPPORT', 'NO_SOURCE', 'SECRET_WARNING')),
  ui_state          text not null check (ui_state in ('S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S11')),
  outcome           text not null check (outcome in ('NONE', 'USER_REPORTED_RESOLVED', 'USER_REPORTED_UNRESOLVED', 'UNKNOWN')),
  correlation_id    text not null,
  unique (session_id, client_request_id),
  unique (session_id, context_version)
);

create table drixo.turn_source (
  turn_id         uuid not null references drixo.turn_metadata (turn_id) on delete cascade,
  revision_id     uuid not null references drixo.kb_revision (revision_id),
  citation_order  smallint not null check (citation_order >= 1),
  primary key (turn_id, revision_id)
);

create table drixo.turn_feedback (
  turn_id     uuid primary key references drixo.turn_metadata (turn_id) on delete cascade,
  helpful     boolean not null,
  reason      text check (reason is null or reason in ('UNCLEAR', 'NOT_RELEVANT', 'OUTDATED', 'OTHER')),
  created_at  timestamptz not null default now()
);

create table drixo.session_event (
  event_id    uuid primary key default gen_random_uuid(),
  session_id  uuid not null references drixo.guest_session (session_id) on delete cascade,
  event_code  text not null check (event_code in (
                'SESSION_STARTED', 'SESSION_ENDED', 'SESSION_EXPIRED', 'CSRF_FAILED', 'ORIGIN_BLOCKED',
                'RATE_LIMITED', 'STALE_CONTEXT', 'SECRET_BLOCKED', 'PROTECTED_BLOCKED')),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------- reporting
create table drixo.daily_metric (
  metric_day     date not null,
  locale         text not null default 'en-US',
  intent_code    text not null,
  response_class text not null,
  outcome        text not null,
  sample_count   bigint not null check (sample_count >= 0),
  primary key (metric_day, locale, intent_code, response_class, outcome)
);

-- ================================================================ integrity triggers
-- Publication audit is append-only.
create function drixo.audit_append_only() returns trigger language plpgsql as $$
begin
  raise exception 'publication_audit is append-only' using errcode = 'insufficient_privilege';
end $$;
create trigger publication_audit_no_update before update or delete on drixo.publication_audit
  for each row execute function drixo.audit_append_only();

-- Chunks are immutable once their revision leaves DRAFT/IN_REVIEW ("immutable-ish" revisions).
create function drixo.chunk_guard() returns trigger language plpgsql as $$
declare st text;
begin
  select status into st from drixo.kb_revision
   where revision_id = coalesce(new.revision_id, old.revision_id);
  if st not in ('DRAFT', 'IN_REVIEW') then
    raise exception 'chunks of a % revision are immutable', st using errcode = 'integrity_constraint_violation';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end $$;
create trigger kb_chunk_guard before insert or update or delete on drixo.kb_chunk
  for each row execute function drixo.chunk_guard();

-- Revision identity is immutable after DRAFT and status moves only along the allowed graph.
create function drixo.revision_guard() returns trigger language plpgsql as $$
begin
  if old.status <> 'DRAFT' and (new.source_id <> old.source_id or new.content_sha256 <> old.content_sha256
                                or new.revision_code <> old.revision_code) then
    raise exception 'revision identity/content hash is immutable after DRAFT' using errcode = 'integrity_constraint_violation';
  end if;
  if new.status <> old.status and not (
       (old.status = 'DRAFT'     and new.status in ('IN_REVIEW', 'REVOKED')) or
       (old.status = 'IN_REVIEW' and new.status in ('DRAFT', 'APPROVED', 'REVOKED')) or
       (old.status = 'APPROVED'  and new.status in ('RETIRED', 'REVOKED')) or
       (old.status = 'RETIRED'   and new.status = 'REVOKED')) then
    raise exception 'illegal revision transition % -> %', old.status, new.status
      using errcode = 'integrity_constraint_violation';
  end if;
  return new;
end $$;
create trigger kb_revision_guard before update on drixo.kb_revision
  for each row execute function drixo.revision_guard();

-- ================================================================ public retrieval view
-- The ONLY way the public BFF reads knowledge. Eligibility is recomputed against now() on every
-- read, so expiry (DB-10) and revocation (DB-09/11) take effect immediately with no app change.
create view drixo.approved_public_chunks with (security_barrier = true) as
select c.chunk_id,
       c.revision_id,
       c.ordinal,
       c.public_text,
       c.search_vec,
       r.revision_code,
       r.content_sha256,
       r.effective_from,
       r.effective_until,
       s.source_id,
       s.source_key,
       s.canonical_url,
       s.title    as source_title,
       s.category as source_category
  from drixo.kb_chunk c
  join drixo.kb_revision r on r.revision_id = c.revision_id
  join drixo.kb_source   s on s.source_id   = r.source_id
 where s.visibility = 'PUBLIC'
   and s.status = 'ACTIVE'
   and r.status = 'APPROVED'
   and r.revoked_at is null
   and r.conflict_status = 'NONE'
   and r.locale = 'en-US'
   and r.effective_from <= now()
   and (r.effective_until is null or r.effective_until > now());

-- ================================================================ publisher functions
-- Publication rules live IN the database so they cannot be bypassed by an app bug. The functions are
-- SECURITY DEFINER (owned by the migration/schema owner, fixed search_path) so the publisher role
-- needs NO direct write grant on kb_* tables: it can only change knowledge through these guarded
-- paths. EXECUTE is revoked from PUBLIC and granted only to the publisher role (002_roles.sql).
-- The public BFF has no EXECUTE and no write on kb_* tables (DB-21).

create function drixo.register_source(p_source_key text, p_canonical_url text, p_title text,
                                      p_category text, p_owner_team text, p_actor text)
returns void language plpgsql security definer set search_path = drixo, pg_temp as $$
begin
  -- New sources are CANDIDATE only; activate_source() is a separate, allowlist-checked step.
  insert into drixo.kb_source (source_key, canonical_url, title, category, owner_team)
    values (p_source_key, p_canonical_url, p_title, p_category, p_owner_team);
end $$;

create function drixo.activate_source(p_source_key text, p_actor text,
                                      p_allowed_hosts text[] default array['driverxmobile.com'])
returns void language plpgsql security definer set search_path = drixo, pg_temp as $$
declare v drixo.kb_source;
begin
  select * into v from drixo.kb_source where source_key = p_source_key for update;
  if not found then raise exception 'unknown source %', p_source_key; end if;
  if split_part(split_part(v.canonical_url, '://', 2), '/', 1) <> all (p_allowed_hosts) then
    raise exception 'source host not in allowlist';
  end if;
  update drixo.kb_source set status = 'ACTIVE', last_verified_at = now() where source_id = v.source_id;
end $$;

-- Draft ingestion: quarantined (DRAFT never appears in the public view). One chunk per article.
create function drixo.add_draft_revision(p_source_key text, p_revision_code text, p_public_text text,
                                         p_aliases text, p_actor text)
returns uuid language plpgsql security definer set search_path = drixo, pg_temp as $$
declare v_source uuid; v_rev uuid; v_hash text;
begin
  select source_id into v_source from drixo.kb_source where source_key = p_source_key;
  if v_source is null then raise exception 'unknown source %', p_source_key; end if;
  v_hash := encode(sha256(convert_to(p_public_text, 'UTF8')), 'hex');
  insert into drixo.kb_revision (source_id, revision_code, content_sha256)
    values (v_source, p_revision_code, v_hash) returning revision_id into v_rev;
  insert into drixo.kb_chunk (revision_id, ordinal, public_text, search_aliases)
    values (v_rev, 0, p_public_text, p_aliases);
  insert into drixo.publication_audit (revision_id, action, actor_ref, reason_code)
    values (v_rev, 'INGEST', p_actor, 'DRAFT_IMPORTED');
  return v_rev;
end $$;

create function drixo.submit_revision(p_revision uuid, p_actor text) returns void language plpgsql security definer set search_path = drixo, pg_temp as $$
begin
  update drixo.kb_revision set status = 'IN_REVIEW' where revision_id = p_revision and status = 'DRAFT';
  if not found then raise exception 'revision not in DRAFT'; end if;
  insert into drixo.publication_audit (revision_id, action, actor_ref, reason_code)
    values (p_revision, 'SUBMIT', p_actor, 'READY_FOR_REVIEW');
end $$;

create function drixo.approve_revision(p_revision uuid, p_approver text, p_effective_from timestamptz,
                                       p_effective_until timestamptz default null,
                                       p_reason text default 'EDITORIAL_APPROVED',
                                       p_dual_control boolean default true)
returns void language plpgsql security definer set search_path = drixo, pg_temp as $$
declare r drixo.kb_revision; s drixo.kb_source; v_hash text; v_submitter text; v_family text;
begin
  select * into r from drixo.kb_revision where revision_id = p_revision for update;
  if not found then raise exception 'unknown revision'; end if;
  if r.status <> 'IN_REVIEW' then raise exception 'revision must be IN_REVIEW to approve (is %)', r.status; end if;
  select * into s from drixo.kb_source where source_id = r.source_id;
  if s.visibility <> 'PUBLIC' or s.status <> 'ACTIVE' then raise exception 'source is not an ACTIVE public source'; end if;
  if r.conflict_status <> 'NONE' then raise exception 'open source conflict blocks approval'; end if;
  if p_effective_from is null then raise exception 'effective_from is required'; end if;
  if p_effective_until is not null and p_effective_until <= p_effective_from then
    raise exception 'effective_until must be after effective_from';
  end if;
  -- Tamper check: stored hash must equal the hash of the exact text that will be served.
  select encode(sha256(convert_to(string_agg(public_text, E'\n' order by ordinal), 'UTF8')), 'hex')
    into v_hash from drixo.kb_chunk where revision_id = p_revision;
  if v_hash is distinct from r.content_sha256 then raise exception 'content hash mismatch: content changed after ingestion'; end if;
  -- Four-eyes: the approver may not be the submitter.
  if p_dual_control then
    select actor_ref into v_submitter from drixo.publication_audit
     where revision_id = p_revision and action = 'SUBMIT' order by created_at desc limit 1;
    if v_submitter is null or v_submitter = p_approver then
      raise exception 'dual control: approver must differ from submitter';
    end if;
  end if;

  -- Supersede earlier approved revisions of the same article ("KB-006@1" -> family "KB-006").
  v_family := split_part(r.revision_code, '@', 1);
  update drixo.kb_revision set status = 'RETIRED'
   where source_id = r.source_id and revision_id <> r.revision_id and status = 'APPROVED'
     and split_part(revision_code, '@', 1) = v_family;
  insert into drixo.publication_audit (revision_id, action, actor_ref, reason_code)
    select revision_id, 'RETIRE', p_approver, 'SUPERSEDED' from drixo.kb_revision
     where source_id = r.source_id and revision_id <> r.revision_id and status = 'RETIRED'
       and split_part(revision_code, '@', 1) = v_family
       and not exists (select 1 from drixo.publication_audit a where a.revision_id = kb_revision.revision_id and a.action = 'RETIRE');

  update drixo.kb_revision
     set status = 'APPROVED', approved_by = p_approver, approved_at = now(),
         effective_from = p_effective_from, effective_until = p_effective_until
   where revision_id = p_revision;
  insert into drixo.publication_audit (revision_id, action, actor_ref, reason_code)
    values (p_revision, 'APPROVE', p_approver, p_reason);
end $$;

-- Emergency revoke: takes effect for the very next read (the view filters on status/revoked_at).
create function drixo.revoke_revision(p_revision uuid, p_actor text, p_reason text) returns void language plpgsql security definer set search_path = drixo, pg_temp as $$
begin
  update drixo.kb_revision set status = 'REVOKED', revoked_at = now()
   where revision_id = p_revision and status <> 'REVOKED';
  if not found then raise exception 'revision not found or already revoked'; end if;
  insert into drixo.publication_audit (revision_id, action, actor_ref, reason_code)
    values (p_revision, 'REVOKE', p_actor, p_reason);
end $$;

create function drixo.open_conflict(p_revision uuid, p_actor text, p_reason text) returns void language plpgsql security definer set search_path = drixo, pg_temp as $$
begin
  update drixo.kb_revision set conflict_status = 'OPEN' where revision_id = p_revision;
  if not found then raise exception 'unknown revision'; end if;
  insert into drixo.publication_audit (revision_id, action, actor_ref, reason_code)
    values (p_revision, 'CONFLICT_OPEN', p_actor, p_reason);
end $$;

create function drixo.resolve_conflict(p_revision uuid, p_actor text, p_reason text) returns void language plpgsql security definer set search_path = drixo, pg_temp as $$
begin
  update drixo.kb_revision set conflict_status = 'NONE' where revision_id = p_revision;
  if not found then raise exception 'unknown revision'; end if;
  insert into drixo.publication_audit (revision_id, action, actor_ref, reason_code)
    values (p_revision, 'CONFLICT_RESOLVED', p_actor, p_reason);
end $$;

revoke all on function
  drixo.register_source(text, text, text, text, text, text),
  drixo.activate_source(text, text, text[]),
  drixo.add_draft_revision(text, text, text, text, text),
  drixo.submit_revision(uuid, text),
  drixo.approve_revision(uuid, text, timestamptz, timestamptz, text, boolean),
  drixo.revoke_revision(uuid, text, text),
  drixo.open_conflict(uuid, text, text),
  drixo.resolve_conflict(uuid, text, text)
from public;
