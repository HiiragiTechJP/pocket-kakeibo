import { createClient } from "@/lib/supabase/client";
import {
  DEFAULT_CATEGORY_NAME,
  MAX_CATEGORY_NAME_LENGTH,
} from "@/lib/categories";
import type { CategoryInsert, CategoryRecord, CategoryUpdate } from "@/lib/types";

async function getRequiredUserId(): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("ログインが必要です");
  }

  return user.id;
}

type CategoryRow = {
  id: string;
  user_id: string;
  name: string;
  type: "expense";
  is_system: boolean;
  sort_order: number;
  created_at: string;
};

function toCategoryRecord(row: CategoryRow): CategoryRecord {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    type: row.type,
    is_system: row.is_system,
    sort_order: row.sort_order,
    created_at: row.created_at,
  };
}

async function getNextSortOrder(userId: string): Promise<number> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("sort_order")
    .eq("user_id", userId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data?.sort_order ?? 0) + 10;
}

function validateCategoryName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("カテゴリ名を入力してください");
  }
  if (trimmed.length > MAX_CATEGORY_NAME_LENGTH) {
    throw new Error(
      `カテゴリ名は${MAX_CATEGORY_NAME_LENGTH}文字以内で入力してください`,
    );
  }
  return trimmed;
}

export async function fetchCategories(): Promise<CategoryRecord[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("is_system", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => toCategoryRecord(row as CategoryRow));
}

export async function ensureDefaultCategory(): Promise<CategoryRecord> {
  const supabase = createClient();
  const userId = await getRequiredUserId();

  const { data: existing, error: selectError } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", userId)
    .eq("is_system", true)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return toCategoryRecord(existing as CategoryRow);

  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: userId,
      name: DEFAULT_CATEGORY_NAME,
      type: "expense",
      is_system: true,
      sort_order: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return toCategoryRecord(data as CategoryRow);
}

export async function createCategory(
  input: CategoryInsert,
): Promise<CategoryRecord> {
  const supabase = createClient();
  const userId = await getRequiredUserId();
  const name = validateCategoryName(input.name);
  const sortOrder = await getNextSortOrder(userId);

  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: userId,
      name,
      type: input.type ?? "expense",
      is_system: false,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) throw error;
  return toCategoryRecord(data as CategoryRow);
}

export async function updateCategory(
  id: string,
  input: CategoryUpdate,
): Promise<CategoryRecord> {
  const supabase = createClient();
  await getRequiredUserId();
  const name = validateCategoryName(input.name);

  const { data: target, error: fetchError } = await supabase
    .from("categories")
    .select("is_system")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!target) {
    throw new Error("カテゴリが見つかりません");
  }
  if (target.is_system) {
    throw new Error("「未分類」は名前を変更できません");
  }

  const { data, error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new Error("カテゴリが見つかりません");
  }
  return toCategoryRecord(data as CategoryRow);
}

async function getDefaultCategoryId(): Promise<string> {
  const supabase = createClient();
  const userId = await getRequiredUserId();

  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("user_id", userId)
    .eq("is_system", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    const created = await ensureDefaultCategory();
    return created.id;
  }
  return data.id;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = createClient();
  const userId = await getRequiredUserId();

  const { data: target, error: fetchError } = await supabase
    .from("categories")
    .select("id, is_system")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!target) {
    throw new Error("カテゴリが見つかりません");
  }
  if (target.is_system) {
    throw new Error("「未分類」は削除できません");
  }

  const defaultId = await getDefaultCategoryId();

  const { error: reassignError } = await supabase
    .from("expenses")
    .update({ category_id: defaultId })
    .eq("category_id", id)
    .eq("user_id", userId);

  if (reassignError) throw reassignError;

  const { error: deleteError } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (deleteError) throw deleteError;
}

/** カスタムカテゴリの並び順を保存（未分類は含めない） */
export async function reorderCategories(
  orderedCustomIds: string[],
): Promise<void> {
  const supabase = createClient();
  await getRequiredUserId();

  const updates = orderedCustomIds.map((id, index) =>
    supabase
      .from("categories")
      .update({ sort_order: (index + 1) * 10 })
      .eq("id", id)
      .eq("is_system", false),
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
}
