import type { Metadata } from "next";
import { getBio, type Locale } from "@/sanity/lib/data";
import AboutView from "./AboutView";

export const metadata: Metadata = { title: "О режиссёре" };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const bio = await getBio(locale as Locale);
  return <AboutView bio={bio} />;
}
