-- Convenience view for the weekly review: new submissions from the last 7 days.
-- security_invoker makes the view obey the caller's RLS, so it is not a back door
-- around the lock-down in 001. Safe to run more than once.

create or replace view problem_submissions_new_this_week
  with (security_invoker = true) as
  select id, created_at, locale, problem, who_has_it, current_workaround, category,
         nickname, email, line_id, consent_given
  from problem_submissions
  where status = 'new' and created_at >= now() - interval '7 days'
  order by created_at desc;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on problem_submissions_new_this_week from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on problem_submissions_new_this_week from authenticated;
  end if;
end $$;
