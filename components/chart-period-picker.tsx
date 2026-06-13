"use client";

import { useMemo, type ReactNode } from "react";
import { MonthPicker } from "@/components/month-picker";
import {
  detectChartPreset,
  getPresetStartMonth,
  MAX_CHART_MONTHS,
  normalizeChartPeriod,
  type ChartRangeMonths,
} from "@/lib/chart-summary";
import { todayIsoMonth } from "@/lib/format";

const PRESET_OPTIONS: ChartRangeMonths[] = [3, 6, 12];

function SegmentButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-sky-600 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

type Props = {
  startMonth: string;
  endMonth: string;
  onChange: (period: { startMonth: string; endMonth: string }) => void;
};

export function ChartPeriodPicker({ startMonth, endMonth, onChange }: Props) {
  const currentMonth = todayIsoMonth();
  const activePreset = useMemo(
    () => detectChartPreset(startMonth, endMonth),
    [startMonth, endMonth],
  );

  const applyPeriod = (nextStart: string, nextEnd: string) => {
    onChange(normalizeChartPeriod(nextStart, nextEnd));
  };

  const handlePreset = (count: ChartRangeMonths) => {
    applyPeriod(getPresetStartMonth(endMonth, count), endMonth);
  };

  const handleStartChange = (month: string) => {
    applyPeriod(month, endMonth);
  };

  const handleEndChange = (month: string) => {
    applyPeriod(startMonth, month);
  };

  return (
    <div className="mt-4 space-y-4">
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          クイック選択
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESET_OPTIONS.map((option) => (
            <SegmentButton
              key={option}
              active={activePreset === option}
              onClick={() => handlePreset(option)}
            >
              {option}ヶ月
            </SegmentButton>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          期間を指定
        </p>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="w-14 shrink-0 text-xs text-slate-600 dark:text-slate-300">
              開始月
            </span>
            <MonthPicker
              selectedMonth={startMonth}
              currentMonth={currentMonth}
              maxMonth={endMonth}
              onChange={handleStartChange}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="w-14 shrink-0 text-xs text-slate-600 dark:text-slate-300">
              終了月
            </span>
            <MonthPicker
              selectedMonth={endMonth}
              currentMonth={currentMonth}
              minMonth={startMonth}
              maxMonth={currentMonth}
              onChange={handleEndChange}
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          最長{MAX_CHART_MONTHS}ヶ月まで指定できます
        </p>
      </div>
    </div>
  );
}
