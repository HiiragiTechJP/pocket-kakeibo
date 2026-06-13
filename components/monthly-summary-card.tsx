"use client";

import { MonthPicker } from "@/components/month-picker";
import type { CategorySummaryItem } from "@/lib/expense-summary";
import { formatMonthJa, formatYen } from "@/lib/format";

type Props = {
  selectedMonth: string;
  currentMonth: string;
  onMonthChange: (month: string) => void;
  balance: number;
  incomeTotal: number;
  expenseTotal: number;
  incomeCount: number;
  expenseCount: number;
  categorySummary: CategorySummaryItem[];
  isReady: boolean;
};

export function MonthlySummaryCard({
  selectedMonth,
  currentMonth,
  onMonthChange,
  balance,
  incomeTotal,
  expenseTotal,
  incomeCount,
  expenseCount,
  categorySummary,
  isReady,
}: Props) {
  const selectedMonthLabel = formatMonthJa(selectedMonth);

  return (
    <section className="rounded-2xl bg-gradient-to-br from-sky-700 via-cyan-700 to-teal-600 px-5 py-5 text-white shadow-lg shadow-sky-200/70 dark:from-sky-800 dark:via-cyan-800 dark:to-teal-700 dark:shadow-slate-950/50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white/80">
            {selectedMonthLabel}の収支
          </p>
          <p
            className={`mt-1 text-3xl font-bold tabular-nums tracking-tight ${
              isReady && balance < 0 ? "text-amber-100" : ""
            }`}
          >
            {isReady ? formatYen(balance) : "—"}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/80">
            <span>
              収入{" "}
              <span className="font-medium text-white">
                {isReady ? formatYen(incomeTotal) : "—"}
              </span>
              {isReady ? ` · ${incomeCount}件` : null}
            </span>
            <span>
              支出{" "}
              <span className="font-medium text-white">
                {isReady ? formatYen(expenseTotal) : "—"}
              </span>
              {isReady ? ` · ${expenseCount}件` : null}
            </span>
          </div>
        </div>

        <MonthPicker
          selectedMonth={selectedMonth}
          currentMonth={currentMonth}
          onChange={onMonthChange}
          variant="card"
        />
      </div>

      <div className="mt-4 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
        <p className="text-sm font-medium text-white">支出（カテゴリ別）</p>
        {!isReady ? (
          <p className="mt-2 text-sm text-white/80">読み込み中…</p>
        ) : categorySummary.length === 0 ? (
          <p className="mt-2 text-sm text-white/80">
            {selectedMonthLabel}の支出はまだありません。
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
  );
}
