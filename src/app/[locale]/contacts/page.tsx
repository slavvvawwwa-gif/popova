import type { Metadata } from "next";
import { getContacts, getBio, type Locale } from "@/sanity/lib/data";
import ContactsView from "./ContactsView";

export const metadata: Metadata = { title: "Контакты" };

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [data, bio] = await Promise.all([getContacts(), getBio(locale as Locale)]);
  return <ContactsView data={data} cvRu={bio.cvRu} cvEn={bio.cvEn} />;
}
