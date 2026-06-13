"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

function isMonthRoute(pathname: string): boolean {
  return pathname === "/app" || pathname.startsWith("/app/income");
}

type SelectedMonthContextValue = {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  shiftMonth: (diff: number) => void;
  currentMonth: string;
  hrefWithMonth: (path: string) => string;
};

const SelectedMonthContext = createContext<SelectedMonthContextValue | null>(
  null,
);

export function SelectedMonthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentMonth = todayIsoMonth();

  const monthParam = searchParams.get(MONTH_PARAM);
  const monthFromUrl =
    monthParam && isValidIsoMonth(monthParam) ? monthParam : null;

  const selectedMonth = useMemo(() => {
    if (monthFromUrl) return monthFromUrl;
    if (isMonthRoute(pathname)) return currentMonth;
    return readStoredMonth() ?? currentMonth;
  }, [monthFromUrl, pathname, currentMonth]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    if (!isMonthRoute(pathname)) return;
    if (monthFromUrl) return;
    router.replace(`${pathname}?${MONTH_PARAM}=${selectedMonth}`);
  }, [pathname, monthFromUrl, selectedMonth, router]);

  const setSelectedMonth = useCallback(
    (month: string) => {
      if (!isValidIsoMonth(month)) return;
      sessionStorage.setItem(STORAGE_KEY, month);
      if (isMonthRoute(pathname)) {
        router.replace(`${pathname}?${MONTH_PARAM}=${month}`);
      }
    },
    [pathname, router],
  );

  const shiftMonth = useCallback(
    (diff: number) => {
      setSelectedMonth(shiftIsoMonth(selectedMonth, diff));
    },
    [selectedMonth, setSelectedMonth],
  );

  const hrefWithMonth = useCallback(
    (path: string) => `${path}?${MONTH_PARAM}=${selectedMonth}`,
    [selectedMonth],
  );

  const value = useMemo(
    () => ({
      selectedMonth,
      setSelectedMonth,
      shiftMonth,
      currentMonth,
      hrefWithMonth,
    }),
    [selectedMonth, setSelectedMonth, shiftMonth, currentMonth, hrefWithMonth],
  );

  return (
    <SelectedMonthContext.Provider value={value}>
      {children}
    </SelectedMonthContext.Provider>
  );
}

export function useSelectedMonth(): SelectedMonthContextValue {
  const value = useContext(SelectedMonthContext);
  if (!value) {
    throw new Error(
      "useSelectedMonth must be used within SelectedMonthProvider",
    );
  }
  return value;
}
