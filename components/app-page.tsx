import { AppErrorBanner } from "@/components/app-error-banner";
import { appPageClassName } from "@/lib/ui";

export function AppPage({ children }: { children: React.ReactNode }) {
  return (
    <main className={appPageClassName}>
      <AppErrorBanner />
      {children}
    </main>
  );
}
