"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createIncome,
  deleteIncome,
  fetchIncomes,
  updateIncome,
} from "@/lib/incomes-api";
import type { IncomeInsert, IncomeRecord, IncomeUpdate } from "@/lib/types";

function sortIncomes(incomes: IncomeRecord[]): IncomeRecord[] {
  return [...incomes].sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    if (byDate !== 0) return byDate;
    return b.created_at.localeCompare(a.created_at);
  });
}

function toErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string" && message.length > 0) return message;
  }
  return fallback;
}

export function useIncomes() {
  const [incomes, setIncomes] = useState<IncomeRecord[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const data = await fetchIncomes();
    setIncomes(sortIncomes(data));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await reload();
      } catch (err) {
        if (!cancelled) {
          setError(toErrorMessage(err, "収入の読み込みに失敗しました"));
        }
      } finally {
        if (!cancelled) setIsReady(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [reload]);

  const addIncome = useCallback(async (input: IncomeInsert) => {
    setError(null);
    try {
      const record = await createIncome(input);
      setIncomes((prev) => sortIncomes([record, ...prev]));
    } catch (err) {
      const message = toErrorMessage(err, "収入の追加に失敗しました");
      setError(message);
      throw new Error(message);
    }
  }, []);

  const editIncome = useCallback(async (id: string, input: IncomeUpdate) => {
    setError(null);
    setUpdatingId(id);
    try {
      const record = await updateIncome(id, input);
      setIncomes((prev) =>
        sortIncomes(prev.map((i) => (i.id === id ? record : i))),
      );
    } catch (err) {
      const message = toErrorMessage(err, "収入の更新に失敗しました");
      setError(message);
      throw new Error(message);
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const removeIncome = useCallback(async (id: string) => {
    setError(null);
    setDeletingId(id);
    try {
      await deleteIncome(id);
      setIncomes((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      const message = toErrorMessage(err, "収入の削除に失敗しました");
      setError(message);
      throw new Error(message);
    } finally {
      setDeletingId(null);
    }
  }, []);

  return {
    incomes,
    addIncome,
    editIncome,
    removeIncome,
    reload,
    isReady,
    error,
    deletingId,
    updatingId,
  };
}
