"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TabIcon, type TabIconId } from "@/components/tab-icons";
import { useSelectedMonth } from "@/contexts/selected-month-context";

type TabConfig = {
  href: string;
  label: string;
  icon: TabIconId;
  match: (path: string) => boolean;
  activeClass: string;
  activeBgClass: string;
};

const tabs: TabConfig[] = [
  {
    href: "/app",
    label: "ホーム",
    icon: "home",
    match: (path) => path === "/app",
    activeClass: "text-sky-700 dark:text-sky-300",
    activeBgClass: "bg-sky-100 dark:bg-sky-950/80",
  },
  {
    href: "/app/income",
    label: "収入",
    icon: "income",
    match: (path) => path.startsWith("/app/income"),
    activeClass: "text-emerald-700 dark:text-emerald-300",
    activeBgClass: "bg-emerald-100 dark:bg-emerald-950/80",
  },
  {
    href: "/app/charts",
    label: "分析",
    icon: "charts",
    match: (path) => path.startsWith("/app/charts"),
    activeClass: "text-violet-700 dark:text-violet-300",
    activeBgClass: "bg-violet-100 dark:bg-violet-950/80",
  },
  {
    href: "/app/settings",
    label: "設定",
    icon: "settings",
    match: (path) => path.startsWith("/app/settings"),
    activeClass: "text-slate-700 dark:text-slate-200",
    activeBgClass: "bg-slate-200/80 dark:bg-slate-800",
  },
];

export function AppBottomNav() {
  const pathname = usePathname();
  const { hrefWithMonth } = useSelectedMonth();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/90 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95"
      aria-label="メインメニュー"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {tabs.map((tab) => {
          const isActive = tab.match(pathname);
          const href =
            tab.href === "/app" || tab.href === "/app/income"
              ? hrefWithMonth(tab.href)
              : tab.href;

          return (
            <Link
              key={tab.href}
              href={href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[11px] font-medium transition-colors ${
                isActive
                  ? tab.activeClass
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                  isActive
                    ? tab.activeBgClass
                    : "bg-transparent text-slate-400 dark:text-slate-500"
                }`}
              >
                <TabIcon id={tab.icon} className="h-[22px] w-[22px]" />
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
