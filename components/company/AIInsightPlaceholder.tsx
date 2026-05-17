// components/company/AIInsightPlaceholder.tsx
//
// Structural placeholder for future AI-powered company intelligence.
// Does NOT generate AI content — purely architectural scaffolding.
// Reusable across all company intelligence pages.

import { SectionLabel } from "./InvestmentThesis";

type AIInsightPlaceholderProps = {
  symbol:      string;
  companyName: string;
};

const FUTURE_CAPABILITIES = [
  { icon: "🧠", label: "Earnings summary",    desc: "Auto-generated quarterly digest" },
  { icon: "📊", label: "Anomaly detection",   desc: "Flag unusual financial trends" },
  { icon: "💬", label: "Ask about " ,         desc: "Natural language Q&A" },
  { icon: "📰", label: "News synthesis",       desc: "Summarise relevant market news" },
];

export default function AIInsightPlaceholder({ symbol, companyName }: AIInsightPlaceholderProps) {
  return (
    <section>
      <SectionLabel>AI Intelligence Layer</SectionLabel>
      <div className="bg-surface border border-border-theme rounded-xl overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-border-theme bg-raised flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">✦</span>
            <p className="text-sm font-semibold text-tx-primary">AHM Intelligence — {symbol}</p>
          </div>
          <span className="text-xs font-mono text-tx-disabled bg-surface border border-border-theme px-2 py-0.5 rounded">
            Coming Soon
          </span>
        </div>

        {/* Placeholder body */}
        <div className="p-5">
          <p className="text-sm text-tx-disabled leading-relaxed mb-5">
            AI-powered analysis of {companyName} — synthesising earnings data, filings,
            sector context, and macro signals into actionable intelligence — is in development.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FUTURE_CAPABILITIES.map((cap) => (
              <div
                key={cap.label}
                className="bg-raised border border-border-theme rounded-lg p-3 opacity-50"
              >
                <span className="text-lg mb-2 block">{cap.icon}</span>
                <p className="text-xs font-semibold text-tx-secondary mb-0.5">
                  {cap.label}{cap.label === "Ask about " ? symbol : ""}
                </p>
                <p className="text-xs text-tx-disabled">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
