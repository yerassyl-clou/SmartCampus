create table if not exists ai_usage (
  id uuid primary key default gen_random_uuid(),
  owner_key uuid not null references auth_profiles(owner_key) on delete cascade,
  partition text not null,
  window_start timestamptz not null,
  amount integer not null check (amount >= 0),
  reservation_key text not null,
  unique (owner_key, reservation_key)
);

create table if not exists quota_limits (
  partition text primary key,
  limit_amount integer not null check (limit_amount >= 0)
);

create table if not exists cleanup_jobs (
  id uuid primary key default gen_random_uuid(),
  owner_key uuid not null references auth_profiles(owner_key) on delete cascade,
  document_id uuid references documents(id) on delete cascade,
  status text not null check (status in ('claimed','completed','failed')),
  lease_until timestamptz not null,
  created_at timestamptz not null default now()
);

alter table ai_usage enable row level security;
alter table quota_limits enable row level security;
alter table cleanup_jobs enable row level security;

create policy ai_usage_owner on ai_usage
  for all using (owner_key = auth.uid())
  with check (owner_key = auth.uid());

create policy cleanup_owner on cleanup_jobs
  for all using (owner_key = auth.uid())
  with check (owner_key = auth.uid());
