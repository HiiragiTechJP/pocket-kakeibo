# ログインコードメール

## 1. 件名（Subject）

```
ポケット家計簿 — ログインコード
```

## 2. 本文（Body）

**`email-template-login-otp.html` を開いて、中身をすべてコピー**して Magic Link テンプレートに貼り付け。

- `{{ .ConfirmationURL }}` は入れない
- Custom SMTP OFF のまま Save

## 3. 確認

アプリで「確認コードを送る」→ 6桁が届くか確認
