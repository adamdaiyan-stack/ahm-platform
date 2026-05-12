import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/ui/SectionTitle";

const MODULES = [
  {
    href: "/market",
    accent: "bg-violet-500",
    border: "hover:border-violet-500/40",
    cta: "text-violet-400",
    title: "Market Dashboard",
    desc: "KSE-100 index, top gainers, losers, most active, and sector performance.",
  },
  {
    href: "/stocks",
    accent: "bg-emerald-500",
    border: "hover:border-emerald-500/40",
    cta: "text-emerald-400",
    title: "Stock Screener",
    desc: "Browse all listed companies with price, change, volume, P/E, and dividend data.",
  },
  {
    href: "/sectors",
    accent: "bg-blue-500",
    border: "hover:border-blue-500/40",
    cta: "text-blue-400",
    title: "Sector Intelligence",
    desc: "Deep-dive modules for Banking, Auto, Cement, Fertiliser, Oil & Gas, Power, and Textiles.",
  },
  {
    href: "/research",
    accent: "bg-amber-500",
    border: "hover:border-amber-500/40",
    cta: "text-amber-400",
    title: "Research",
    desc: "Macro analysis, sector reports, earnings calendar, and AHM analyst coverage.",
  },
  {
    href: "/learn",
    accent: "bg-gray-400",
    border: "hover:border-gray-500/40",
    cta: "text-gray-300",
    title: "Learn",
    desc: "PSX basics, reading financial statements, sector analysis, and valuation methods.",
  },
];

export default function Home() {
  return (
    <main className="flex-1 bg-black text-white">
      <div className="border-b border-gray-800 py-16">
        <PageContainer>
          <SectionTitle
            eyebrow="AHM Platform"
            title="PSX Investor Intelligence"
            subtitle="Pakistan Stock Exchange — market dashboard, company data, sector analysis, and investor intelligence."
            size="lg"
          />
        </PageContainer>
      </div>

      <PageContainer className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`group bg-gray-950 border border-gray-800 rounded-xl p-6 ${m.border} hover:bg-gray-900 transition-all`}
            >
              <div className={`w-6 h-0.5 ${m.accent} mb-4`} />
              <h2 className="text-lg font-bold text-white mb-2">{m.title}</h2>
              <p className="text-gray-500 text-xs leading-relaxed">{m.desc}</p>
              <p className={`${m.cta} text-xs font-mono mt-4 opacity-0 group-hover:opacity-100 transition-opacity`}>
                Open &rarr;
              </p>
            </Link>
          ))}
        </div>
      </PageContainer>
    </main>
  );
}
