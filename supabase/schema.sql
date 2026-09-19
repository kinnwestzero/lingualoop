-- LinguaLoop private capability-based sync
-- Run this whole migration in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.lingualoop_state (
  id text primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.lingualoop_state enable row level security;

drop policy if exists "personal sync read" on public.lingualoop_state;
drop policy if exists "personal sync insert" on public.lingualoop_state;
drop policy if exists "personal sync update" on public.lingualoop_state;

-- The browser sends the raw private Sync ID only in x-sync-token.
-- Rows store only SHA-256(Sync ID). RLS derives the hash from the request
-- header, so an anonymous client cannot enumerate or read another row.
create policy "personal sync read"
on public.lingualoop_state for select
to anon
using (
  id = encode(
    digest(
      coalesce((current_setting('request.headers', true)::json ->> 'x-sync-token'), ''),
      'sha256'
    ),
    'hex'
  )
);

create policy "personal sync insert"
on public.lingualoop_state for insert
to anon
with check (
  id = encode(
    digest(
      coalesce((current_setting('request.headers', true)::json ->> 'x-sync-token'), ''),
      'sha256'
    ),
    'hex'
  )
);

create policy "personal sync update"
on public.lingualoop_state for update
to anon
using (
  id = encode(
    digest(
      coalesce((current_setting('request.headers', true)::json ->> 'x-sync-token'), ''),
      'sha256'
    ),
    'hex'
  )
)
with check (
  id = encode(
    digest(
      coalesce((current_setting('request.headers', true)::json ->> 'x-sync-token'), ''),
      'sha256'
    ),
    'hex'
  )
);
