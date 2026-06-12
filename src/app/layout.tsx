import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Портфолио режиссёра",
  description: "Персональный сайт театрального режиссёра",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
