"use client";

import { useState } from "react";
import { EditExpenseForm } from "@/components/edit-expense-form";
import { getCategoryById } from "@/lib/categories";
import { formatDateJa, formatYen } from "@/lib/format";
import type { CategoryRecord, ExpenseRecord, ExpenseUpdate } from "@/lib/types";

type Props = {
  expenses: ExpenseRecord[];
  categories: CategoryRecord[];
  totalAmount: number;
  selectedMonthLabel: string;
  isReady: boolean;
  onEdit: (id: string, input: ExpenseUpdate) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  updatingId: string | null;
  deletingId: string | null;
};

export function ExpenseList({
  expenses,
  categories,
  totalAmount,
  selectedMonthLabel,
  isReady,
  onEdit,
  onDelete,
  updatingId,
  deletingId,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleDelete(expense: ExpenseRecord) {
    const category = getCategoryById(categories, expense.category_id);
    const label = category?.name ?? "未分類";
    const confirmed = window.confirm(
      `${label}（${formatYen(expense.amount)}）を削除しますか？`,
    );
    if (!confirmed) return;

    try {
      await onDelete(expense.id);
    } catch {
      // エラー表示は useExpenses の error で行う
    }
  }

  async function handleSaveEdit(expense: ExpenseRecord, input: ExpenseUpdate) {
    try {
      await onEdit(expense.id, input);
      setEditingId(null);
    } catch {
      throw new Error("update failed");
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
      <div className="mb-4 flex items-end justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          支出一覧
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          合計{" "}
          <span className="font-semibold text-sky-700 dark:text-sky-300">
            {formatYen(totalAmount)}
          </span>
        </p>
      </div>

      {!isReady ? (
        <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          読み込み中…
        </p>
      ) : expenses.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          {selectedMonthLabel}の支出はまだありません。上のフォームから追加してください。
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {expenses.map((expense) => {
            const category = getCategoryById(categories, expense.category_id);
            const isEditing = editingId === expense.id;
            const isDeleting = deletingId === expense.id;
            const isSavingThis = updatingId === expense.id;

            return (
              <li
                key={expense.id}
                className="py-3 first:pt-0 last:pb-0"
              >
                {isEditing ? (
                  <EditExpenseForm
                    expense={expense}
                    categories={categories}
                    onSave={(input) => handleSaveEdit(expense, input)}
                    onCancel={() => setEditingId(null)}
                    isSaving={isSavingThis}
                  />
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900 dark:text-slate-50">
                        {category?.name ?? "未分類"}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDateJa(expense.date)}
                      </p>
                      {expense.memo ? (
                        <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">
                          {expense.memo}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <p className="mr-1 text-base font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                        {formatYen(expense.amount)}
                      </p>
                      <button
                        type="button"
                        onClick={() => setEditingId(expense.id)}
                        disabled={isDeleting}
                        aria-label={`${category?.name ?? "未分類"} ${formatYen(expense.amount)} を編集`}
                        className="rounded-lg px-2 py-1 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-sky-300 dark:hover:bg-sky-950/60"
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(expense)}
                        disabled={isDeleting}
                        aria-label={`${category?.name ?? "未分類"} ${formatYen(expense.amount)} を削除`}
                        className="rounded-lg px-2 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/70"
                      >
                        {isDeleting ? "削除中…" : "削除"}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
