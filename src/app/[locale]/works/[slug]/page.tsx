import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPerformance, type Locale } from "@/sanity/lib/data";
import WorkDetailView from "./WorkDetailView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const work = await getPerformance(slug, locale as Locale);
  if (!work) return { title: "Спектакль" };
  return {
    title: work.title,
    description: work.shortDescription || undefined,
    openGraph: {
      title: work.title,
      description: work.shortDescription || undefined,
      images: work.coverUrl ? [work.coverUrl] : undefined,
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const work = await getPerformance(slug, locale as Locale);
  if (!work) notFound();
  return <WorkDetailView work={work} />;
}
