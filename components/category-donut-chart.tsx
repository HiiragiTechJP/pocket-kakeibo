"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { CategoryChartItem } from "@/lib/chart-summary";
import { formatYen } from "@/lib/format";

type Props = {
  data: CategoryChartItem[];
};

export function CategoryDonutChart({ data }: Props) {
  if (data.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="mx-auto h-44 w-44 shrink-0 overflow-visible sm:mx-0 [&_.recharts-surface]:border-0 [&_.recharts-surface]:outline-none [&_.recharts-wrapper]:border-0 [&_.recharts-wrapper]:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="88%"
              paddingAngle={0}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((item) => (
                <Cell key={item.id} fill={item.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const item = payload[0].payload as CategoryChartItem;
                return (
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md dark:border-slate-700 dark:bg-slate-900">
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {item.name}
                    </p>
                    <p className="mt-1 tabular-nums text-slate-700 dark:text-slate-200">
                      {formatYen(item.amount)}（{item.percent}%）
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="min-w-0 flex-1 space-y-2">
        {data.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden
              />
              <span className="truncate text-slate-700 dark:text-slate-200">
                {item.name}
              </span>
            </span>
            <span className="shrink-0 tabular-nums text-slate-900 dark:text-slate-50">
              {formatYen(item.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
