export function formatYenNumber(amount: number): string {
  return new Intl.NumberFormat("ja-JP").format(Math.abs(amount));
}

/** 確認ダイアログなど文字列向け（マイナスは ￥ -15,069） */
export function formatYen(amount: number): string {
  const number = formatYenNumber(amount);
  if (amount < 0) return `￥ -${number}`;
  return `￥${number}`;
}

export function formatDateJa(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  return `${y}年${m}月${d}日`;
}

export function formatMonthJa(isoMonth: string): string {
  const [y, m] = isoMonth.split("-").map(Number);
  if (!y || !m) return isoMonth;
  return `${y}年${m}月`;
}

export function todayIsoMonth(): string {
  return todayIsoDate().slice(0, 7);
}

export function isDateInMonth(isoDate: string, isoMonth: string): boolean {
  return isoDate.startsWith(`${isoMonth}-`);
}

export function shiftIsoMonth(isoMonth: string, diff: number): string {
  const [year, month] = isoMonth.split("-").map(Number);
  if (!year || !month) return isoMonth;

  const shifted = new Date(year, month - 1 + diff, 1);
  const nextYear = shifted.getFullYear();
  const nextMonth = String(shifted.getMonth() + 1).padStart(2, "0");
  return `${nextYear}-${nextMonth}`;
}

export function getMonthDefaultDate(isoMonth: string): string {
  const [year, month] = isoMonth.split("-").map(Number);
  if (!year || !month) return todayIsoDate();

  const now = new Date();
  const isCurrentMonth =
    now.getFullYear() === year && now.getMonth() + 1 === month;
  const targetDay = isCurrentMonth ? now.getDate() : 1;
  const lastDay = new Date(year, month, 0).getDate();
  const day = String(Math.min(targetDay, lastDay)).padStart(2, "0");

  return `${isoMonth}-${day}`;
}

export function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
