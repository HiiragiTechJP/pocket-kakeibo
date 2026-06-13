"use client";

import { useMemo, useState } from "react";
import { EditIncomeForm } from "@/components/edit-income-form";
import { calculateExpenseTotal } from "@/lib/expense-summary";
import { formatDateJa, formatYen } from "@/lib/format";
import type { IncomeRecord, IncomeUpdate } from "@/lib/types";

function getIncomeLabel(income: IncomeRecord): string {
  const trimmed = income.memo?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "収入";
}

type Props = {
  incomes: IncomeRecord[];
  selectedMonthLabel: string;
  isReady: boolean;
  onEdit: (id: string, input: IncomeUpdate) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  updatingId: string | null;
  deletingId: string | null;
};

export function IncomeList({
  incomes,
  selectedMonthLabel,
  isReady,
  onEdit,
  onDelete,
  updatingId,
  deletingId,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const totalAmount = useMemo(
    () => calculateExpenseTotal(incomes),
    [incomes],
  );

  async function handleDelete(income: IncomeRecord) {
    const label = getIncomeLabel(income);
    const confirmed = window.confirm(
      `${label}（${formatYen(income.amount)}）を削除しますか？`,
    );
    if (!confirmed) return;

    try {
      await onDelete(income.id);
    } catch {
      // useIncomes の error を表示
    }
  }

  async function handleSaveEdit(income: IncomeRecord, input: IncomeUpdate) {
    try {
      await onEdit(income.id, input);
      setEditingId(null);
    } catch {
      throw new Error("update failed");
    }
  }

  return (
    <section className="rounded-2xl border border-emerald-200/80 bg-white p-5 shadow-md shadow-slate-200/70 dark:border-emerald-900/50 dark:bg-slate-900 dark:shadow-slate-950/30">
      <div className="mb-4 flex items-end justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          収入一覧
        </h2>
        {incomes.length > 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            合計{" "}
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
              {formatYen(totalAmount)}
            </span>
          </p>
        ) : null}
      </div>

      {!isReady ? (
        <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          読み込み中…
        </p>
      ) : incomes.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {selectedMonthLabel}の収入はまだありません。上のフォームから追加してください。
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {incomes.map((income) => {
            const label = getIncomeLabel(income);
            const isEditing = editingId === income.id;
            const isDeleting = deletingId === income.id;
            const isSavingThis = updatingId === income.id;

            return (
              <li key={income.id} className="py-3 first:pt-0 last:pb-0">
                {isEditing ? (
                  <EditIncomeForm
                    income={income}
                    onSave={(input) => handleSaveEdit(income, input)}
                    onCancel={() => setEditingId(null)}
                    isSaving={isSavingThis}
                  />
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900 dark:text-slate-50">
                        {label}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDateJa(income.date)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <p className="mr-1 text-base font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
                        {formatYen(income.amount)}
                      </p>
                      <button
                        type="button"
                        onClick={() => setEditingId(income.id)}
                        disabled={isDeleting}
                        aria-label={`${label} ${formatYen(income.amount)} を編集`}
                        className="rounded-lg px-2 py-1 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-300 dark:hover:bg-emerald-950/60"
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(income)}
                        disabled={isDeleting}
                        aria-label={`${label} ${formatYen(income.amount)} を削除`}
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
