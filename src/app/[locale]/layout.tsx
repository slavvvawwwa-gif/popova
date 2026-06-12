import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Navigation from "@/components/Navigation";
import { CursorPreviewProvider } from "@/components/CursorPreview";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Театральный режиссёр",
    template: "%s — Театральный режиссёр",
  },
  description: "Персональный сайт театрального режиссёра. Спектакли, биография, афиша, пресса.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    alternateLocale: "en_US",
  },
};

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

  return (
    <html lang={locale} className="h-full">
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <CursorPreviewProvider>
            <Navigation locale={locale} />
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
