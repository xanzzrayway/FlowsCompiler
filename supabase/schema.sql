-- Jalankan seluruh isi file ini di Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Tabel ini menyimpan limit compile harian, terikat ke 1 akun Google (auth.users.id).

create table if not exists public.usage (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  email        text,
  daily_limit  int not null default 2,
  today_count  int not null default 0,
  usage_date   date not null default current_date,
  updated_at   timestamptz not null default now()
);

-- Aktifkan Row Level Security supaya user cuma bisa baca/tulis row miliknya sendiri.
alter table public.usage enable row level security;

drop policy if exists "Users can view own usage" on public.usage;
create policy "Users can view own usage"
  on public.usage for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own usage" on public.usage;
create policy "Users can insert own usage"
  on public.usage for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own usage" on public.usage;
create policy "Users can update own usage"
  on public.usage for update
  using (auth.uid() = user_id);
