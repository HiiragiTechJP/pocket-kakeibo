"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import type { CategoryRecord } from "@/lib/types";

type Props = {
  categories: CategoryRecord[];
  disabled?: boolean;
  onChange: (ordered: CategoryRecord[]) => void;
};

function SortableRow({ category }: { category: CategoryRecord }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/40 ${
        isDragging ? "z-10 opacity-90 shadow-lg ring-2 ring-sky-400" : ""
      }`}
    >
      <button
        type="button"
        className="flex h-8 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-slate-400 active:cursor-grabbing hover:bg-slate-200/80 dark:hover:bg-slate-700"
        aria-label={`${category.name} をドラッグして並び替え`}
        {...attributes}
        {...listeners}
      >
        <span className="text-base leading-none" aria-hidden>
          ≡
        </span>
      </button>
      <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
        {category.name}
      </span>
    </li>
  );
}

export function CategoryReorderList({
  categories,
  disabled = false,
  onChange,
}: Props) {
  const [items, setItems] = useState(categories);

  useEffect(() => {
    setItems(categories);
  }, [categories]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    if (disabled) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id);
      const newIndex = prev.findIndex((c) => c.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      const next = arrayMove(prev, oldIndex, newIndex);
      onChange(next);
      return next;
    });
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        並び替えできるカテゴリがありません。先にカテゴリを追加してください。
      </p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-1.5">
          {items.map((category) => (
            <SortableRow key={category.id} category={category} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
