import type { Metadata } from "next";
import { getContacts, getBio, type Locale } from "@/sanity/lib/data";
import { pageAlternates } from "@/lib/seo";
import ContactsView from "./ContactsView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === "en";
  return {
    title: en ? "Contacts" : "Контакты",
    description: en ? "Get in touch with Varvara Popova." : "Контакты Варвары Поповой.",
    alternates: pageAlternates(locale, "/contacts"),
  };
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [data, bio] = await Promise.all([getContacts(), getBio(locale as Locale)]);
  return <ContactsView data={data} cvRu={bio.cvRu} cvEn={bio.cvEn} />;
}
