-- Mousik: one row per user holding settings + learning progress.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  onboarded boolean not null default false,
  settings jsonb not null default '{}'::jsonb,
  progress jsonb not null default '{}'::jsonb,
  updated_at_ms bigint not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles
  for insert with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
