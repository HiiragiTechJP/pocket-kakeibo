"use client";

import { compareIsoMonth, formatMonthJa, shiftIsoMonth } from "@/lib/format";

type Props = {
  selectedMonth: string;
  currentMonth: string;
  onChange: (month: string) => void;
  variant?: "card" | "plain";
  minMonth?: string;
  maxMonth?: string;
};

export function MonthPicker({
  selectedMonth,
  currentMonth,
  onChange,
  variant = "plain",
  minMonth,
  maxMonth,
}: Props) {
  const label = formatMonthJa(selectedMonth);
  const effectiveMaxMonth = maxMonth ?? currentMonth;
  const canGoPrev = minMonth
    ? compareIsoMonth(selectedMonth, minMonth) > 0
    : true;
  const canGoNext =
    compareIsoMonth(selectedMonth, effectiveMaxMonth) < 0;

  const wrapClass =
    variant === "card"
      ? "rounded-full bg-white/10 px-1 py-1 backdrop-blur-sm"
      : "rounded-full border border-slate-200 bg-white px-1 py-1 dark:border-slate-700 dark:bg-slate-900";

  const btnClass =
    variant === "card"
      ? "text-white hover:bg-white/10 active:bg-white/20 disabled:opacity-40"
      : "text-slate-700 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-800";

  const labelClass =
    variant === "card"
      ? "text-white"
      : "text-slate-900 dark:text-slate-50";

  return (
    <div className={`flex shrink-0 items-center gap-1 ${wrapClass}`}>
      <button
        type="button"
        onClick={() => onChange(shiftIsoMonth(selectedMonth, -1))}
        aria-label="前の月を表示"
        disabled={!canGoPrev}
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors disabled:cursor-not-allowed ${btnClass}`}
      >
        ←
      </button>
      <p
        className={`min-w-[6.5rem] text-center text-sm font-medium ${labelClass}`}
      >
        {label}
      </p>
      <button
        type="button"
        onClick={() => onChange(shiftIsoMonth(selectedMonth, 1))}
        aria-label="次の月を表示"
        disabled={!canGoNext}
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors disabled:cursor-not-allowed ${btnClass}`}
      >
        →
      </button>
    </div>
  );
}
