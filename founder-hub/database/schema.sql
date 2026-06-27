create table if not exists founder_hub_sources (
  id text primary key,
  kind text not null check (kind in ('reddit', 'x', 'indie-hackers', 'hacker-news', 'gmail', 'analytics')),
  label text not null,
  url text,
  created_at timestamptz not null default now()
);

create table if not exists founder_hub_community_items (
  id text primary key,
  source text not null check (source in ('reddit', 'x', 'indie-hackers', 'hacker-news')),
  title text not null,
  author text not null,
  url text not null,
  summary text not null,
  pain_point text not null,
  user_language jsonb not null default '[]'::jsonb,
  post_angle text not null default '',
  relevance_score integer not null check (relevance_score between 0 and 100),
  suggested_reply text not null,
  reply_rationale text not null,
  created_at timestamptz not null
);

create table if not exists founder_hub_emails (
  id text primary key,
  sender text not null,
  subject text not null,
  snippet text not null,
  category text not null check (category in ('Waitlist', 'Feedback', 'Bug', 'Feature Request', 'Altro')),
  summary text not null,
  pain_point text not null,
  created_at timestamptz not null
);

create table if not exists founder_hub_analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  visitors integer not null,
  unique_visitors integer not null,
  conversions integer not null,
  conversion_rate numeric not null,
  waitlist_signups integer not null default 0,
  waitlist_confirmed integer not null default 0,
  waitlist_conversion_rate numeric not null default 0,
  waitlist_sources jsonb not null default '[]'::jsonb,
  page_events jsonb not null default '[]'::jsonb,
  top_referrers jsonb not null default '[]'::jsonb,
  top_pages jsonb not null default '[]'::jsonb,
  top_clicks jsonb not null default '[]'::jsonb,
  trend jsonb not null default '[]'::jsonb,
  ai_explanation text not null,
  created_at timestamptz not null default now()
);

create table if not exists founder_hub_insights (
  id text primary key,
  title text not null,
  summary text not null,
  evidence_ids text[] not null default '{}',
  created_at timestamptz not null
);

create table if not exists founder_hub_memory (
  id text primary key,
  date date not null,
  title text not null,
  motivation text not null,
  sources text[] not null default '{}',
  consequences text not null,
  created_at timestamptz not null default now()
);

create table if not exists founder_hub_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists founder_hub_community_score_idx on founder_hub_community_items (relevance_score desc);
create index if not exists founder_hub_emails_created_idx on founder_hub_emails (created_at desc);
create index if not exists founder_hub_memory_date_idx on founder_hub_memory (date desc);

alter table founder_hub_sources drop constraint if exists founder_hub_sources_kind_check;
alter table founder_hub_sources add constraint founder_hub_sources_kind_check
  check (kind in ('reddit', 'x', 'indie-hackers', 'hacker-news', 'gmail', 'analytics'));

alter table founder_hub_community_items drop constraint if exists founder_hub_community_items_source_check;
alter table founder_hub_community_items add constraint founder_hub_community_items_source_check
  check (source in ('reddit', 'x', 'indie-hackers', 'hacker-news'));

alter table founder_hub_community_items add column if not exists user_language jsonb not null default '[]'::jsonb;
alter table founder_hub_community_items add column if not exists post_angle text not null default '';

alter table founder_hub_analytics_snapshots add column if not exists waitlist_signups integer not null default 0;
alter table founder_hub_analytics_snapshots add column if not exists waitlist_confirmed integer not null default 0;
alter table founder_hub_analytics_snapshots add column if not exists waitlist_conversion_rate numeric not null default 0;
alter table founder_hub_analytics_snapshots add column if not exists waitlist_sources jsonb not null default '[]'::jsonb;
alter table founder_hub_analytics_snapshots add column if not exists page_events jsonb not null default '[]'::jsonb;
alter table founder_hub_analytics_snapshots add column if not exists top_clicks jsonb not null default '[]'::jsonb;
