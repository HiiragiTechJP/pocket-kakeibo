type IconProps = {
  className?: string;
};

const baseProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true as const,
};

export function TabHomeIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path
        d="M5 10.5 12 4.5l7 6V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5H9V20.5H6.5A1.5 1.5 0 0 1 5 19v-8.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TabIncomeIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path
        d="M12 5v7.5M8.75 9.25 12 12.5l3.25-3.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 17.5h11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M8.5 17.5v-1.25c0-.69.56-1.25 1.25-1.25h4.5c.69 0 1.25.56 1.25 1.25v1.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TabChartsIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path
        d="M6 18.5V14M10 18.5V9.5M14 18.5V6M18 18.5V11.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M5 19.5h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TabSettingsIcon({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path
        d="M10.35 4.32c.43-1.76 2.92-1.76 3.35 0a1.72 1.72 0 0 0 2.57 1.07c1.54-.94 3.31.83 2.37 2.37a1.72 1.72 0 0 0 1.07 2.57c1.76.43 1.76 2.92 0 3.35a1.72 1.72 0 0 0-1.07 2.57c.94 1.54-.83 3.31-2.37 2.37a1.72 1.72 0 0 0-2.57 1.07c-.43 1.76-2.92 1.76-3.35 0a1.72 1.72 0 0 0-2.57-1.07c-1.54.94-3.31-.83-2.37-2.37a1.72 1.72 0 0 0-1.07-2.57c-1.76-.43-1.76-2.92 0-3.35a1.72 1.72 0 0 0 1.07-2.57c-.94-1.54.83-3.31 2.37-2.37a1.72 1.72 0 0 0 2.57-1.07Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.75"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

export type TabIconId = "home" | "income" | "charts" | "settings";

const iconMap = {
  home: TabHomeIcon,
  income: TabIncomeIcon,
  charts: TabChartsIcon,
  settings: TabSettingsIcon,
} as const;

export function TabIcon({
  id,
  className,
}: {
  id: TabIconId;
  className?: string;
}) {
  const Icon = iconMap[id];
  return <Icon className={className} />;
}
