import type { CategoryRecord } from "@/lib/types";

export const DEFAULT_CATEGORY_NAME = "未分類";

export const MAX_CATEGORY_NAME_LENGTH = 20;

export function sortCategories(categories: CategoryRecord[]): CategoryRecord[] {
  return [...categories].sort((a, b) => {
    if (a.is_system !== b.is_system) {
      return a.is_system ? -1 : 1;
    }
    return a.sort_order - b.sort_order;
  });
}

export function splitCategories(categories: CategoryRecord[]) {
  const system = categories.find((c) => c.is_system);
  const custom = categories.filter((c) => !c.is_system);
  return { system, custom };
}

export function getCategoryById(
  categories: CategoryRecord[],
  id: string,
): CategoryRecord | undefined {
  return categories.find((c) => c.id === id);
}

export function getDefaultCategory(
  categories: CategoryRecord[],
): CategoryRecord | undefined {
  return categories.find((c) => c.is_system);
}

/** 支出追加フォームの初期選択用（常に「未分類」） */
export function getPreferredCategoryId(categories: CategoryRecord[]): string {
  return getDefaultCategory(categories)?.id ?? "";
}
