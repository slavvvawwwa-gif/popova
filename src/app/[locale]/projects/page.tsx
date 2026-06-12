import type { Metadata } from "next";
import { getPerformances, type Locale } from "@/sanity/lib/data";
import WorksView from "../works/WorksView";

export const metadata: Metadata = { title: "Проекты" };

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const works = await getPerformances(locale as Locale, "project");
  return <WorksView works={works} section="projects" />;
}
