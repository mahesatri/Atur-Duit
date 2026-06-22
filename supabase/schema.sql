-- AturDuit — Supabase schema
-- Skema ini adalah port langsung dari skema SQLite pada aplikasi mobile
-- (lib/database/database_helper.dart) ke PostgreSQL untuk Supabase.
-- Jalankan file ini di Supabase SQL Editor.

create extension if not exists "pgcrypto";

-- =========================
-- USERS
-- =========================
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password text not null, -- hash bcrypt, lihat lib/actions/auth.ts
  created_at timestamptz not null default now()
);

-- =========================
-- CATEGORIES
-- user_id NULL = kategori bawaan/global (setara user_id = 0 di versi mobile)
-- =========================
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  icon text,
  created_at timestamptz not null default now()
);

-- =========================
-- TRANSACTIONS
-- =========================
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  title text not null,
  type text not null check (type in ('income', 'expense')),
  amount integer not null check (amount >= 0),
  transaction_date date not null,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists idx_transactions_user on transactions(user_id);
create index if not exists idx_transactions_date on transactions(transaction_date);
create index if not exists idx_categories_user on categories(user_id);

-- =========================
-- Kategori bawaan (tampil untuk semua user, sama seperti default
-- categories di DatabaseService._initDb())
-- =========================
insert into categories (user_id, name, icon) values
  (null, 'Makanan', 'utensils'),
  (null, 'Transport', 'car'),
  (null, 'Belanja', 'shopping-bag'),
  (null, 'Hiburan', 'gamepad-2'),
  (null, 'Kesehatan', 'heart-pulse'),
  (null, 'Tagihan', 'file-text')
on conflict do nothing;

-- =========================
-- Row Level Security
-- Catatan: project ini memakai autentikasi kustom (Server Action + cookie
-- session, lihat middleware.ts & lib/actions/auth.ts), BUKAN Supabase Auth.
-- Semua akses ke tabel dilakukan lewat Server Action di server (memakai
-- SUPABASE_SERVICE_ROLE_KEY), sehingga RLS dinonaktifkan di sini.
-- Untuk produksi sesungguhnya, pertimbangkan migrasi ke Supabase Auth
-- + RLS policy per user_id.
-- =========================
alter table users disable row level security;
alter table categories disable row level security;
alter table transactions disable row level security;
