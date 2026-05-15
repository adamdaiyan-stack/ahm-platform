// app/learn/[slug]/page.tsx
// Dynamic article renderer for the AHM Learning Center.
// Content is sourced from constants/learn.ts — no DB required until ~20+ articles.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import { Breadcrumb } from "@/components/ui";
import { getArticleBySlug, LEARN_ARTICLES } from "@/constants/learn";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return LEARN_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found | AHM Learn" };
  return {
    title: `${article.title} | AHM Learning Center`,
    description: article.desc,
  };
}

export default async function LearnArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const breadcrumbs = [
    { label: "Home",   href: "/" },
    { label: "Learn",  href: "/learn" },
    { label: article.title },
  ];

  return (
    <main className="flex-1 bg-base text-tx-primary">

      {/* ── Header ── */}
      <div className="border-b border-border-theme py-10">
        <PageContainer>
          <Breadcrumb items={breadcrumbs} className="mb-4" />
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-mono text-tx-disabled bg-raised border border-border-theme px-2.5 py-1 rounded uppercase tracking-widest">
              Guide {article.number}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-tx-primary mb-3">{article.title}</h1>
          <p className="text-tx-secondary text-sm leading-relaxed max-w-2xl">{article.desc}</p>
        </PageContainer>
      </div>

      <PageContainer className="py-10 max-w-3xl">

        {/* ── Overview ── */}
        <section className="mb-10">
          <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-3">Overview</p>
          <p className="text-tx-primary leading-relaxed">{article.overview}</p>
        </section>

        {/* ── Why It Matters ── */}
        <section className="mb-10 bg-surface border border-border-theme rounded-xl p-6">
          <p className="text-xs font-mono text-amber-500/70 uppercase tracking-widest mb-2">Why It Matters</p>
          <p className="text-tx-primary leading-relaxed">{article.whyItMatters}</p>
        </section>

        {/* ── Key Terms ── */}
        <section className="mb-10">
          <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4">Key Terms</p>
          <div className="divide-y divide-border-theme border border-border-theme rounded-xl overflow-hidden">
            {article.keyTerms.map((kt) => (
              <div key={kt.term} className="flex gap-4 bg-surface px-5 py-4">
                <span className="text-sm font-mono font-bold text-tx-primary shrink-0 w-40">{kt.term}</span>
                <span className="text-sm text-tx-secondary leading-relaxed">{kt.definition}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Example ── */}
        <section className="mb-10">
          <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-3">Worked Example</p>
          <div className="bg-raised border-l-2 border-gain rounded-r-xl px-6 py-5">
            <p className="text-tx-primary text-sm leading-relaxed">{article.example}</p>
          </div>
        </section>

        {/* ── Common Mistakes ── */}
        <section className="mb-10">
          <p className="text-xs font-mono text-tx-disabled uppercase tracking-widest mb-4">Common Mistakes</p>
          <ul className="space-y-3">
            {article.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="text-loss text-sm mt-0.5 shrink-0">✕</span>
                <p className="text-tx-secondary text-sm leading-relaxed">{mistake}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Takeaway ── */}
        <section className="mb-10 bg-gain/10 border border-gain/20 rounded-xl px-6 py-5">
          <p className="text-xs font-mono text-gain/70 uppercase tracking-widest mb-2">Key Takeaway</p>
          <p className="text-tx-primary font-medium leading-relaxed">{article.takeaway}</p>
        </section>

        {/* ── Disclaimer ── */}
        <p className="text-xs text-tx-disabled leading-relaxed border-t border-border-theme pt-6 mb-10">
          This guide is for educational purposes only and does not constitute investment advice. Always conduct your
          own research or consult a licensed investment advisor before making investment decisions.
        </p>

        {/* ── Back link ── */}
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-sm font-mono text-tx-secondary hover:text-tx-primary transition-colors"
        >
          ← Back to Learning Center
        </Link>

      </PageContainer>
    </main>
  );
}
