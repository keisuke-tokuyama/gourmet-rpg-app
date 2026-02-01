-- Storage ポリシー（Supabase Dashboard の SQL Editor で実行）
-- 1. Storage で "posts" バケットを Public で作成
-- 2. 以下のポリシーを追加（既存ポリシーと重複する場合はエラーになるので、Dashboard から手動設定也可）

-- 誰でも読み取り可
create policy "posts_public_read" on storage.objects for select
using (bucket_id = 'posts');

-- 認証ユーザー（匿名含む）がアップロード可
create policy "posts_authenticated_upload" on storage.objects for insert
with check (bucket_id = 'posts' and auth.role() = 'authenticated');
