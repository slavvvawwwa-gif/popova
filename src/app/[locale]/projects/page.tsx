import type { Metadata } from "next";
import { getPerformances, type Locale } from "@/sanity/lib/data";
import { pageAlternates } from "@/lib/seo";
import WorksView from "../works/WorksView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === "en";
  return {
    title: en ? "Projects" : "Проекты",
    description: en
      ? "Theatre projects by director Varvara Popova."
      : "Театральные проекты режиссёра Варвары Поповой.",
    alternates: pageAlternates(locale, "/projects"),
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const works = await getPerformances(locale as Locale, "project");
  return <WorksView works={works} section="projects" />;
}
