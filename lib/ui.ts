type Accent = "sky" | "emerald";

type Options = {
  accent?: Accent;
  size?: "sm" | "md";
  fullWidth?: boolean;
};

export function formInputClass({
  accent = "sky",
  size = "md",
  fullWidth = false,
}: Options = {}): string {
  const ring = accent === "emerald" ? "ring-emerald-500" : "ring-sky-500";
  const padding = size === "sm" ? "px-3 py-2 text-sm" : "px-3 py-2.5";
  const width = fullWidth ? "w-full" : "";

  return [
    "rounded-lg border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:ring-2",
    "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50",
    ring,
    padding,
    width,
  ]
    .filter(Boolean)
    .join(" ");
}

export const appPageClassName =
  "mx-auto flex w-full max-w-lg flex-col gap-5";

export const cardClassName =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30";
