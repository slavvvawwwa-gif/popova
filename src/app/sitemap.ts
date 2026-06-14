import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getAllPaths } from "@/sanity/lib/data";

const LOCALES = ["ru", "en"] as const;
const STATIC_PATHS = ["", "/about", "/works", "/projects", "/lab", "/contacts"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static pages × locales, with hreflang alternates
  for (const path of STATIC_PATHS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
        alternates: {
          languages: {
            ru: `${SITE_URL}/ru${path}`,
            en: `${SITE_URL}/en${path}`,
          },
        },
      });
    }
  }

  // Dynamic detail pages
  const paths = await getAllPaths();
  for (const { section, slug } of paths) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/${section}/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: {
            ru: `${SITE_URL}/ru/${section}/${slug}`,
            en: `${SITE_URL}/en/${section}/${slug}`,
          },
        },
      });
    }
  }

  return entries;
}
