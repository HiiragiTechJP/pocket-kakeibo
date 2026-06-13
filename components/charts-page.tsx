"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AppPage } from "@/components/app-page";
import { CategoryDonutChart } from "@/components/category-donut-chart";
import { ChartPeriodPicker } from "@/components/chart-period-picker";
import { MonthlyExpenseChart } from "@/components/monthly-expense-chart";
import { MonthlyIncomeExpenseChart } from "@/components/monthly-income-expense-chart";
import { YenAmount } from "@/components/yen-amount";
import { useKakeiboData } from "@/contexts/kakeibo-data-context";
import {
  buildInclusiveMonthRange,
  buildMonthlyChartSeries,
  buildPeriodCategoryChart,
  getPeriodTotals,
  getPresetStartMonth,
  normalizeChartPeriod,
} from "@/lib/chart-summary";
import { formatYen, todayIsoMonth } from "@/lib/format";
import { cardClassName } from "@/lib/ui";

function ChartSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h3>
      <div className="mt-3 min-w-0">{children}</div>
    </section>
  );
}

export function ChartsPage() {
  const { categories, expenses, incomes, isReady } = useKakeiboData();
  const currentMonth = todayIsoMonth();
  const [period, setPeriod] = useState(() =>
    normalizeChartPeriod(
      getPresetStartMonth(currentMonth, 6),
      currentMonth,
    ),
  );

  const rangeMonthList = useMemo(
    () => buildInclusiveMonthRange(period.startMonth, period.endMonth),
    [period.endMonth, period.startMonth],
  );

  const series = useMemo(
    () =>
      buildMonthlyChartSeries(
        rangeMonthList,
        expenses.expenses,
        incomes.incomes,
      ),
    [rangeMonthList, expenses.expenses, incomes.incomes],
  );

  const categoryChart = useMemo(
    () =>
      buildPeriodCategoryChart(
        rangeMonthList,
        expenses.expenses,
        categories.categories,
      ),
    [rangeMonthList, expenses.expenses, categories.categories],
  );

  const totals = useMemo(() => getPeriodTotals(series), [series]);

  const hasAnyData = useMemo(
    () => series.some((point) => point.expense > 0 || point.income > 0),
    [series],
  );

  const hasExpenseData = totals.expenseTotal > 0;

  return (
    <AppPage>
      <section className={cardClassName}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          分析
        </h2>

        <ChartPeriodPicker
          startMonth={period.startMonth}
          endMonth={period.endMonth}
          onChange={setPeriod}
        />

        {!isReady ? (
          <p className="py-16 text-center text-sm text-slate-500 dark:text-slate-400">
            読み込み中…
          </p>
        ) : !hasAnyData ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-12 text-center dark:border-slate-700 dark:bg-slate-800/30">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              この期間のデータはまだありません
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              ホーム・収入から記録するとグラフに表示されます
            </p>
          </div>
        ) : (
          <>
            <dl className="mt-5 space-y-3 rounded-xl bg-slate-50 px-3 py-3 dark:bg-slate-800/40">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <dt className="text-[11px] text-slate-500 dark:text-slate-400">
                    収入
                  </dt>
                  <dd className="mt-0.5 text-xs font-semibold tabular-nums text-emerald-700 sm:text-sm dark:text-emerald-300">
                    {formatYen(totals.incomeTotal)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-slate-500 dark:text-slate-400">
                    支出
                  </dt>
                  <dd className="mt-0.5 text-xs font-semibold tabular-nums text-sky-700 sm:text-sm dark:text-sky-300">
                    {formatYen(totals.expenseTotal)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-slate-500 dark:text-slate-400">
                    収支
                  </dt>
                  <dd className="mt-0.5">
                    <YenAmount
                      amount={totals.balance}
                      className={`text-xs font-semibold sm:text-sm ${
                        totals.balance < 0
                          ? "text-amber-700 dark:text-amber-300"
                          : "text-slate-900 dark:text-slate-50"
                      }`}
                    />
                  </dd>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-slate-200/80 pt-3 dark:border-slate-700/80">
                <div>
                  <dt className="text-[11px] text-slate-500 dark:text-slate-400">
                    月平均収入
                  </dt>
                  <dd className="mt-0.5 text-xs font-semibold tabular-nums text-emerald-700 sm:text-sm dark:text-emerald-300">
                    {formatYen(totals.incomeAverage)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-slate-500 dark:text-slate-400">
                    月平均支出
                  </dt>
                  <dd className="mt-0.5 text-xs font-semibold tabular-nums text-sky-700 sm:text-sm dark:text-sky-300">
                    {formatYen(totals.expenseAverage)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-slate-500 dark:text-slate-400">
                    月平均収支
                  </dt>
                  <dd className="mt-0.5">
                    <YenAmount
                      amount={totals.balanceAverage}
                      className={`text-xs font-semibold sm:text-sm ${
                        totals.balanceAverage < 0
                          ? "text-amber-700 dark:text-amber-300"
                          : "text-slate-900 dark:text-slate-50"
                      }`}
                    />
                  </dd>
                </div>
              </div>
            </dl>

            <ChartSection title="カテゴリ別（支出）">
              {hasExpenseData ? (
                <CategoryDonutChart data={categoryChart} />
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  この期間の支出はまだありません
                </p>
              )}
            </ChartSection>

            <ChartSection title="月別の支出">
              {hasExpenseData ? (
                <MonthlyExpenseChart data={series} />
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  この期間の支出はまだありません
                </p>
              )}
            </ChartSection>

            <ChartSection title="月別の収入・支出">
              <MonthlyIncomeExpenseChart data={series} />
            </ChartSection>
          </>
        )}
      </section>
    </AppPage>
  );
}
