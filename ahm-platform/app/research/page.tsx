import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/ui/SectionTitle";

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
    label: "Stock Coverage",
    title: "AHM Stock Notes",
    desc: "Individual company coverage with thesis, valuation, and price targets.",
    status: "Coming soon",
  },
  {
    label: "Earnings",
    title: "Earnings Calendar",
    desc: "Upcoming result dates, consensus estimates, and post-result commentary.",
    status: "Coming soon",
  },
];

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORIES.map((c) => (
            <div
              key={c.title}
              className="bg-gray-950 border border-gray-800 rounded-xl p-6"
            >
              <p className="text-xs font-mono text-amber-500/60 uppercase tracking-widest mb-2">
                {c.label}
              </p>
              <h2 className="text-lg font-bold text-white mb-2">{c.title}</h2>
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
