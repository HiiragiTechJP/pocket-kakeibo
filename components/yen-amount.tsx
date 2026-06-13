import { formatYenNumber } from "@/lib/format";

type Props = {
  amount: number;
  className?: string;
};

/** 画面上の金額表示（記号・マイナス・数字の間隔を調整） */
export function YenAmount({ amount, className = "" }: Props) {
  const isNegative = amount < 0;
  const number = formatYenNumber(amount);

  return (
    <span
      className={`inline-flex items-baseline tabular-nums tracking-tight ${className}`}
    >
      <span className="mr-1">￥</span>
      <span className="inline-flex items-baseline">
        {isNegative ? <span className="mr-px">-</span> : null}
        <span>{number}</span>
      </span>
    </span>
  );
}
