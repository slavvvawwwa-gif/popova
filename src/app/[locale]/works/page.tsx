import type { Metadata } from "next";
import { getPerformances, type Locale } from "@/sanity/lib/data";
import { pageAlternates } from "@/lib/seo";
import WorksView from "./WorksView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === "en";
  return {
    title: en ? "Works" : "Спектакли",
    description: en
      ? "Theatre performances directed by Varvara Popova."
      : "Спектакли в постановке театрального режиссёра Варвары Поповой.",
    alternates: pageAlternates(locale, "/works"),
  };
}

export default async function WorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const works = await getPerformances(locale as Locale, "performance");
  return <WorksView works={works} section="works" />;
}
