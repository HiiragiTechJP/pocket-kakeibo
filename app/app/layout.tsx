import { SiteHeader } from "@/components/site-header";
import { AppShell } from "@/components/app-shell";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader />
      <AppShell>
        <div className="flex flex-1 flex-col bg-gradient-to-b from-sky-100 via-slate-50 to-white px-4 pb-24 pt-5 font-sans dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
          {children}
        </div>
      </AppShell>
    </>
  );
}
