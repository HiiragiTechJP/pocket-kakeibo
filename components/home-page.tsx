"use client";

import { AddExpenseForm } from "@/components/add-expense-form";
import { AppPage } from "@/components/app-page";
import { ExpenseList } from "@/components/expense-list";
import { MonthlySummaryCard } from "@/components/monthly-summary-card";
import { useKakeiboData } from "@/contexts/kakeibo-data-context";
import { useMonthlyOverview } from "@/hooks/use-monthly-overview";
import { useSelectedMonth } from "@/hooks/use-selected-month";
import { formatMonthJa } from "@/lib/format";

export function HomePage() {
  const { categories, expenses, isReady } = useKakeiboData();
  const { selectedMonth, setSelectedMonth, currentMonth } = useSelectedMonth();
  const overview = useMonthlyOverview(selectedMonth);
  const selectedMonthLabel = formatMonthJa(selectedMonth);

  return (
    <AppPage>
      <MonthlySummaryCard
        selectedMonth={selectedMonth}
        currentMonth={currentMonth}
        onMonthChange={setSelectedMonth}
        balance={overview.balance}
        incomeTotal={overview.incomeTotal}
        expenseTotal={overview.expenseTotal}
        incomeCount={overview.monthlyIncomes.length}
        expenseCount={overview.monthlyExpenses.length}
        categorySummary={overview.categorySummary}
        isReady={isReady}
      />

      <AddExpenseForm
        categories={categories.categories}
        onAdd={expenses.addExpense}
        selectedMonth={selectedMonth}
        disabled={!isReady}
      />

      <ExpenseList
        expenses={overview.monthlyExpenses}
        categories={categories.categories}
        totalAmount={overview.expenseTotal}
        selectedMonthLabel={selectedMonthLabel}
        isReady={isReady}
        onEdit={expenses.editExpense}
        onDelete={expenses.removeExpense}
        updatingId={expenses.updatingId}
        deletingId={expenses.deletingId}
      />
    </AppPage>
  );
}
