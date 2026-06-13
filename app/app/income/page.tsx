import { Suspense } from "react";
import { IncomePage } from "@/components/income-page";
import { PageLoading } from "@/components/page-loading";

export default function IncomeRoutePage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <IncomePage />
    </Suspense>
  );
}
