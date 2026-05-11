import Link from "next/link";
import { supabase } from "@/lib/supabase";
import StockCard from "@/components/StockCard";

export default async function StocksPage() {
  const { data: companies, error } = await supabase
    .from("companies")
    .select("*");

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <p className="text-red-400">Error loading stocks: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
          Home
        </Link>
        <Link href="/sectors" className="text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">
          Sector Intelligence
        </Link>
      </div>

      <div className="px-8 pt-10 pb-6 border-b border-gray-800">
        <p className="text-xs text-gray-600 font-mono uppercase tracking-widest mb-2">PSX Listed Companies</p>
        <h1 className="text-4xl font-bold text-white">Stocks</h1>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies?.map((company) => (
            <StockCard key={company.id} company={company} />
          ))}
        </div>
      </div>
    </main>
  );
}
