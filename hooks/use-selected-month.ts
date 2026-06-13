"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { shiftIsoMonth, todayIsoMonth } from "@/lib/format";

const MONTH_PARAM = "month";
const STORAGE_KEY = "kakeibo-selected-month";

function isValidIsoMonth(value: string): boolean {
  return /^\d{4}-\d{2}$/.test(value);
}

function readStoredMonth(): string | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  return stored && isValidIsoMonth(stored) ? stored : null;
}

export function useSelectedMonth() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentMonth = todayIsoMonth();
  const [storedMonth, setStoredMonth] = useState<string | null>(null);

  useEffect(() => {
    setStoredMonth(readStoredMonth());
  }, []);

  const selectedMonth = useMemo(() => {
    const param = searchParams.get(MONTH_PARAM);
    if (param && isValidIsoMonth(param)) return param;
    if (storedMonth) return storedMonth;
    return currentMonth;
  }, [searchParams, storedMonth, currentMonth]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, selectedMonth);
    setStoredMonth(selectedMonth);
  }, [selectedMonth]);

  const setSelectedMonth = useCallback(
    (month: string) => {
      sessionStorage.setItem(STORAGE_KEY, month);
      setStoredMonth(month);

      const usesMonthInUrl =
        pathname === "/app" || pathname.startsWith("/app/income");
      if (!usesMonthInUrl) return;

      const params = new URLSearchParams(searchParams.toString());
      if (month === currentMonth) {
        params.delete(MONTH_PARAM);
      } else {
        params.set(MONTH_PARAM, month);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams, currentMonth],
  );

  const shiftMonth = useCallback(
    (diff: number) => {
      setSelectedMonth(shiftIsoMonth(selectedMonth, diff));
    },
    [selectedMonth, setSelectedMonth],
  );

  const hrefWithMonth = useCallback(
    (path: string) => {
      if (selectedMonth === currentMonth) return path;
      return `${path}?${MONTH_PARAM}=${selectedMonth}`;
    },
    [selectedMonth, currentMonth],
  );

  return {
    selectedMonth,
    setSelectedMonth,
    shiftMonth,
    currentMonth,
    hrefWithMonth,
  };
}
