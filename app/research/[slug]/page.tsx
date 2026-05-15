// app/research/[slug]/page.tsx
// Dynamic research report renderer — database-driven.
// Fetches report by slug, renders via ReportLayout.
// Zero hardcoded content — all data lives in research_reports table.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getReportBySlug } from "@/services/api";
import ReportLayout from "@/components/research/ReportLayout";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const report = await getReportBySlug(slug);
  if (!report) return { title: "Report Not Found | AHM Research" };

  return {
    title:       report.seo_title    ?? `${report.title} | AHM Research`,
    description: report.seo_description ?? report.summary ?? undefined,
    openGraph: {
      title:       report.seo_title ?? report.title,
      description: report.seo_description ?? report.summary ?? undefined,
      type:        "article",
      publishedTime: report.published_at ?? undefined,
      authors:     [report.author],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ResearchReportPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const report = await getReportBySlug(slug);
  if (!report) notFound();

  return <ReportLayout report={report} />;
}
