export function getIncomeLabel(memo: string | null): string {
  const trimmed = memo?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "収入";
}
