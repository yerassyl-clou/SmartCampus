create extension if not exists "pgcrypto";

create table if not exists auth_profiles (
  owner_key uuid primary key,
  display_name text not null,
  is_admin boolean not null default false,
  verified_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  owner_key uuid not null references auth_profiles(owner_key) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  owner_key uuid not null references auth_profiles(owner_key) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  owner_key uuid not null references auth_profiles(owner_key) on delete cascade,
  document_id uuid not null references documents(id) on delete cascade,
  chunk_index integer not null check (chunk_index >= 0),
  locator text not null,
  excerpt text not null,
  deleted_at timestamptz,
  unique (document_id, chunk_index)
);

create table if not exists deadlines (
  id uuid primary key default gen_random_uuid(),
  owner_key uuid not null references auth_profiles(owner_key) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  due_at timestamptz,
  deleted_at timestamptz
);

create table if not exists threads (
  id uuid primary key default gen_random_uuid(),
  owner_key uuid not null references auth_profiles(owner_key) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  owner_key uuid not null references auth_profiles(owner_key) on delete cascade,
  thread_id uuid not null references threads(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists courses_owner_idx on courses(owner_key);
create index if not exists documents_owner_course_idx on documents(owner_key, course_id);
create index if not exists chunks_owner_document_idx on document_chunks(owner_key, document_id);
create index if not exists deadlines_owner_course_idx on deadlines(owner_key, course_id);
create index if not exists threads_owner_course_idx on threads(owner_key, course_id);
create index if not exists messages_owner_thread_idx on messages(owner_key, thread_id);

alter table auth_profiles enable row level security;
alter table courses enable row level security;
alter table documents enable row level security;
alter table document_chunks enable row level security;
alter table deadlines enable row level security;
alter table threads enable row level security;
alter table messages enable row level security;

create policy auth_profile_owner on auth_profiles
  for all using (owner_key = auth.uid() or exists (
    select 1 from auth_profiles admin
    where admin.owner_key = auth.uid() and admin.is_admin
  ))
  with check (owner_key = auth.uid());

create policy courses_owner on courses
  for all using (owner_key = auth.uid())
  with check (owner_key = auth.uid());

create policy documents_owner on documents
  for all using (owner_key = auth.uid())
  with check (owner_key = auth.uid());

create policy document_chunks_owner on document_chunks
  for all using (owner_key = auth.uid())
  with check (owner_key = auth.uid());

create policy deadlines_owner on deadlines
  for all using (owner_key = auth.uid())
  with check (owner_key = auth.uid());

create policy threads_owner on threads
  for all using (owner_key = auth.uid())
  with check (owner_key = auth.uid());

create policy messages_owner on messages
  for all using (owner_key = auth.uid())
  with check (owner_key = auth.uid());
