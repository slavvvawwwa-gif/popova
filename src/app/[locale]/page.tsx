import type { Metadata } from "next";
import { getHome, getFeaturedPerformances, type Locale } from "@/sanity/lib/data";
import { pageAlternates } from "@/lib/seo";
import HomeView from "./HomeView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === "en";
  return {
    title: { absolute: en ? "Varvara Popova — Theatre Director" : "Варвара Попова — театральный режиссёр" },
    description: en
      ? "Personal site of theatre director Varvara Popova: works, projects, labs, biography and contacts."
      : "Персональный сайт театрального режиссёра Варвары Поповой: спектакли, проекты, лаборатории, биография и контакты.",
    alternates: pageAlternates(locale, "/"),
    openGraph: {
      type: "website",
      title: en ? "Varvara Popova — Theatre Director" : "Варвара Попова — театральный режиссёр",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [hero, featured] = await Promise.all([
    getHome(locale as Locale),
    getFeaturedPerformances(locale as Locale),
  ]);
  return <HomeView hero={hero} featured={featured} />;
}
