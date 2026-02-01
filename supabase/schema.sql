-- 食の冒険録 - Supabase スキーマ
-- Supabase Dashboard の SQL Editor で実行してください

-- profiles: ユーザーのRPG情報（xp, レベル, 称号）
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  xp integer not null default 0,
  level integer not null default 1,
  title text,
  updated_at timestamptz not null default now()
);

-- posts: 食レポ投稿
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  restaurant_name text not null,
  genre text not null,
  closed_days text not null default '',
  hours text not null default '',
  address text not null default '',
  image_url text,
  visit_date text not null,
  companions text not null default '',
  amount text,
  dishes text not null default '',
  review_content text not null default '',
  taste_rating numeric(2,1) not null check (taste_rating >= 0 and taste_rating <= 5),
  price_rating numeric(2,1) not null check (price_rating >= 0 and price_rating <= 5),
  atmosphere_rating numeric(2,1) not null check (atmosphere_rating >= 0 and atmosphere_rating <= 5),
  overall_rating numeric(2,1) not null check (overall_rating >= 0 and overall_rating <= 5),
  created_at timestamptz not null default now()
);

-- likes: 記事いいね(article) / 感想いいね(review)
create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('article', 'review')),
  created_at timestamptz not null default now(),
  unique(post_id, user_id, type)
);

-- インデックス
create index if not exists idx_posts_user_id on public.posts(user_id);
create index if not exists idx_posts_created_at on public.posts(created_at desc);
create index if not exists idx_likes_post_id on public.likes(post_id);
create index if not exists idx_likes_type on public.likes(type);

-- RLS ポリシー
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;

-- profiles: 誰でも読み取り可、自分のみ更新可
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);

-- posts: 誰でも読み取り可、認証ユーザーのみ作成・更新・削除
create policy "posts_select" on public.posts for select using (true);
create policy "posts_insert" on public.posts for insert with check (auth.uid() = user_id);
create policy "posts_update" on public.posts for update using (auth.uid() = user_id);
create policy "posts_delete" on public.posts for delete using (auth.uid() = user_id);

-- likes: 誰でも読み取り可、認証ユーザーのみ作成・削除
create policy "likes_select" on public.likes for select using (true);
create policy "likes_insert" on public.likes for insert with check (auth.uid() = user_id);
create policy "likes_delete" on public.likes for delete using (auth.uid() = user_id);

-- 新規ユーザー作成時に profiles を自動作成
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, xp, level)
  values (new.id, 0, 1);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- === 拡張: プロフィール・フォロー (002_profiles_follows.sql の内容) ===
-- 既存プロジェクトでは上記を実行後、以下を実行
alter table public.profiles add column if not exists display_name text default '';
alter table public.profiles add column if not exists favorite_food text default '';
alter table public.profiles add column if not exists bio text default '';
alter table public.profiles add column if not exists target_restaurant text default '';
alter table public.posts add column if not exists amount_numeric integer;

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

-- Storage: Supabase Dashboard の Storage で "posts" バケットを public で作成してください
