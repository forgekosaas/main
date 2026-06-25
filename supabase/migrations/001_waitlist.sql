create extension if not exists "pgcrypto";

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  source text check (source in ('hero', 'solution', 'cta_final')),
  country text,
  user_agent text,
  confirmed boolean not null default false,
  confirmed_at timestamptz,
  consent_marketing boolean not null default false,
  resend_message_id text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists page_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  created_at timestamptz not null default now(),
  session_id text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_waitlist_confirmed_created_at on waitlist (confirmed, created_at desc);
create index if not exists idx_page_events_type_created_at on page_events (event_type, created_at desc);

alter table waitlist enable row level security;
alter table page_events enable row level security;

drop policy if exists "Public waitlist insert" on waitlist;
create policy "Public waitlist insert" on waitlist
  for insert
  with check (
    email is not null
    and consent_marketing = true
  );

drop policy if exists "Public page event insert" on page_events;
create policy "Public page event insert" on page_events
  for insert
  with check (event_type is not null);

drop policy if exists "Service role waitlist access" on waitlist;
create policy "Service role waitlist access" on waitlist
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Service role page events access" on page_events;
create policy "Service role page events access" on page_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
