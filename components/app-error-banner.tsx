"use client";

import { useKakeiboData } from "@/contexts/kakeibo-data-context";

export function AppErrorBanner() {
  const { error } = useKakeiboData();
  if (!error) return null;

  return (
    <p
      className="rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-800 shadow-sm dark:border-red-900 dark:bg-red-950/80 dark:text-red-200"
      role="alert"
    >
      {error}
    </p>
  );
}
