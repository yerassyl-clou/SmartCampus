create table if not exists upload_reservations (
  id uuid primary key default gen_random_uuid(),
  owner_key uuid not null references auth_profiles(owner_key) on delete cascade,
  object_path text not null,
  byte_count bigint not null check (byte_count between 1 and 10485760),
  sha256 text,
  status text not null check (status in ('reserved','processing','ready','expired','failed','deleted')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (owner_key, object_path)
);

create table if not exists ingestion_results (
  id uuid primary key default gen_random_uuid(),
  owner_key uuid not null references auth_profiles(owner_key) on delete cascade,
  reservation_id uuid not null references upload_reservations(id) on delete cascade,
  document_id uuid references documents(id) on delete set null,
  reason text not null,
  coverage integer not null default 0,
  created_at timestamptz not null default now()
);

alter table upload_reservations enable row level security;
alter table ingestion_results enable row level security;

create policy upload_owner on upload_reservations
  for all using (owner_key = auth.uid())
  with check (owner_key = auth.uid());

create policy ingestion_owner on ingestion_results
  for all using (owner_key = auth.uid())
  with check (owner_key = auth.uid());
