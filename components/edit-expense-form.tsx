"use client";

import { FormEvent, useState } from "react";
import type { CategoryRecord, ExpenseRecord, ExpenseUpdate } from "@/lib/types";

type Props = {
  expense: ExpenseRecord;
  categories: CategoryRecord[];
  onSave: (input: ExpenseUpdate) => void | Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
};

const inputClassName =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none ring-sky-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50";

export function EditExpenseForm({
  expense,
  categories,
  onSave,
  onCancel,
  isSaving,
}: Props) {
  const [amount, setAmount] = useState(String(expense.amount));
  const [categoryId, setCategoryId] = useState(expense.category_id);
  const [date, setDate] = useState(expense.date);
  const [memo, setMemo] = useState(expense.memo ?? "");
  const [error, setError] = useState<string | null>(null);

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

    try {
      await onSave({
        amount: parsed,
        category_id: categoryId,
        date,
        memo: trimmedMemo.length > 0 ? trimmedMemo : null,
      });
    } catch {
      setError("保存に失敗しました。しばらくしてから再度お試しください。");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60"
    >
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            金額（円）
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClassName}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            日付
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClassName}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
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

      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
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

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-700/70"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 active:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "保存中…" : "保存"}
        </button>
      </div>
    </form>
  );
}
