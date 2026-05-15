// app/learn/page.tsx
// Learning Center index — links to individual beginner guides.
// All colors use design tokens so the page responds to the theme system.

import Link from "next/link";
import type { Metadata } from "next";
import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/ui/SectionTitle";
import { LEARN_ARTICLES } from "@/constants/learn";

export const metadata: Metadata = {
  title: "Learning Center | AHM Securities",
  description: "Foundational guides for understanding the Pakistan Stock Exchange and building an investment framework.",
};

export default function LearnPage() {
  return (
    <main className="flex-1 bg-base text-tx-primary">
      <div className="border-b border-border-theme py-10">
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
          {LEARN_ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/learn/${article.slug}`}
              className="group flex flex-col bg-surface border border-border-theme rounded-xl p-6 hover:border-tx-secondary transition-all"
            >
              <p className="text-xs font-mono text-tx-disabled mb-3">{article.number}</p>
              <h2 className="text-base font-bold text-tx-primary mb-2 group-hover:text-gain transition-colors">
                {article.title}
              </h2>
              <p className="text-tx-secondary text-xs leading-relaxed flex-1">{article.desc}</p>
              <p className="text-xs font-mono text-tx-disabled mt-4 group-hover:text-tx-secondary transition-colors">
                Read guide →
              </p>
            </Link>
          ))}
        </div>
      </PageContainer>
    </main>
  );
}
