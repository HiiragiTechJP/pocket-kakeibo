import { getCategoryById } from "@/lib/categories";
import { isDateInMonth } from "@/lib/format";
import type { CategoryRecord, ExpenseRecord } from "@/lib/types";

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

export function calculateExpenseTotal(expenses: ExpenseRecord[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
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
