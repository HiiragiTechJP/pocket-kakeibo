"use client";

import { AppPage } from "@/components/app-page";
import { CategoryManager } from "@/components/category-manager";
import { useKakeiboData } from "@/contexts/kakeibo-data-context";

export function SettingsPage() {
  const { categories, expenses, isReady } = useKakeiboData();

  async function handleRemoveCategory(id: string) {
    await categories.removeCategory(id);
    await expenses.reload();
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
    </AppPage>
  );
}
