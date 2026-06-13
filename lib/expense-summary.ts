import { getCategoryById } from "@/lib/categories";
import { isDateInMonth } from "@/lib/format";
import type { CategoryRecord, ExpenseRecord, IncomeRecord } from "@/lib/types";

export type CategorySummaryItem = {
  id: string;
  name: string;
  amount: number;
};

export function filterExpensesByMonth(
  expenses: ExpenseRecord[],
  isoMonth: string,
): ExpenseRecord[] {
  return expenses.filter((expense) => isDateInMonth(expense.date, isoMonth));
}

export function filterExpensesByCategory(
  expenses: ExpenseRecord[],
  categoryId: string | null,
): ExpenseRecord[] {
  if (!categoryId) return expenses;
  return expenses.filter((expense) => expense.category_id === categoryId);
}

export function filterIncomesByMonth(
  incomes: IncomeRecord[],
  isoMonth: string,
): IncomeRecord[] {
  return incomes.filter((income) => isDateInMonth(income.date, isoMonth));
}

export function calculateMonthlyBalance(
  incomeTotal: number,
  expenseTotal: number,
): number {
  return incomeTotal - expenseTotal;
}

export function calculateAmountTotal(items: { amount: number }[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

export function buildCategorySummary(
  expenses: ExpenseRecord[],
  categories: CategoryRecord[],
): CategorySummaryItem[] {
  const totals = new Map<string, number>();

  for (const expense of expenses) {
    totals.set(
      expense.category_id,
      (totals.get(expense.category_id) ?? 0) + expense.amount,
    );
  }

  const items: CategorySummaryItem[] = [];

  for (const [categoryId, amount] of totals) {
    if (amount <= 0) continue;
    const category = getCategoryById(categories, categoryId);
    items.push({
      id: categoryId,
      name: category?.name ?? "未分類",
      amount,
    });
  }

  return items.sort((a, b) => b.amount - a.amount);
}
