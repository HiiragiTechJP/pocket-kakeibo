"use client";

import { useCallback, useEffect, useState } from "react";
import { sortCategories } from "@/lib/categories";
import {
  createCategory,
  deleteCategory,
  ensureDefaultCategory,
  fetchCategories,
  reorderCategories as reorderCategoriesApi,
  updateCategory,
} from "@/lib/categories-api";
import type {
  CategoryInsert,
  CategoryRecord,
  CategoryUpdate,
} from "@/lib/types";

function toErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string" && message.length > 0) return message;
  }
  return fallback;
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const reload = useCallback(async () => {
    await ensureDefaultCategory();
    const data = await fetchCategories();
    setCategories(sortCategories(data));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await reload();
      } catch (err) {
        if (!cancelled) {
          setError(toErrorMessage(err, "カテゴリの読み込みに失敗しました"));
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

  const addCategory = useCallback(
    async (input: CategoryInsert) => {
      setError(null);
      try {
        const record = await createCategory(input);
        setCategories((prev) => sortCategories([...prev, record]));
        return record;
      } catch (err) {
        const message = toErrorMessage(err, "カテゴリの追加に失敗しました");
        setError(message);
        throw new Error(message);
      }
    },
    [],
  );

  const editCategory = useCallback(async (id: string, input: CategoryUpdate) => {
    setError(null);
    setSavingId(id);
    try {
      const record = await updateCategory(id, input);
      setCategories((prev) =>
        sortCategories(prev.map((c) => (c.id === id ? record : c))),
      );
      return record;
    } catch (err) {
      const message = toErrorMessage(err, "カテゴリ名の変更に失敗しました");
      setError(message);
      throw new Error(message);
    } finally {
      setSavingId(null);
    }
  }, []);

  const removeCategory = useCallback(async (id: string) => {
    setError(null);
    setDeletingId(id);
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      const message = toErrorMessage(err, "カテゴリの削除に失敗しました");
      setError(message);
      throw new Error(message);
    } finally {
      setDeletingId(null);
    }
  }, []);

  const reorderCategories = useCallback(
    async (orderedCustomIds: string[]) => {
      setError(null);
      setIsReordering(true);
      try {
        await reorderCategoriesApi(orderedCustomIds);
        await reload();
      } catch (err) {
        const message = toErrorMessage(err, "並び替えの保存に失敗しました");
        setError(message);
        throw new Error(message);
      } finally {
        setIsReordering(false);
      }
    },
    [reload],
  );

  return {
    categories,
    isReady,
    error,
    savingId,
    deletingId,
    isReordering,
    addCategory,
    editCategory,
    removeCategory,
    reorderCategories,
    reload,
  };
}
