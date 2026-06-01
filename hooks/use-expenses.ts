"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  updateExpense,
} from "@/lib/expenses-api";
import type {
  ExpenseInsert,
  ExpenseRecord,
  ExpenseUpdate,
} from "@/lib/types";

function sortExpenses(expenses: ExpenseRecord[]): ExpenseRecord[] {
  return [...expenses].sort((a, b) => {
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

export function useExpenses() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const data = await fetchExpenses();
    setExpenses(sortExpenses(data));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await reload();
      } catch (err) {
        if (!cancelled) {
          setError(toErrorMessage(err, "支出の読み込みに失敗しました"));
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

  const addExpense = useCallback(async (input: ExpenseInsert) => {
    setError(null);
    try {
      const record = await createExpense(input);
      setExpenses((prev) => sortExpenses([record, ...prev]));
    } catch (err) {
      const message = toErrorMessage(err, "支出の追加に失敗しました");
      setError(message);
      throw new Error(message);
    }
  }, []);

  const editExpense = useCallback(async (id: string, input: ExpenseUpdate) => {
    setError(null);
    setUpdatingId(id);
    try {
      const record = await updateExpense(id, input);
      setExpenses((prev) =>
        sortExpenses(prev.map((e) => (e.id === id ? record : e))),
      );
    } catch (err) {
      const raw = toErrorMessage(err, "支出の更新に失敗しました");
      const message = raw.includes("Cannot coerce") ||
        raw.includes("更新対象のデータが見つかりません")
        ? "支出を更新できませんでした。権限設定を確認してください。"
        : raw;
      setError(message);
      throw new Error(message);
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const removeExpense = useCallback(async (id: string) => {
    setError(null);
    setDeletingId(id);
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      const message = toErrorMessage(err, "支出の削除に失敗しました");
      setError(message);
      throw new Error(message);
    } finally {
      setDeletingId(null);
    }
  }, []);

  return {
    expenses,
    addExpense,
    editExpense,
    removeExpense,
    reload,
    isReady,
    error,
    deletingId,
    updatingId,
  };
}
