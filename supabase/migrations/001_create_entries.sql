create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  amount integer not null check (amount > 0),
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists entries_created_at_idx on entries (created_at desc);
create index if not exists entries_deleted_at_idx on entries (deleted_at);
