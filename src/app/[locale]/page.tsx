import { getFeaturedPerformances, type Locale } from "@/sanity/lib/data";
import HomeView from "./HomeView";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const featured = await getFeaturedPerformances(locale as Locale);
  return <HomeView featured={featured} />;
}
