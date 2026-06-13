import { sortCategories } from "@/lib/categories";
import { buildCategorySummary } from "@/lib/expense-summary";
import { compareIsoMonth, isDateInMonth, shiftIsoMonth } from "@/lib/format";
import type { CategoryRecord, ExpenseRecord, IncomeRecord } from "@/lib/types";

export type ChartRangeMonths = 3 | 6 | 12;

export const MAX_CHART_MONTHS = 24;

export type MonthlyChartPoint = {
  month: string;
  label: string;
  expense: number;
  income: number;
  balance: number;
};

export type CategoryChartItem = {
  id: string;
  name: string;
  amount: number;
  percent: number;
  color: string;
};

export type PeriodTotals = {
  expenseTotal: number;
  incomeTotal: number;
  balance: number;
  expenseAverage: number;
};

export const CATEGORY_CHART_COLORS = [
  "#0284c7",
  "#0d9488",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#65a30d",
  "#0891b2",
  "#64748b",
] as const;

export function buildInclusiveMonthRange(
  startMonth: string,
  endMonth: string,
): string[] {
  let start = startMonth;
  let end = endMonth;
  if (compareIsoMonth(start, end) > 0) {
    [start, end] = [end, start];
  }

  const months: string[] = [];
  let cursor = start;

  while (compareIsoMonth(cursor, end) <= 0) {
    months.push(cursor);
    if (cursor === end) break;
    cursor = shiftIsoMonth(cursor, 1);
    if (months.length > MAX_CHART_MONTHS) break;
  }

  return months;
}

export function normalizeChartPeriod(
  startMonth: string,
  endMonth: string,
  maxMonths: number = MAX_CHART_MONTHS,
): { startMonth: string; endMonth: string } {
  let start = startMonth;
  let end = endMonth;

  if (compareIsoMonth(start, end) > 0) {
    start = end;
  }

  const range = buildInclusiveMonthRange(start, end);
  if (range.length > maxMonths) {
    start = range[range.length - maxMonths];
  }

  return { startMonth: start, endMonth: end };
}

export function getPresetStartMonth(
  endMonth: string,
  count: ChartRangeMonths,
): string {
  return shiftIsoMonth(endMonth, -(count - 1));
}

export function getChartMonthRange(
  endMonth: string,
  count: ChartRangeMonths,
): string[] {
  return buildInclusiveMonthRange(getPresetStartMonth(endMonth, count), endMonth);
}

export function detectChartPreset(
  startMonth: string,
  endMonth: string,
): ChartRangeMonths | null {
  const months = buildInclusiveMonthRange(startMonth, endMonth);
  const count = months.length;
  if (count !== 3 && count !== 6 && count !== 12) return null;
  if (getPresetStartMonth(endMonth, count) !== startMonth) return null;
  return count;
}

export function formatChartMonthLabel(
  isoMonth: string,
  rangeMonths: string[],
): string {
  const [year, month] = isoMonth.split("-").map(Number);
  const years = new Set(rangeMonths.map((m) => m.slice(0, 4)));
  if (years.size > 1) {
    return `${String(year).slice(-2)}/${month}`;
  }
  return `${month}月`;
}

export function filterExpensesInMonths(
  expenses: ExpenseRecord[],
  months: string[],
): ExpenseRecord[] {
  return expenses.filter((expense) =>
    months.some((month) => isDateInMonth(expense.date, month)),
  );
}

export function buildMonthlyChartSeries(
  rangeMonths: string[],
  expenses: ExpenseRecord[],
  incomes: IncomeRecord[],
): MonthlyChartPoint[] {
  return rangeMonths.map((month) => {
    const expense = expenses
      .filter((item) => isDateInMonth(item.date, month))
      .reduce((sum, item) => sum + item.amount, 0);
    const income = incomes
      .filter((item) => isDateInMonth(item.date, month))
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      month,
      label: formatChartMonthLabel(month, rangeMonths),
      expense,
      income,
      balance: income - expense,
    };
  });
}

export function buildPeriodCategoryChart(
  rangeMonths: string[],
  expenses: ExpenseRecord[],
  categories: CategoryRecord[],
): CategoryChartItem[] {
  const periodExpenses = filterExpensesInMonths(expenses, rangeMonths);
  const summary = buildCategorySummary(periodExpenses, categories);
  const sorted = sortCategories(categories);
  const order = new Map(sorted.map((c, i) => [c.id, i]));

  const ordered = [...summary].sort((a, b) => {
    const orderA = order.get(a.id) ?? 999;
    const orderB = order.get(b.id) ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return b.amount - a.amount;
  });

  const total = ordered.reduce((sum, item) => sum + item.amount, 0);
  if (total <= 0) return [];

  return ordered.map((item, index) => ({
    id: item.id,
    name: item.name,
    amount: item.amount,
    percent: Math.round((item.amount / total) * 1000) / 10,
    color: CATEGORY_CHART_COLORS[index % CATEGORY_CHART_COLORS.length],
  }));
}

export function getPeriodTotals(series: MonthlyChartPoint[]): PeriodTotals {
  const expenseTotal = series.reduce((sum, p) => sum + p.expense, 0);
  const incomeTotal = series.reduce((sum, p) => sum + p.income, 0);
  const count = series.length || 1;

  return {
    expenseTotal,
    incomeTotal,
    balance: incomeTotal - expenseTotal,
    expenseAverage: Math.round(expenseTotal / count),
  };
}

export function formatChartAxisValue(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 10000) {
    return `${value < 0 ? "-" : ""}${Math.round(abs / 10000)}万`;
  }
  return new Intl.NumberFormat("ja-JP").format(value);
}
