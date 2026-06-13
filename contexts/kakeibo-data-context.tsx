"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useCategories } from "@/hooks/use-categories";
import { useExpenses } from "@/hooks/use-expenses";
import { useIncomes } from "@/hooks/use-incomes";

type CategoriesState = ReturnType<typeof useCategories>;
type ExpensesState = ReturnType<typeof useExpenses>;
type IncomesState = ReturnType<typeof useIncomes>;

type KakeiboDataContextValue = {
  categories: CategoriesState;
  expenses: ExpensesState;
  incomes: IncomesState;
  isReady: boolean;
  error: string | null;
};

const KakeiboDataContext = createContext<KakeiboDataContextValue | null>(null);

export function KakeiboDataProvider({ children }: { children: ReactNode }) {
  const categories = useCategories();
  const expenses = useExpenses();
  const incomes = useIncomes();

  const isReady =
    categories.isReady && expenses.isReady && incomes.isReady;
  const error =
    categories.error ?? expenses.error ?? incomes.error ?? null;

  return (
    <KakeiboDataContext.Provider
      value={{ categories, expenses, incomes, isReady, error }}
    >
      {children}
    </KakeiboDataContext.Provider>
  );
}

export function useKakeiboData(): KakeiboDataContextValue {
  const value = useContext(KakeiboDataContext);
  if (!value) {
    throw new Error("useKakeiboData must be used within KakeiboDataProvider");
  }
  return value;
}
