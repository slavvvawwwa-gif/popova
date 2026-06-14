import type { Metadata } from "next";
import { getPerformances, type Locale } from "@/sanity/lib/data";
import { pageAlternates } from "@/lib/seo";
import WorksView from "../works/WorksView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === "en";
  return {
    title: en ? "Labs" : "Лаборатории",
    description: en
      ? "Theatre labs and experimental work by Varvara Popova."
      : "Театральные лаборатории и эскизы Варвары Поповой.",
    alternates: pageAlternates(locale, "/lab"),
  };
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const works = await getPerformances(locale as Locale, "lab");
  return <WorksView works={works} section="lab" />;
}
