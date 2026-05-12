import PageContainer from "@/Components/layout/PageContainer";
import SectionTitle from "@/Components/ui/SectionTitle";

const TOPICS = [
  {
    number: "01",
    title: "PSX Basics",
    desc: "How the Pakistan Stock Exchange works — market structure, trading hours, settlement, and indices.",
  },
  {
    number: "02",
    title: "Reading Financial Statements",
    desc: "Income statement, balance sheet, and cash flow — what to look for in Pakistani company accounts.",
  },
  {
    number: "03",
    title: "Sector Analysis",
    desc: "How to analyse individual sectors — key drivers, cost structures, regulatory environment, and cycle positioning.",
  },
  {
    number: "04",
    title: "Valuation Methods",
    desc: "P/E, P/B, DCF, and dividend yield — how to value PSX stocks using fundamental analysis.",
  },
  {
    number: "05",
    title: "Reading the Screener",
    desc: "How to use the AHM Stock Screener to filter, rank, and shortlist investment ideas.",
  },
  {
    number: "06",
    title: "Understanding Dividends",
    desc: "Dividend policy, payout ratios, book closure dates, and how to evaluate dividend yield on PSX.",
  },
];

export default function LearnPage() {
  return (
    <main className="flex-1 bg-black text-white">
      <div className="border-b border-gray-800 py-10">
        <PageContainer>
          <SectionTitle
            eyebrow="Learning Center"
            title="Learn to Invest on PSX"
            subtitle="Foundational guides for understanding the Pakistan Stock Exchange and building an investment framework."
          />
        </PageContainer>
      </div>

      <PageContainer className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map((t) => (
            <div
              key={t.number}
              className="bg-gray-950 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
            >
              <p className="text-xs font-mono text-gray-700 mb-3">{t.number}</p>
              <h2 className="text-base font-bold text-white mb-2">{t.title}</h2>
              <p className="text-gray-500 text-xs leading-relaxed">{t.desc}</p>
              <p className="text-xs font-mono text-gray-700 mt-4">Coming soon</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </main>
  );
}
