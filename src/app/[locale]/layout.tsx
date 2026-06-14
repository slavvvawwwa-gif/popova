import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Navigation from "@/components/Navigation";
import { CursorPreviewProvider } from "@/components/CursorPreview";
import BackToTop from "@/components/BackToTop";
import { SITE_URL } from "@/lib/seo";
import "../globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const name = locale === "en" ? "Varvara Popova" : "Варвара Попова";
  return {
    title: {
      default: name,
      template: `%s — ${name}`,
    },
    description:
      locale === "en"
        ? "Theatre director — personal site. Works, biography, contacts."
        : "Персональный сайт театрального режиссёра. Спектакли, биография, контакты.",
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "ru_RU",
      alternateLocale: locale === "en" ? "ru_RU" : "en_US",
      title: name,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();

  const en = locale === "en";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: en ? "Varvara Popova" : "Варвара Попова",
    jobTitle: en ? "Theatre Director" : "Театральный режиссёр",
    url: `${SITE_URL}/${locale}`,
  };

  return (
    <html lang={locale} className="h-full">
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <CursorPreviewProvider>
            <Navigation locale={locale} />
            <BackToTop />
            <main className="flex-1">{children}</main>
            <footer
            style={{
              borderTop: "1px solid rgba(237,237,237,0.08)",
              padding: "2rem 0",
              textAlign: "center",
              color: "var(--text-secondary)",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
            }}
          >
              © {new Date().getFullYear()}
            </footer>
          </CursorPreviewProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
