import type { Metadata } from "next";
import { getPerformances, type Locale } from "@/sanity/lib/data";
import WorksView from "../works/WorksView";

export const metadata: Metadata = { title: "Лаборатория" };

export default async function LabPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const works = await getPerformances(locale as Locale, "lab");
  return <WorksView works={works} section="lab" />;
}
