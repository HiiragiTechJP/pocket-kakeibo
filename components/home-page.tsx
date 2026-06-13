"use client";

import { useMemo } from "react";
import { AddExpenseForm } from "@/components/add-expense-form";
import { AppErrorBanner } from "@/components/app-error-banner";
import { ExpenseList } from "@/components/expense-list";
import { MonthlySummaryCard } from "@/components/monthly-summary-card";
import { useKakeiboData } from "@/contexts/kakeibo-data-context";
import { useSelectedMonth } from "@/hooks/use-selected-month";
import {
  buildCategorySummary,
  calculateExpenseTotal,
  calculateMonthlyBalance,
  filterExpensesByMonth,
  filterIncomesByMonth,
} from "@/lib/expense-summary";
import { formatMonthJa } from "@/lib/format";

export function HomePage() {
  const { categories, expenses, incomes, isReady } = useKakeiboData();
  const { selectedMonth, setSelectedMonth, currentMonth } = useSelectedMonth();

  const monthlyExpenses = useMemo(
    () => filterExpensesByMonth(expenses.expenses, selectedMonth),
    [expenses.expenses, selectedMonth],
  );

  const monthlyIncomes = useMemo(
    () => filterIncomesByMonth(incomes.incomes, selectedMonth),
    [incomes.incomes, selectedMonth],
  );

  const monthlyExpenseTotal = useMemo(
    () => calculateExpenseTotal(monthlyExpenses),
    [monthlyExpenses],
  );

  const monthlyIncomeTotal = useMemo(
    () => calculateExpenseTotal(monthlyIncomes),
    [monthlyIncomes],
  );

  const monthlyBalance = useMemo(
    () => calculateMonthlyBalance(monthlyIncomeTotal, monthlyExpenseTotal),
    [monthlyIncomeTotal, monthlyExpenseTotal],
  );

  const categorySummary = useMemo(
    () => buildCategorySummary(monthlyExpenses, categories.categories),
    [monthlyExpenses, categories.categories],
  );

  const selectedMonthLabel = formatMonthJa(selectedMonth);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-5">
      <AppErrorBanner />

      <MonthlySummaryCard
        selectedMonth={selectedMonth}
        currentMonth={currentMonth}
        onMonthChange={setSelectedMonth}
        balance={monthlyBalance}
        incomeTotal={monthlyIncomeTotal}
        expenseTotal={monthlyExpenseTotal}
        incomeCount={monthlyIncomes.length}
        expenseCount={monthlyExpenses.length}
        categorySummary={categorySummary}
        isReady={isReady}
      />

      <AddExpenseForm
        categories={categories.categories}
        onAdd={expenses.addExpense}
        selectedMonth={selectedMonth}
        disabled={!isReady}
      />

      <ExpenseList
        expenses={monthlyExpenses}
        categories={categories.categories}
        totalAmount={monthlyExpenseTotal}
        selectedMonthLabel={selectedMonthLabel}
        isReady={isReady}
        onEdit={expenses.editExpense}
        onDelete={expenses.removeExpense}
        updatingId={expenses.updatingId}
        deletingId={expenses.deletingId}
      />
    </main>
  );
}
