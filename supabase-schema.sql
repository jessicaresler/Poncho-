-- ============================================
-- Poncho: Supabase Database Schema
-- ============================================

-- 1. Events table — stores each event as a JSONB document
--    This keeps the migration simple: same shape as localStorage
create table public.events (
  id text primary key,
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Trash table — soft-deleted events
create table public.trash (
  id text primary key,
  data jsonb not null,
  deleted_at timestamptz default now()
);

-- 3. Completed tasks — tracks checkbox state per event
create table public.completed (
  event_id text not null,
  completed jsonb not null default '{}'::jsonb,
  primary key (event_id)
);

-- 4. Enable Row Level Security on all tables
alter table public.events enable row level security;
alter table public.trash enable row level security;
alter table public.completed enable row level security;

-- 5. RLS Policies — allow all authenticated users to read/write
--    (For a small team app, this is the right level of access)
create policy "Authenticated users can read events"
  on public.events for select
  to authenticated
  using (true);

create policy "Authenticated users can insert events"
  on public.events for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update events"
  on public.events for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete events"
  on public.events for delete
  to authenticated
  using (true);

create policy "Authenticated users can read trash"
  on public.trash for select
  to authenticated
  using (true);

create policy "Authenticated users can insert trash"
  on public.trash for insert
  to authenticated
  with check (true);

create policy "Authenticated users can delete trash"
  on public.trash for delete
  to authenticated
  using (true);

create policy "Authenticated users can read completed"
  on public.completed for select
  to authenticated
  using (true);

create policy "Authenticated users can upsert completed"
  on public.completed for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update completed"
  on public.completed for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete completed"
  on public.completed for delete
  to authenticated
  using (true);

-- 6. Auto-update the updated_at timestamp on events
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger events_updated_at
  before update on public.events
  for each row execute function public.update_updated_at();
