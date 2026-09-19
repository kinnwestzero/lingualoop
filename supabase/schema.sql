-- LinguaLoop private single-user sync
create table if not exists public.lingualoop_state (
  id text primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.lingualoop_state enable row level security;

-- This app uses an unguessable personal Sync ID as its capability key.
-- Suitable for a private personal prototype; do not use this policy for a multi-user app.
create policy "personal sync read"
on public.lingualoop_state for select
to anon
using (true);

create policy "personal sync insert"
on public.lingualoop_state for insert
to anon
with check (true);

create policy "personal sync update"
on public.lingualoop_state for update
to anon
using (true)
with check (true);
