import { supabase } from "@/lib/supabase";

export default async function StockPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("symbol", symbol.toUpperCase())
    .single();

  if (!company) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Company not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-6xl font-bold mb-4">{company.symbol}</h1>

      <p className="text-3xl text-gray-300 mb-6">
        {company.company_name}
      </p>

      <div className="border border-gray-700 rounded-2xl p-6 bg-gray-900 max-w-xl">
        <p className="text-green-400 text-xl">
          Sector: {company.sector}
        </p>

        <p className="text-yellow-400 text-xl mt-4">
          Market Cap: {company.market_cap}
        </p>
      </div>
    </main>
  );
}