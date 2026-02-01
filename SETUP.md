# 食の冒険録 - セットアップ手順

## 1. 依存関係のインストール

```bash
pnpm install
```

## 2. Supabase のセットアップ

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. **SQL Editor** で `supabase/schema.sql` の内容を実行してテーブルを作成（プロフィール・フォロー機能は同ファイル内の拡張セクションに含まれています）
3. **Storage** → **New bucket** で `posts` バケットを **Public** で作成し、`storage-policies.sql` でポリシーを適用（または Dashboard から手動設定）
4. **Authentication** → **Providers** で **Anonymous sign-ins** を有効化（ゲスト投稿用）
5. **Project Settings** → **API** から URL と anon key を取得

## 3. 環境変数の設定

`.env.local.example` を `.env.local` にコピーし、値を設定してください。

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. 開発サーバーの起動

```bash
pnpm dev
```

http://localhost:3000 でアプリにアクセスできます。
