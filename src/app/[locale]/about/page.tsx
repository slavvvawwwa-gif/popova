import type { Metadata } from "next";
import { getBio, type Locale } from "@/sanity/lib/data";
import { pageAlternates } from "@/lib/seo";
import AboutView from "./AboutView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === "en";
  return {
    title: en ? "About" : "Обо мне",
    description: en
      ? "Theatre director Varvara Popova — biography, education and projects."
      : "Театральный режиссёр Варвара Попова — биография, образование и проекты.",
    alternates: pageAlternates(locale, "/about"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const bio = await getBio(locale as Locale);
  return <AboutView bio={bio} />;
}
