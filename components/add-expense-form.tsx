"use client";

import { FormEvent, useEffect, useState } from "react";
import { getPreferredCategoryId } from "@/lib/categories";
import { getMonthDefaultDate } from "@/lib/format";
import { formInputClass } from "@/lib/ui";
import type { CategoryRecord, ExpenseInsert } from "@/lib/types";

type Props = {
  categories: CategoryRecord[];
  onAdd: (input: ExpenseInsert) => void | Promise<void>;
  selectedMonth: string;
  disabled?: boolean;
};

const inputClassName = formInputClass({ accent: "sky" });

export function AddExpenseForm({
  categories,
  onAdd,
  selectedMonth,
  disabled = false,
}: Props) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(() =>
    getPreferredCategoryId(categories),
  );
  const [date, setDate] = useState(() => getMonthDefaultDate(selectedMonth));
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setDate(getMonthDefaultDate(selectedMonth));
  }, [selectedMonth]);

  useEffect(() => {
    if (categories.length === 0) return;
    setCategoryId((prev) => {
      if (categories.some((c) => c.id === prev)) return prev;
      return getPreferredCategoryId(categories);
    });
  }, [categories]);

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
    if (!categoryId) {
      setError("カテゴリを選択してください");
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
        category_id: categoryId,
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
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30"
    >
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
        支出を追加
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
            placeholder="1200"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            カテゴリ
          </span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClassName}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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
            メモ（任意）
          </span>
          <input
            type="text"
            maxLength={80}
            placeholder="例: ランチ、スーパー、電車代"
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
          className="mt-1 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 active:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "保存中…" : "追加する"}
        </button>
      </div>
    </form>
  );
}
