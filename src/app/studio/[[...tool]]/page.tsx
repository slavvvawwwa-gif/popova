/**
 * Embedded Sanity Studio, served at /studio.
 * Route is outside the [locale] segment and excluded from the i18n proxy.
 * The Studio itself is loaded client-only (see StudioClient).
 */
import type { Metadata, Viewport } from "next";
import StudioClient from "./StudioClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  return <StudioClient />;
}
