import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/ui/SectionTitle";

const FEATURED_NOTES = [
  {
    ticker: "HUBC",
    company: "Hub Power Company Limited",
    sector: "Power / IPP",
    rating: "BUY",
    target: 182,
    date: "May 2025",
    excerpt: "Capacity payment security + 10%+ dividend yield make HUBC the standout value play in PSX Power. We initiate with BUY and PKR 182 target.",
    href: "/research/hubc",
  },
];

const CATEGORIES = [
  {
    label: "Macro",
    title: "Pakistan Macro Outlook",
    desc: "Interest rates, inflation, currency, current account, and fiscal position.",
    status: "Coming soon",
  },
  {
    label: "Sector Reports",
    title: "Sector Deep Dives",
    desc: "Quarterly sector-level analysis — drivers, risks, and key stock calls.",
    status: "Coming soon",
  },
  {
    label: "Earnings",
    title: "Earnings Calendar",
    desc: "Upcoming result dates, consensus estimates, and post-result commentary.",
    status: "Coming soon",
  },
];

const RATING_STYLES: Record<string, string> = {
  BUY:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  HOLD: "bg-amber-500/15  text-amber-400  border-amber-500/30",
  SELL: "bg-red-500/15    text-red-400    border-red-500/30",
};

export default function ResearchPage() {
  return (
    <main className="flex-1 bg-black text-white">
      <div className="border-b border-gray-800 py-10">
        <PageContainer>
          <SectionTitle
            eyebrow="Research"
            title="AHM Research"
            subtitle="Macro analysis, sector reports, stock coverage, and earnings intelligence."
          />
        </PageContainer>
      </div>

      <PageContainer className="py-10">
        <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-4">
          Stock Coverage
        </p>
        <div className="space-y-3 mb-12">
          {FEATURED_NOTES.map((note) => (
            <Link
              key={note.ticker}
              href={note.href}
              className="group flex items-start justify-between gap-6 bg-gray-950 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border uppercase tracking-widest ${RATING_STYLES[note.rating]}`}>
                    {note.rating}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">{note.ticker}</span>
                  <span className="text-xs text-gray-600 font-mono">{note.sector}</span>
                  <span className="text-xs text-gray-700 font-mono ml-auto">{note.date}</span>
                </div>
                <h2 className="text-base font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                  {note.company}
                </h2>
                <p className="text-gray-500 text-xs leading-relaxed max-w-xl">{note.excerpt}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-1">Target</p>
                <p className="text-lg font-bold text-emerald-400 tabular-nums">PKR {note.target}</p>
                <p className="text-xs text-gray-700 font-mono mt-0.5 group-hover:text-gray-500 transition-colors">Read note →</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-4">
          More Research
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.map((c) => (
            <div key={c.title} className="bg-gray-950 border border-gray-800 rounded-xl p-6">
              <p className="text-xs font-mono text-amber-500/60 uppercase tracking-widest mb-2">
                {c.label}
              </p>
              <h2 className="text-base font-bold text-white mb-2">{c.title}</h2>
              <p className="text-gray-500 text-xs leading-relaxed mb-4">{c.desc}</p>
              <span className="text-xs font-mono text-gray-700 bg-gray-900 border border-gray-800 px-2 py-1 rounded">
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </PageContainer>
    </main>
  );
}
