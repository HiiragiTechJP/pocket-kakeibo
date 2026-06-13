"use client";

import { useMemo } from "react";
import { AddIncomeForm } from "@/components/add-income-form";
import { AppPage } from "@/components/app-page";
import { IncomeList } from "@/components/income-list";
import { MonthPicker } from "@/components/month-picker";
import { YenAmount } from "@/components/yen-amount";
import { useKakeiboData } from "@/contexts/kakeibo-data-context";
import { useSelectedMonth } from "@/hooks/use-selected-month";
import {
  calculateAmountTotal,
  filterIncomesByMonth,
} from "@/lib/expense-summary";
import { formatMonthJa } from "@/lib/format";

export function IncomePage() {
  const { incomes, isReady } = useKakeiboData();
  const { selectedMonth, setSelectedMonth, currentMonth } = useSelectedMonth();

  const monthlyIncomes = useMemo(
    () => filterIncomesByMonth(incomes.incomes, selectedMonth),
    [incomes.incomes, selectedMonth],
  );

  const monthlyIncomeTotal = useMemo(
    () => calculateAmountTotal(monthlyIncomes),
    [monthlyIncomes],
  );

  const selectedMonthLabel = formatMonthJa(selectedMonth);

  return (
    <AppPage>
      <section className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            収入
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {selectedMonthLabel}
          </p>
          {isReady ? (
            <YenAmount
              amount={monthlyIncomeTotal}
              className="mt-1 text-lg font-semibold text-emerald-700 dark:text-emerald-300"
            />
          ) : null}
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
    </AppPage>
  );
}
