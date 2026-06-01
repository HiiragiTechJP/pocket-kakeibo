/** ログイン画面で表示する認証エラーメッセージ */

export const AUTH_EMAIL_INVALID_MESSAGE =
  "メールアドレスの形式が正しくありません。例: you@example.com のように入力してください。";

export const AUTH_OTP_INVALID_MESSAGE =
  "確認コードが間違っているか、有効期限が切れています。新しいコードを送信して、もう一度入力してください。";

export const AUTH_SEND_EMAIL_FALLBACK =
  "確認コードの送信に失敗しました。しばらくしてからもう一度お試しください。";

export const AUTH_VERIFY_FALLBACK = "ログインに失敗しました。もう一度お試しください。";

export const AUTH_RESEND_FALLBACK =
  "確認コードの再送信に失敗しました。しばらくしてからもう一度お試しください。";

const EMAIL_FORMAT_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmailFormat(email: string): boolean {
  return EMAIL_FORMAT_PATTERN.test(email.trim());
}

function getErrorMessage(error: unknown): string | null {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }
  return null;
}

/** Supabase が返すメールアドレス関連のエラーか */
function isEmailAddressError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("invalid email") ||
    lower.includes("email address") ||
    lower.includes("email format") ||
    lower.includes("unable to validate email") ||
    lower.includes("valid email") ||
    (lower.includes("email") && lower.includes("invalid") && !lower.includes("otp"))
  );
}

/** 確認コードの誤り・期限切れと判断できるエラーか */
function isOtpVerificationError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("otp") ||
    lower.includes("token") ||
    lower.includes("expired") ||
    lower.includes("invalid") ||
    lower.includes("verification")
  );
}

export function toSendEmailErrorMessage(
  error: unknown,
  fallback = AUTH_SEND_EMAIL_FALLBACK,
): string {
  const message = getErrorMessage(error);
  if (!message) return fallback;

  if (isEmailAddressError(message)) {
    return AUTH_EMAIL_INVALID_MESSAGE;
  }

  return message;
}

export function toVerifyOtpErrorMessage(
  error: unknown,
  fallback = AUTH_VERIFY_FALLBACK,
): string {
  const message = getErrorMessage(error);
  if (!message) return fallback;

  if (isOtpVerificationError(message)) {
    return AUTH_OTP_INVALID_MESSAGE;
  }

  return message;
}

export function toResendEmailErrorMessage(
  error: unknown,
  fallback = AUTH_RESEND_FALLBACK,
): string {
  return toSendEmailErrorMessage(error, fallback);
}
