-- Drixo operations, migration 003: runtime kill switches / canary rollout and the retention worker.
-- Source: Doc 08 sections 15-16 (incident rows, canary + rollback), Doc 05 section 10 (retention).
-- DEVIATION from Doc 05 (additive; update Doc 05 + DBML when approved): runtime_flag, flag_audit,
-- set_flag(), purge_expired_sessions().

-- ---------------------------------------------------------------- runtime flags
create table drixo.runtime_flag (
  flag            text primary key check (flag in ('ASSISTANT', 'KB_RETRIEVAL', 'MODEL_SYNTHESIS')),
  enabled         boolean not null,
  rollout_percent smallint not null check (rollout_percent between 0 and 100),
  changed_by      text not null,
  changed_at      timestamptz not null default now(),
  reason_code     text not null check (reason_code ~ '^[A-Z0-9_]{2,64}$')
);

-- A fresh environment ships DARK: the assistant is enabled but rolled out to 0% until Ops dials it
-- up. KB retrieval is on; synthesis (Phase 5, not built) is off.
insert into drixo.runtime_flag (flag, enabled, rollout_percent, changed_by, reason_code) values
  ('ASSISTANT',       true,  0,   'migration', 'INITIAL_DARK_LAUNCH'),
  ('KB_RETRIEVAL',    true,  100, 'migration', 'INITIAL'),
  ('MODEL_SYNTHESIS', false, 0,   'migration', 'INITIAL_OFF');

create table drixo.flag_audit (
  audit_id        uuid primary key default gen_random_uuid(),
  flag            text not null,
  enabled         boolean not null,
  rollout_percent smallint not null,
  actor_ref       text not null check (length(actor_ref) between 1 and 120),
  reason_code     text not null check (reason_code ~ '^[A-Z0-9_]{2,64}$'),
  created_at      timestamptz not null default now()
);

create trigger flag_audit_no_update before update or delete on drixo.flag_audit
  for each row execute function drixo.audit_append_only();

-- Single-actor on purpose: a kill switch must be fast in an incident. Every change is audited.
create function drixo.set_flag(p_flag text, p_enabled boolean, p_percent integer, p_actor text, p_reason text)
returns void language plpgsql security definer set search_path = drixo, pg_temp as $$
begin
  if p_percent < 0 or p_percent > 100 then raise exception 'rollout percent must be 0-100'; end if;
  update drixo.runtime_flag
     set enabled = p_enabled, rollout_percent = p_percent, changed_by = p_actor,
         changed_at = now(), reason_code = p_reason
   where flag = p_flag;
  if not found then raise exception 'unknown flag %', p_flag; end if;
  insert into drixo.flag_audit (flag, enabled, rollout_percent, actor_ref, reason_code)
    values (p_flag, p_enabled, p_percent, p_actor, p_reason);
end $$;

-- ---------------------------------------------------------------- retention worker
-- Purges guest sessions (turns, citations, feedback, events cascade) whose session ended or expired
-- longer ago than the APPROVED retention duration. FAILS CLOSED: with no approved policy (D-04 open)
-- it refuses to run rather than invent a duration (Doc 05: PENDING policies block launch).
create function drixo.purge_expired_sessions(p_actor text) returns bigint
language plpgsql security definer set search_path = drixo, pg_temp as $$
declare pol drixo.retention_policy; n bigint;
begin
  select * into pol from drixo.retention_policy where retention_class = 'guest_session';
  if not found or pol.status <> 'APPROVED' or pol.duration_seconds is null then
    raise exception 'retention policy guest_session is not approved (D-04): refusing to purge';
  end if;
  delete from drixo.guest_session
   where coalesce(ended_at, least(idle_expires_at, absolute_expires_at)) < now() - make_interval(secs => pol.duration_seconds);
  get diagnostics n = row_count;
  return n;
end $$;

-- ---------------------------------------------------------------- privileges
revoke all on function
  drixo.set_flag(text, boolean, integer, text, text),
  drixo.purge_expired_sessions(text)
from public;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'drixo_ops') then create role drixo_ops nologin; end if;
end $$;

grant usage on schema drixo to drixo_ops;
revoke all on all tables in schema drixo from drixo_ops;
grant select on drixo.runtime_flag, drixo.flag_audit to drixo_ops;
grant execute on function drixo.set_flag(text, boolean, integer, text, text) to drixo_ops;

-- The public BFF may READ flags, never change them.
grant select on drixo.runtime_flag to drixo_bff;

-- The retention worker may run the purge function (and nothing else new).
grant execute on function drixo.purge_expired_sessions(text) to drixo_retention;
