"use client";

import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { AppBottomNav } from "@/components/app-bottom-nav";
import { KakeiboDataProvider } from "@/contexts/kakeibo-data-context";
import { useAuth } from "@/hooks/use-auth";

function AppBottomNavFallback() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 h-16 border-t border-slate-200/90 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95"
      aria-hidden
    />
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-sky-700 dark:text-sky-200">
        読み込み中…
      </p>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <KakeiboDataProvider>
      {children}
      <Suspense fallback={<AppBottomNavFallback />}>
        <AppBottomNav />
      </Suspense>
    </KakeiboDataProvider>
  );
}
