# Supabase（手動セットアップ）

Dashboard の **SQL Editor** で実行するスクリプトです。`git push` だけでは DB は変わりません。

## 実行順（新規プロジェクト）

| 順 | ファイル | 内容 |
|----|----------|------|
| 1 | `rls-auth.sql` | 認証・支出の RLS |
| 2 | `categories-setup.sql` | カテゴリ一式（未分類・ユーザー別・並び替え列） |

各ファイルを **全文コピー** → SQL Editor → **Run**（1ファイル＝1回）。

**すでに本番で実行済み** なら、原則として再実行不要です。

### 一部だけ足すとき

| 状況 | 対応 |
|------|------|
| カテゴリ①〜③済み・並び替えで 400（`sort_order` なし） | `categories-setup.sql` の **「並び順」ブロックだけ** Run |
| OTP メール | `email-template-login-otp.html` を Magic Link に貼り付け（件名: `ポケット家計簿 — ログインコード`）。Custom SMTP は **OFF** のまま Save |

## 確認用 SQL（任意）

```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'categories' AND column_name = 'sort_order';
```

1行返れば並び替え列あり。
