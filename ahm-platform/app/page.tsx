import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: companies, error } = await supabase
    .from("companies")
    .select("*");

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-10">
        AHM Investor Intelligence
      </h1>

      <div className="space-y-4">
        {companies?.map((company) => (
          <div
            key={company.id}
            className="border border-gray-700 p-5 rounded-xl"
          >
            <h2 className="text-2xl font-semibold">
              {company.symbol}
            </h2>

            <p className="text-gray-400">
              {company.company_name}
            </p>

            <p className="text-sm text-green-400">
              {company.sector}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}