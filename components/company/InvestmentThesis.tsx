// components/company/InvestmentThesis.tsx
//
// Structured investment thesis — company positioning, key themes, summary.
// Reusable across all company intelligence pages.

import type { ReactNode } from "react";

export type ThesisTheme = {
  icon:        string;
  title:       string;
  body:        string;
};

type InvestmentThesisProps = {
  summary:     string;
  themes:      ThesisTheme[];
  accentColor?: string;
};

export default function InvestmentThesis({
  summary,
  themes,
  accentColor = "#3b82f6",
}: InvestmentThesisProps) {
  return (
    <section>
      <SectionLabel>Investment Thesis</SectionLabel>

      {/* Summary paragraph */}
      <div
        className="rounded-xl border p-6 mb-4"
        style={{ backgroundColor: accentColor + "08", borderColor: accentColor + "30" }}
      >
        <p
          className="text-sm leading-relaxed font-medium"
          style={{ color: accentColor + "cc" }}
        >
          {summary}
        </p>
      </div>

      {/* Theme grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {themes.map((theme) => (
          <div
            key={theme.title}
            className="bg-surface border border-border-theme rounded-xl p-5 hover:border-tx-secondary transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">{theme.icon}</span>
              <div>
                <p className="text-sm font-semibold text-tx-primary mb-1.5">{theme.title}</p>
                <p className="text-xs text-tx-secondary leading-relaxed">{theme.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}
