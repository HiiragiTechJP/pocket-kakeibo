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

type Props = {
  data: MonthlyChartPoint[];
};

export function MonthlyExpenseChart({ data }: Props) {
  return (
    <div className="h-52 w-full min-w-0">
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
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const row = payload[0].payload as MonthlyChartPoint;
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md dark:border-slate-700 dark:bg-slate-900">
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    {row.label}
                  </p>
                  <p className="mt-1 tabular-nums text-slate-700 dark:text-slate-200">
                    支出 {formatYen(row.expense)}
                  </p>
                </div>
              );
            }}
          />
          <Bar
            dataKey="expense"
            fill="#0284c7"
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
