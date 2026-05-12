// app/stocks/page.tsx
import Link from "next/link";
import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import StocksScreener from "@/Components/StocksScreener";

export default async function StocksPage() {
  const { data: companies, error } = await supabase
    .from("companies")
    .select("*")
    .order("market_cap", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <p className="text-red-400">Error loading stocks: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-5 border-b border-gray-800 shrink-0">
        <p className="text-xs text-gray-600 font-mono uppercase tracking-widest mb-1">
          KSE-100 Listed Companies
        </p>
        <h1 className="text-3xl font-bold text-white">Stock Screener</h1>
      </div>

      {/* SCREENER */}
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={
          <div className="p-8 text-gray-600 font-mono text-sm">Loading screener...</div>
        }>
          <StocksScreener companies={companies ?? []} />
        </Suspense>
      </div>
    </main>
  );
}
