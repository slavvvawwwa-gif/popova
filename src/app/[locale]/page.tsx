import { getHome, getFeaturedPerformances, type Locale } from "@/sanity/lib/data";
import HomeView from "./HomeView";

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
