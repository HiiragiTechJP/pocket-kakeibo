"use client";

import { useMemo } from "react";
import { AddIncomeForm } from "@/components/add-income-form";
import { AppErrorBanner } from "@/components/app-error-banner";
import { IncomeList } from "@/components/income-list";
import { MonthPicker } from "@/components/month-picker";
import { useKakeiboData } from "@/contexts/kakeibo-data-context";
import { useSelectedMonth } from "@/hooks/use-selected-month";
import {
  calculateExpenseTotal,
  filterIncomesByMonth,
} from "@/lib/expense-summary";
import { formatMonthJa, formatYen } from "@/lib/format";

export function IncomePage() {
  const { incomes, isReady } = useKakeiboData();
  const { selectedMonth, setSelectedMonth, currentMonth } = useSelectedMonth();

  const monthlyIncomes = useMemo(
    () => filterIncomesByMonth(incomes.incomes, selectedMonth),
    [incomes.incomes, selectedMonth],
  );

  const monthlyIncomeTotal = useMemo(
    () => calculateExpenseTotal(monthlyIncomes),
    [monthlyIncomes],
  );

  const selectedMonthLabel = formatMonthJa(selectedMonth);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-5">
      <AppErrorBanner />

      <section className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            収入
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {selectedMonthLabel}
            {isReady ? (
              <>
                {" · "}
                <span className="font-medium text-emerald-700 dark:text-emerald-300">
                  {formatYen(monthlyIncomeTotal)}
                </span>
              </>
            ) : null}
          </p>
        </div>
        <MonthPicker
          selectedMonth={selectedMonth}
          currentMonth={currentMonth}
          onChange={setSelectedMonth}
        />
      </section>

      <AddIncomeForm
        onAdd={incomes.addIncome}
        selectedMonth={selectedMonth}
        disabled={!isReady}
      />

      <IncomeList
        incomes={monthlyIncomes}
        selectedMonthLabel={selectedMonthLabel}
        isReady={isReady}
        onEdit={incomes.editIncome}
        onDelete={incomes.removeIncome}
        updatingId={incomes.updatingId}
        deletingId={incomes.deletingId}
      />
    </main>
  );
}
