-- 食の冒険録 - プロフィール拡張・フォロー機能
-- Supabase Dashboard の SQL Editor で実行

-- profiles に新カラム追加
alter table public.profiles add column if not exists display_name text default '';
alter table public.profiles add column if not exists favorite_food text default '';
alter table public.profiles add column if not exists bio text default '';
alter table public.profiles add column if not exists target_restaurant text default '';

-- posts に amount_numeric 追加（累計ゴールド計算用、円）
alter table public.posts add column if not exists amount_numeric integer;

-- follows: フォロー関係
create table if not exists public.follows (
  id uuid default gen_random_uuid() primary key,
  follower_id uuid references auth.users(id) on delete cascade not null,
  following_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(follower_id, following_id),
  check (follower_id != following_id)
);

create index if not exists idx_follows_follower on public.follows(follower_id);
create index if not exists idx_follows_following on public.follows(following_id);

alter table public.follows enable row level security;

create policy "follows_select" on public.follows for select using (true);
create policy "follows_insert" on public.follows for insert with check (auth.uid() = follower_id);
create policy "follows_delete" on public.follows for delete using (auth.uid() = follower_id);
