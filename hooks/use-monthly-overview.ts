"use client";

import { useMemo } from "react";
import { useKakeiboData } from "@/contexts/kakeibo-data-context";
import {
  buildCategorySummary,
  calculateAmountTotal,
  calculateMonthlyBalance,
  filterExpensesByMonth,
  filterIncomesByMonth,
} from "@/lib/expense-summary";

export function useMonthlyOverview(selectedMonth: string) {
  const { categories, expenses, incomes } = useKakeiboData();

  return useMemo(() => {
    const monthlyExpenses = filterExpensesByMonth(
      expenses.expenses,
      selectedMonth,
    );
    const monthlyIncomes = filterIncomesByMonth(incomes.incomes, selectedMonth);
    const expenseTotal = calculateAmountTotal(monthlyExpenses);
    const incomeTotal = calculateAmountTotal(monthlyIncomes);

    return {
      monthlyExpenses,
      monthlyIncomes,
      expenseTotal,
      incomeTotal,
      balance: calculateMonthlyBalance(incomeTotal, expenseTotal),
      categorySummary: buildCategorySummary(
        monthlyExpenses,
        categories.categories,
      ),
    };
  }, [
    categories.categories,
    expenses.expenses,
    incomes.incomes,
    selectedMonth,
  ]);
}
