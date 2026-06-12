import type { Metadata } from "next";
import { getPerformances, type Locale } from "@/sanity/lib/data";
import WorksView from "./WorksView";

export const metadata: Metadata = { title: "Спектакли" };

export default async function WorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const works = await getPerformances(locale as Locale, "performance");
  return <WorksView works={works} section="works" />;
}
