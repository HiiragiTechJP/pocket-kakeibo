"use client";

import { useMemo, useState } from "react";
import { AddExpenseForm } from "@/components/add-expense-form";
import { CategoryManager } from "@/components/category-manager";
import { ExpenseList } from "@/components/expense-list";
import { useCategories } from "@/hooks/use-categories";
import { useExpenses } from "@/hooks/use-expenses";
import {
  buildCategorySummary,
  calculateExpenseTotal,
  filterExpensesByMonth,
} from "@/lib/expense-summary";
import {
  formatMonthJa,
  formatYen,
  shiftIsoMonth,
  todayIsoMonth,
} from "@/lib/format";

export function KakeiboApp() {
  const {
    categories,
    isReady: categoriesReady,
    error: categoriesError,
    savingId: categorySavingId,
    deletingId: categoryDeletingId,
    isReordering: categoryIsReordering,
    addCategory,
    editCategory,
    removeCategory,
    reorderCategories,
  } = useCategories();

  const {
    expenses,
    addExpense,
    editExpense,
    removeExpense,
    reload: reloadExpenses,
    isReady: expensesReady,
    error: expensesError,
    deletingId,
    updatingId,
  } = useExpenses();

  const currentMonth = todayIsoMonth();
  const [selectedMonth, setSelectedMonth] = useState(() => currentMonth);

  const isReady = categoriesReady && expensesReady;
  const error = categoriesError ?? expensesError;

  const monthlyExpenses = useMemo(
    () => filterExpensesByMonth(expenses, selectedMonth),
    [expenses, selectedMonth],
  );

  const monthlyTotal = useMemo(
    () => calculateExpenseTotal(monthlyExpenses),
    [monthlyExpenses],
  );

  const categorySummary = useMemo(
    () => buildCategorySummary(monthlyExpenses, categories),
    [monthlyExpenses, categories],
  );

  const selectedMonthLabel = formatMonthJa(selectedMonth);
  const isCurrentMonthSelected = selectedMonth === currentMonth;

  async function handleRemoveCategory(id: string) {
    await removeCategory(id);
    await reloadExpenses();
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6">
      {error ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-800 shadow-sm dark:border-red-900 dark:bg-red-950/80 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <section className="rounded-2xl bg-gradient-to-br from-sky-700 via-cyan-700 to-teal-600 px-5 py-6 text-white shadow-lg shadow-sky-200/70 dark:from-sky-800 dark:via-cyan-800 dark:to-teal-700 dark:shadow-slate-950/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white/80">
              {selectedMonthLabel}の支出合計
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">
              {isReady ? formatYen(monthlyTotal) : "—"}
            </p>
            <p className="mt-2 text-sm text-white/80">
              {monthlyExpenses.length} 件の支出
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-1 py-1 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setSelectedMonth((prev) => shiftIsoMonth(prev, -1))}
              aria-label="前の月を表示"
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white transition-colors hover:bg-white/10 active:bg-white/20"
            >
              ←
            </button>
            <p className="min-w-[6.5rem] text-center text-sm font-medium text-white">
              {selectedMonthLabel}
            </p>
            <button
              type="button"
              onClick={() => setSelectedMonth((prev) => shiftIsoMonth(prev, 1))}
              aria-label="次の月を表示"
              disabled={isCurrentMonthSelected}
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white transition-colors hover:bg-white/10 active:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
          <p className="text-sm font-medium text-white">カテゴリ別</p>
          {!isReady ? (
            <p className="mt-2 text-sm text-white/80">読み込み中…</p>
          ) : categorySummary.length === 0 ? (
            <p className="mt-2 text-sm text-white/80">
              {selectedMonthLabel}のカテゴリ別データはまだありません。
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {categorySummary.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="text-white/90">{category.name}</span>
                  <span className="font-semibold tabular-nums text-white">
                    {formatYen(category.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <CategoryManager
        categories={categories}
        disabled={!isReady}
        savingId={categorySavingId}
        deletingId={categoryDeletingId}
        onAdd={async (name) => {
          await addCategory({ name });
        }}
        onEdit={async (id, name) => {
          await editCategory(id, { name });
        }}
        onDelete={handleRemoveCategory}
        onReorder={reorderCategories}
        isReordering={categoryIsReordering}
      />

      <AddExpenseForm
        categories={categories}
        onAdd={addExpense}
        selectedMonth={selectedMonth}
        disabled={!isReady}
      />
      <ExpenseList
        expenses={monthlyExpenses}
        categories={categories}
        totalAmount={monthlyTotal}
        selectedMonthLabel={selectedMonthLabel}
        isReady={isReady}
        onEdit={editExpense}
        onDelete={removeExpense}
        updatingId={updatingId}
        deletingId={deletingId}
      />
    </main>
  );
}
