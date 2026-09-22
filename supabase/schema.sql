-- Jalankan seluruh isi file ini di Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Tabel ini menyimpan limit compile harian, terikat ke 1 akun Google (auth.users.id).
-- Aman dijalankan ulang walau tabel "usage" sudah ada sebelumnya (pakai IF NOT EXISTS).

create table if not exists public.usage (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  email        text,
  daily_limit  int not null default 2,
  today_count  int not null default 0,
  usage_date   date not null default current_date,
  plan         text not null default 'default',
  updated_at   timestamptz not null default now()
);

-- Kalau tabel "usage" sudah ada dari sebelumnya (belum punya kolom plan), baris ini yang nambahin.
alter table public.usage add column if not exists plan text not null default 'default';

-- Batasi isi kolom plan cuma boleh 'default' atau 'pro' (jaga-jaga typo pas admin edit manual).
alter table public.usage drop constraint if exists usage_plan_check;
alter table public.usage add constraint usage_plan_check check (plan in ('default', 'pro'));

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

-- Catatan buat admin (kamu):
-- Kolom "plan" TIDAK otomatis berubah lewat pembayaran apapun -- ini murni
-- ditandai manual. Setelah pembeli bayar (lewat kontak Telegram di web),
-- naikkan plan-nya manual dari Supabase:
--   Table Editor -> tabel "usage" -> cari baris user (lewat kolom email) -> edit
--   kolom "plan" jadi 'pro' -> Save.
-- Begitu disimpan, limit harian user itu otomatis jadi 5/hari (bukan 2/hari)
-- di web -- tidak perlu deploy ulang apapun.
