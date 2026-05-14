import { Suspense } from "react";
import { getAllCompanies } from "@/services/api/companies";
import StocksScreener from "@/components/StocksScreener";

export default async function StocksPage() {
  const companies = await getAllCompanies();

  return (
    <main className="min-h-screen bg-base text-tx-primary flex flex-col">
      <div className="px-8 pt-8 pb-5 border-b border-border-theme shrink-0">
        <p className="text-xs text-tx-disabled font-mono uppercase tracking-widest mb-1">KSE-100 Listed Companies</p>
        <h1 className="text-3xl font-bold text-tx-primary">Stock Screener</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<div className="p-8 text-tx-disabled font-mono text-sm">Loading screener…</div>}>
          <StocksScreener companies={companies ?? []} />
        </Suspense>
      </div>
    </main>
  );
}
