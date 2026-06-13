"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelectedMonth } from "@/hooks/use-selected-month";

const tabs = [
  { href: "/app", label: "ホーム", match: (path: string) => path === "/app" },
  {
    href: "/app/income",
    label: "収入",
    match: (path: string) => path.startsWith("/app/income"),
  },
  {
    href: "/app/charts",
    label: "分析",
    match: (path: string) => path.startsWith("/app/charts"),
  },
  {
    href: "/app/settings",
    label: "設定",
    match: (path: string) => path.startsWith("/app/settings"),
  },
] as const;

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
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "text-sky-700 dark:text-sky-300"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                  isActive
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
                aria-hidden
              >
                {tab.label.slice(0, 1)}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
