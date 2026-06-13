"use client";

import { FormEvent, useEffect, useState } from "react";
import { getMonthDefaultDate } from "@/lib/format";
import type { IncomeInsert } from "@/lib/types";

type Props = {
  onAdd: (input: IncomeInsert) => void | Promise<void>;
  selectedMonth: string;
  disabled?: boolean;
};

const inputClassName =
  "rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none ring-emerald-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50";

export function AddIncomeForm({
  onAdd,
  selectedMonth,
  disabled = false,
}: Props) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => getMonthDefaultDate(selectedMonth));
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setDate(getMonthDefaultDate(selectedMonth));
  }, [selectedMonth]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = Number(amount);
    if (!amount || Number.isNaN(parsed) || parsed <= 0) {
      setError("金額は1円以上の数値を入力してください");
      return;
    }
    if (!Number.isInteger(parsed)) {
      setError("金額は整数で入力してください");
      return;
    }
    if (!date) {
      setError("日付を選択してください");
      return;
    }

    const trimmedMemo = memo.trim();

    setIsSubmitting(true);
    try {
      await onAdd({
        amount: parsed,
        date,
        memo: trimmedMemo.length > 0 ? trimmedMemo : null,
      });
      setAmount("");
      setMemo("");
      setDate(getMonthDefaultDate(selectedMonth));
    } catch {
      setError("保存に失敗しました。しばらくしてから再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-emerald-200/80 bg-white p-5 shadow-md shadow-slate-200/70 dark:border-emerald-900/50 dark:bg-slate-900 dark:shadow-slate-950/30"
    >
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
        収入を追加
      </h2>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            金額（円）
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            placeholder="250000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            日付
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            内容（任意）
          </span>
          <input
            type="text"
            maxLength={80}
            placeholder="例: 給与、副業、おこづかい"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
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
          disabled={disabled || isSubmitting}
          className="mt-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "保存中…" : "追加する"}
        </button>
      </div>
    </form>
  );
}
