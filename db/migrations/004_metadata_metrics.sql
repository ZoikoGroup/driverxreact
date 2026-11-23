-- Drixo migration 004: guest metadata persistence support and privacy-safe daily metrics.
-- Source: Doc 05 sections 04-06 (guest metadata), Doc 05 table 17 (daily_metric) and its note that
-- small-cohort suppression happens in the reporting layer.
-- DEVIATIONS from Doc 05 (additive; update Doc 05 + DBML when approved):
--   turn_metadata.created_at   needed to aggregate by day and to age data for retention
--   refresh_daily_metric()     SECURITY DEFINER aggregation, run by a dedicated worker role
--   daily_metric_reportable    view that hides cells with fewer than 5 turns (k-anonymity floor)
--   drixo_metrics              worker role (aggregate only)
--
-- PRIVACY: nothing here adds a content column. The aggregate has no guest id, session id, text or timestamp
-- finer than a day. The k=5 floor is a proposal; the real threshold is a decision for Privacy (D-04).

alter table drixo.turn_metadata add column created_at timestamptz not null default now();
create index turn_metadata_created_at on drixo.turn_metadata (created_at);

-- Aggregate one UTC day of turns into daily_metric. Idempotent: re-running a day replaces its rows.
create function drixo.refresh_daily_metric(p_day date) returns integer
language plpgsql security definer set search_path = drixo, pg_temp as $$
declare n integer;
begin
  delete from drixo.daily_metric where metric_day = p_day;
  insert into drixo.daily_metric (metric_day, locale, intent_code, response_class, outcome, sample_count)
    select p_day,
           'en-US',
           coalesce(t.intent_code, 'NONE'),
           t.response_class,
           t.outcome,
           count(*)
      from drixo.turn_metadata t
     where t.created_at >= p_day::timestamptz
       and t.created_at <  (p_day + 1)::timestamptz
     group by coalesce(t.intent_code, 'NONE'), t.response_class, t.outcome;
  get diagnostics n = row_count;
  return n;
end $$;

-- What dashboards may read: small cohorts are hidden so a rare combination cannot single anyone out.
create view drixo.daily_metric_reportable with (security_barrier = true) as
  select metric_day, locale, intent_code, response_class, outcome, sample_count
    from drixo.daily_metric
   where sample_count >= 5;

revoke all on function drixo.refresh_daily_metric(date) from public;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'drixo_metrics') then create role drixo_metrics nologin; end if;
end $$;

grant usage on schema drixo to drixo_metrics;
revoke all on all tables in schema drixo from drixo_metrics;
grant execute on function drixo.refresh_daily_metric(date) to drixo_metrics;

-- Analytics reads the thresholded view only, never the raw aggregate table.
revoke all on drixo.daily_metric from drixo_reporting;
grant select on drixo.daily_metric_reportable to drixo_reporting;

-- The public BFF keeps its existing narrow grants (002): insert/select/update on guest_session,
-- insert/select on turn_metadata, turn_source and session_event, insert/select/update on turn_feedback.
-- Nothing is granted on daily_metric or on the aggregation function.
