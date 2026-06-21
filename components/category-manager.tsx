"use client";

import { FormEvent, useState } from "react";
import { CategoryReorderList } from "@/components/category-reorder-list";
import {
  DEFAULT_CATEGORY_NAME,
  MAX_CATEGORY_NAME_LENGTH,
  splitCategories,
} from "@/lib/categories";
import { formInputClass } from "@/lib/ui";
import type { CategoryRecord } from "@/lib/types";

type Props = {
  categories: CategoryRecord[];
  disabled?: boolean;
  savingId: string | null;
  deletingId: string | null;
  onAdd: (name: string) => void | Promise<void>;
  onEdit: (id: string, name: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onReorder: (orderedCustomIds: string[]) => void | Promise<void>;
  isReordering?: boolean;
  defaultOpen?: boolean;
};

const inputClassName = `${formInputClass({ accent: "sky" })} text-base`;

export function CategoryManager({
  categories,
  disabled = false,
  savingId,
  deletingId,
  onAdd,
  onEdit,
  onDelete,
  onReorder,
  isReordering = false,
  defaultOpen = false,
}: Props) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [draftCustom, setDraftCustom] = useState<CategoryRecord[]>([]);

  const { system: systemCategory, custom: customCategories } =
    splitCategories(categories);
  const customCount = customCategories.length;

  function enterReorderMode() {
    setEditingId(null);
    setEditingName("");
    setLocalError(null);
    setDraftCustom(customCategories);
    setIsReorderMode(true);
  }

  function cancelReorderMode() {
    setIsReorderMode(false);
    setDraftCustom([]);
  }

  async function finishReorderMode() {
    setLocalError(null);
    try {
      await onReorder(draftCustom.map((c) => c.id));
      setIsReorderMode(false);
    } catch {
      // useCategories の error を表示
    }
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);

    const trimmed = newName.trim();
    if (!trimmed) {
      setLocalError("カテゴリ名を入力してください");
      return;
    }
    if (trimmed === DEFAULT_CATEGORY_NAME) {
      setLocalError(`「${DEFAULT_CATEGORY_NAME}」は予約されています`);
      return;
    }
    if (categories.some((c) => c.name === trimmed)) {
      setLocalError("同じ名前のカテゴリがあります");
      return;
    }

    setIsAdding(true);
    try {
      await onAdd(trimmed);
      setNewName("");
    } catch {
      // useCategories の error を表示
    } finally {
      setIsAdding(false);
    }
  }

  function startEdit(category: CategoryRecord) {
    setEditingId(category.id);
    setEditingName(category.name);
    setLocalError(null);
  }

  async function handleSaveEdit(category: CategoryRecord) {
    setLocalError(null);
    const trimmed = editingName.trim();
    if (!trimmed) {
      setLocalError("カテゴリ名を入力してください");
      return;
    }
    if (
      trimmed !== category.name &&
      categories.some((c) => c.id !== category.id && c.name === trimmed)
    ) {
      setLocalError("同じ名前のカテゴリがあります");
      return;
    }

    try {
      await onEdit(category.id, trimmed);
      setEditingId(null);
      setEditingName("");
    } catch {
      // useCategories の error を表示
    }
  }

  async function handleDelete(category: CategoryRecord) {
    if (category.is_system) return;

    const confirmed = window.confirm(
      `「${category.name}」を削除しますか？\nこのカテゴリの支出は「${DEFAULT_CATEGORY_NAME}」に移されます。`,
    );
    if (!confirmed) return;

    try {
      await onDelete(category.id);
    } catch {
      // useCategories の error を表示
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className={`flex w-full items-center justify-between gap-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
          isOpen ? "px-4 py-2.5" : "px-4 py-3.5"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            カテゴリ設定
          </h2>
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {customCount + 1}件
          </span>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          {isOpen ? (
            <span>閉じる</span>
          ) : (
            <span className="hidden sm:inline">開く</span>
          )}
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            aria-hidden
          >
            {isOpen ? "−" : "+"}
          </span>
        </span>
      </button>

      {isOpen ? (
        <div className="border-t border-slate-100 px-4 pb-4 dark:border-slate-800">
          {isReorderMode ? (
            <div className="space-y-2.5 pt-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  並び替え
                </p>
                <button
                  type="button"
                  onClick={cancelReorderMode}
                  disabled={isReordering}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  やめる
                </button>
              </div>
              {systemCategory ? (
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/30">
                  <span className="text-xs text-slate-400">固定</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    {systemCategory.name}
                  </span>
                </div>
              ) : null}
              <CategoryReorderList
                categories={draftCustom}
                disabled={disabled || isReordering}
                onChange={setDraftCustom}
              />
              <button
                type="button"
                onClick={() => finishReorderMode()}
                disabled={disabled || isReordering}
                className="w-full rounded-lg bg-sky-600 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
              >
                {isReordering ? "保存中…" : "並び替えを保存"}
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 pt-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  「{DEFAULT_CATEGORY_NAME}」は変更不可
                </p>
                <button
                  type="button"
                  onClick={enterReorderMode}
                  disabled={disabled || customCount === 0}
                  className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50 disabled:opacity-50 dark:text-sky-300 dark:hover:bg-sky-950/60"
                >
                  並び替え
                </button>
              </div>

              <ul className="space-y-1.5">
                {categories.map((category) => {
                  const isEditing = editingId === category.id;
                  const isSaving = savingId === category.id;
                  const isDeleting = deletingId === category.id;

                  return (
                    <li
                      key={category.id}
                      className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/40"
                    >
                      {isEditing ? (
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <input
                            type="text"
                            maxLength={MAX_CATEGORY_NAME_LENGTH}
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className={`${inputClassName} flex-1`}
                            disabled={isSaving}
                          />
                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(category)}
                              disabled={isSaving}
                              className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
                            >
                              {isSaving ? "保存中…" : "保存"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setEditingName("");
                              }}
                              disabled={isSaving}
                              className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                              やめる
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                            {category.name}
                            {category.is_system ? (
                              <span className="ml-1.5 text-xs font-normal text-slate-400">
                                固定
                              </span>
                            ) : null}
                          </span>
                          <div className="flex shrink-0 gap-0.5">
                            {!category.is_system ? (
                              <button
                                type="button"
                                onClick={() => startEdit(category)}
                                disabled={disabled || isDeleting}
                                className="rounded-md px-2 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50 disabled:opacity-50 dark:text-sky-300 dark:hover:bg-sky-950/60"
                              >
                                編集
                              </button>
                            ) : null}
                            {!category.is_system ? (
                              <button
                                type="button"
                                onClick={() => handleDelete(category)}
                                disabled={disabled || isDeleting}
                                className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/70"
                              >
                                {isDeleting ? "削除中…" : "削除"}
                              </button>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <form
                onSubmit={handleAdd}
                className="flex flex-col gap-2 sm:flex-row sm:items-center"
              >
                <input
                  type="text"
                  maxLength={MAX_CATEGORY_NAME_LENGTH}
                  placeholder="新しいカテゴリ名"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  disabled={disabled || isAdding}
                  className={`${inputClassName} flex-1`}
                />
                <button
                  type="submit"
                  disabled={disabled || isAdding}
                  className="shrink-0 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50 sm:py-2"
                >
                  {isAdding ? "追加中…" : "追加"}
                </button>
              </form>

              {localError ? (
                <p
                  className="text-xs text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {localError}
                </p>
              ) : null}

              <p className="text-[11px] leading-snug text-slate-400 dark:text-slate-500">
                削除したカテゴリの支出は「{DEFAULT_CATEGORY_NAME}」へ。並び替えは支出入力の一覧にも反映されます。
              </p>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
