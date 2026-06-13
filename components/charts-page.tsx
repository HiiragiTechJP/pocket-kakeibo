import { AppPage } from "@/components/app-page";
import { cardClassName } from "@/lib/ui";

export function ChartsPage() {
  return (
    <AppPage>
      <section className={cardClassName}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          分析
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          支出・収支のグラフや、期間を指定した集計はここに表示する予定です。
        </p>
        <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-10 text-center dark:border-slate-700 dark:bg-slate-800/30">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            準備中
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            カテゴリ別グラフ / 収支推移 など
          </p>
        </div>
      </section>
    </AppPage>
  );
}
