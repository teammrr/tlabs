-- "Got a problem?" submissions. Safe to run more than once.
-- Written for Postgres 13+ (Supabase and Neon both qualify).

create table if not exists problem_submissions (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  locale              text not null check (locale in ('en', 'th')),
  problem             text not null check (char_length(problem) between 1 and 2000),
  who_has_it          text check (char_length(who_has_it) <= 200),
  current_workaround  text check (char_length(current_workaround) <= 300),
  category            text[] not null default '{}',
  nickname            text check (char_length(nickname) <= 80),
  email               text check (char_length(email) <= 200),
  line_id             text check (char_length(line_id) <= 80),
  consent_given       boolean not null default false,
  consent_text_version text,
  status              text not null default 'new' check (status in ('new', 'reviewed', 'archived')),
  -- Contact details may only be stored together with consent (PDPA).
  constraint contact_requires_consent check (
    (nickname is null and email is null and line_id is null)
    or (consent_given and consent_text_version is not null)
  )
);

create index if not exists problem_submissions_status_created_idx
  on problem_submissions (status, created_at desc);

-- Coarse abuse limiter. Keys are HMAC hashes of the IP plus an hour bucket,
-- never the IP itself. Old rows are pruned by the API.
create table if not exists problem_rate_limits (
  key        text primary key,
  hits       integer not null default 1,
  created_at timestamptz not null default now()
);

-- Lock the tables down. The app connects with a server-side role that bypasses RLS;
-- with RLS on and no policies, Supabase's public (anon/authenticated) API sees nothing.
alter table problem_submissions enable row level security;
alter table problem_rate_limits enable row level security;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on problem_submissions, problem_rate_limits from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on problem_submissions, problem_rate_limits from authenticated;
  end if;
end $$;
