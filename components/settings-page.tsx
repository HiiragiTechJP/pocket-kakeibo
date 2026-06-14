"use client";

import { useState } from "react";
import { AppPage } from "@/components/app-page";
import { CategoryManager } from "@/components/category-manager";
import { useKakeiboData } from "@/contexts/kakeibo-data-context";
import { useAuth } from "@/hooks/use-auth";
import { cardClassName } from "@/lib/ui";

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const { categories, expenses, isReady } = useKakeiboData();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleRemoveCategory(id: string) {
    await categories.removeCategory(id);
    await expenses.reload();
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <AppPage>
      <CategoryManager
        categories={categories.categories}
        disabled={!isReady}
        savingId={categories.savingId}
        deletingId={categories.deletingId}
        onAdd={async (name) => {
          await categories.addCategory({ name });
        }}
        onEdit={async (id, name) => {
          await categories.editCategory(id, { name });
        }}
        onDelete={handleRemoveCategory}
        onReorder={categories.reorderCategories}
        isReordering={categories.isReordering}
        defaultOpen
      />

      <section className={cardClassName}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          アカウント
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          ログイン中のアカウント
        </p>
        <p
          className="mt-3 truncate rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800/40 dark:text-slate-200"
          title={user?.email ?? undefined}
        >
          {user?.email ?? "—"}
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut || !user}
          className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {isSigningOut ? "ログアウト中…" : "ログアウト"}
        </button>
      </section>
    </AppPage>
  );
}
