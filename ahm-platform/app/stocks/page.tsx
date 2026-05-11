import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function StocksPage() {
  const { data: companies, error } = await supabase
    .from("companies")
    .select("*");

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Error loading stocks: {error.message}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-10">PSX Stocks</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies?.map((company) => (
          <Link
            key={company.id}
            href={`/stocks/${company.symbol}`}
            className="border border-gray-700 rounded-2xl p-6 bg-gray-900 block hover:border-green-400 transition"
          >
            <h2 className="text-3xl font-bold mb-2">
              {company.symbol}
            </h2>

            <p className="text-gray-300 text-lg">
              {company.company_name}
            </p>

            <p className="text-green-400 mt-3">
              {company.sector}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}