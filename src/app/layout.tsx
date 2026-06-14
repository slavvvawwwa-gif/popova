import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Варвара Попова",
  description: "Персональный сайт театрального режиссёра Варвары Поповой",
  robots: { index: true, follow: true },
  alternates: { canonical: "/ru" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
