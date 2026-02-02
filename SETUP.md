# 食の冒険録 - セットアップ手順

## 1. 依存関係のインストール

```bash
pnpm install
```

## 2. Supabase のセットアップ

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. **SQL Editor** で `supabase/schema.sql` の内容を実行してテーブルを作成（プロフィール・フォロー機能は同ファイル内の拡張セクションに含まれています）
3. **Storage** → **New bucket** で `posts` バケットを **Public** で作成し、`storage-policies.sql` でポリシーを適用（または Dashboard から手動設定）
4. **Authentication** → **Providers** で **Email** と **Anonymous sign-ins** を有効化
5. **Authentication** → **URL Configuration** で Redirect URLs に `https://your-domain.com/auth/callback` を追加（Vercel デプロイ時）
6. **Project Settings** → **API** から URL と anon key を取得

## 3. 環境変数の設定

`.env.local.example` を `.env.local` にコピーし、値を設定してください。

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 4. 開発サーバーの起動

```bash
pnpm dev
```

http://localhost:3000 でアプリにアクセスできます。

## トラブルシューティング: 新規登録で「fetch error」が出る場合

1. **環境変数（Vercel / .env.local）**
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://xxxxx.supabase.co` 形式（`https://` 必須、末尾スラッシュなし）
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project Settings → API の **anon public** をそのままコピー
   - Vercel の場合は **Settings → Environment Variables** で上記を設定し、再デプロイ

2. **Supabase ダッシュボード**
   - **Authentication** → **Providers** → **Email** が有効か確認
   - **Project Settings** → **API** で Project URL と anon key が正しいか確認
   - 無料枠でプロジェクトが一時停止していないか確認

3. **リダイレクト URL（メール確認用）**
   - **Authentication** → **URL Configuration** → **Redirect URLs** に  
     `https://あなたのドメイン/auth/callback` を追加
   - Vercel なら `NEXT_PUBLIC_APP_URL` に本番 URL を設定（例: `https://xxx.vercel.app`）
