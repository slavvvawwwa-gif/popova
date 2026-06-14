// Canonical site URL (set NEXT_PUBLIC_SITE_URL in Vercel; falls back to the
// default deployment). Used for metadataBase, canonical URLs and the sitemap.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://popova.vercel.app"
).replace(/\/$/, "");

/** Per-page canonical + hreflang alternates (ru/en + x-default). */
export function pageAlternates(locale: string, path = "") {
  const p = path === "/" ? "" : path;
  return {
    canonical: `/${locale}${p}`,
    languages: {
      ru: `/ru${p}`,
      en: `/en${p}`,
      "x-default": `/ru${p}`,
    },
  };
}
