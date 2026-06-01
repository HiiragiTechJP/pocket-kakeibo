# ポケット家計簿

スマホで使いやすいシンプルな家計簿 Web アプリ（PWA 対応）。

## 機能

- メール確認コードによるログイン
- 支出の追加・編集・削除
- ユーザーごとのカテゴリ（作成・名前変更・削除・ドラッグ並び替え。「未分類」は削除不可）
- 月別表示とカテゴリ別集計
- メモ入力

## 技術スタック

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth / PostgreSQL)
- Vercel

## URL 構成

| URL | 内容 |
|-----|------|
| `/` | ランディングページ（LP） |
| `/app` | 家計簿アプリ本体 |
| `/privacy` | プライバシーポリシー |
| `/terms` | 利用規約 |
| `/contact` | お問い合わせ |

## セットアップ

```bash
npm install
npm run dev
```

環境変数:

| 変数名 | 説明 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon キー |

Supabase 側の手動セットアップは **`supabase/README.md`** を参照（`rls-auth.sql` → `categories-setup.sql` の順、メールテンプレは HTML を Dashboard に貼り付け）。

## ライセンス

Private
