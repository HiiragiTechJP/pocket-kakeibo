"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatChartAxisValue,
  type MonthlyChartPoint,
} from "@/lib/chart-summary";
import { formatYen } from "@/lib/format";

const INCOME_COLOR = "#059669";
const EXPENSE_COLOR = "#0284c7";

type Props = {
  data: MonthlyChartPoint[];
};

export function MonthlyIncomeExpenseChart({ data }: Props) {
  return (
    <div>
      <div className="h-56 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#64748b" }}
              interval={0}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={formatChartAxisValue}
              tick={{ fontSize: 11, fill: "#64748b" }}
              width={44}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.15)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const expense = payload.find((p) => p.dataKey === "expense")?.value as number ?? 0;
                const income = payload.find((p) => p.dataKey === "income")?.value as number ?? 0;
                return (
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md dark:border-slate-700 dark:bg-slate-900">
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {label}
                    </p>
                    <p className="mt-1 tabular-nums text-emerald-700 dark:text-emerald-300">
                      収入 {formatYen(income)}
                    </p>
                    <p className="tabular-nums text-sky-700 dark:text-sky-300">
                      支出 {formatYen(expense)}
                    </p>
                    <p className="mt-1 tabular-nums text-slate-700 dark:text-slate-200">
                      収支 {formatYen(income - expense)}
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              name="収入"
              dataKey="income"
              fill={INCOME_COLOR}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              name="支出"
              dataKey="expense"
              fill={EXPENSE_COLOR}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div
        className="mt-2 flex items-center justify-center gap-5 text-xs text-slate-600 dark:text-slate-300"
        aria-hidden
      >
        <span className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: INCOME_COLOR }}
          />
          収入
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: EXPENSE_COLOR }}
          />
          支出
        </span>
      </div>
    </div>
  );
}
