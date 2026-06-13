"use client";

import { AppErrorBanner } from "@/components/app-error-banner";
import { CategoryManager } from "@/components/category-manager";
import { useKakeiboData } from "@/contexts/kakeibo-data-context";

export function SettingsPage() {
  const { categories, expenses, isReady } = useKakeiboData();

  async function handleRemoveCategory(id: string) {
    await categories.removeCategory(id);
    await expenses.reload();
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-5">
      <AppErrorBanner />

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-50">
          設定
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          カテゴリの追加・編集・並び替え
        </p>
      </section>

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
    </main>
  );
}
