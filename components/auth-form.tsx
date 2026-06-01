"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  AUTH_EMAIL_INVALID_MESSAGE,
  isValidEmailFormat,
  toResendEmailErrorMessage,
  toSendEmailErrorMessage,
  toVerifyOtpErrorMessage,
} from "@/lib/auth-messages";

const OTP_LENGTH = 6;

const inputClassName =
  "rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none ring-sky-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50";

export function AuthForm() {
  const { sendEmailOtp, verifyEmailOtp } = useAuth();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSendEmail(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("メールアドレスを入力してください");
      return;
    }
    if (!isValidEmailFormat(trimmed)) {
      setError(AUTH_EMAIL_INVALID_MESSAGE);
      return;
    }

    setIsSubmitting(true);
    try {
      await sendEmailOtp(trimmed);
      setCode("");
      setStep("code");
    } catch (err) {
      setError(toSendEmailErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyCode(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const token = code.replace(/\D/g, "");
    if (token.length < OTP_LENGTH) {
      setError(`${OTP_LENGTH}桁の確認コードを入力してください`);
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyEmailOtp(email.trim(), token);
    } catch (err) {
      setError(toVerifyOtpErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    setError(null);
    setIsSubmitting(true);
    try {
      await sendEmailOtp(email.trim());
      setCode("");
    } catch (err) {
      setError(toResendEmailErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChangeEmail() {
    setStep("email");
    setCode("");
    setError(null);
  }

  if (step === "code") {
    return (
      <section className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          確認コードを入力
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {email.trim()}
          </span>{" "}
          に送った{OTP_LENGTH}桁のコードを入力してください。
        </p>

        <form onSubmit={handleVerifyCode} className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              確認コード
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              maxLength={OTP_LENGTH}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className={`${inputClassName} text-center text-lg tracking-[0.3em] tabular-nums`}
            />
          </label>

          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || code.length < OTP_LENGTH}
            className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "確認中…" : "ログインする"}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <button
            type="button"
            onClick={handleResend}
            disabled={isSubmitting}
            className="font-medium text-sky-700 hover:text-sky-800 disabled:opacity-50 dark:text-sky-300"
          >
            コードを再送信
          </button>
          <button
            type="button"
            onClick={handleChangeEmail}
            disabled={isSubmitting}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            メールアドレスを変更
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        ログイン
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        メールアドレスを入力すると、{OTP_LENGTH}桁の確認コードが届きます。パスワードは不要です。
      </p>

      <form onSubmit={handleSendEmail} className="mt-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            メールアドレス
          </span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClassName}
          />
        </label>

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "送信中…" : "確認コードを送る"}
        </button>
      </form>
    </section>
  );
}
