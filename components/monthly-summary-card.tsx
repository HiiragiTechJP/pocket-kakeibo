"use client";

import { MonthPicker } from "@/components/month-picker";
import { YenAmount } from "@/components/yen-amount";
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
    <section className="rounded-2xl bg-gradient-to-br from-sky-700 via-cyan-700 to-teal-600 px-4 py-5 text-white shadow-lg shadow-sky-200/70 sm:px-5 dark:from-sky-800 dark:via-cyan-800 dark:to-teal-700 dark:shadow-slate-950/50">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-white/80">
          {selectedMonthLabel}の収支
        </p>
        <MonthPicker
          selectedMonth={selectedMonth}
          currentMonth={currentMonth}
          onChange={onMonthChange}
          variant="card"
        />
      </div>

      <div className="mt-2 min-w-0">
        {isReady ? (
          <YenAmount
            amount={balance}
            className={`text-[clamp(1.625rem,7vw,1.875rem)] font-bold ${
              balance < 0 ? "text-amber-100" : ""
            }`}
          />
        ) : (
          <p className="text-3xl font-bold">—</p>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1.5 text-sm text-white/80">
        <p className="whitespace-nowrap">
          収入{" "}
          <span className="font-medium text-white">
            {isReady ? formatYen(incomeTotal) : "—"}
          </span>
          {isReady ? (
            <span className="text-white/70">{` · ${incomeCount}件`}</span>
          ) : null}
        </p>
        <p className="whitespace-nowrap">
          支出{" "}
          <span className="font-medium text-white">
            {isReady ? formatYen(expenseTotal) : "—"}
          </span>
          {isReady ? (
            <span className="text-white/70">{` · ${expenseCount}件`}</span>
          ) : null}
        </p>
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
                <span className="min-w-0 truncate text-white/90">
                  {category.name}
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-white">
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
