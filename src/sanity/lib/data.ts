// Server-side data layer.
// Fetches view-ready, locale-resolved content from Sanity when configured,
// otherwise returns placeholder content so the site builds and runs without
// a Sanity project. Import only from Server Components.

import { client } from "./client";
import { urlForImage } from "./image";
import { pick, pickField } from "./localize";
import {
  homeQuery,
  performancesQuery,
  featuredPerformancesQuery,
  performanceBySlugQuery,
  playbillQuery,
  pressQuery,
  bioQuery,
  contactsQuery,
} from "./queries";
import {
  fallbackHome,
  fallbackWorks,
  fallbackWorkDetail,
  fallbackPlaybill,
  fallbackPress,
  fallbackBio,
  fallbackContacts,
} from "./fallback";

export type Locale = "ru" | "en";
export type Kind = "performance" | "project" | "lab";

/* ─── View-ready types ───────────────────────────────────────────── */
export interface WorkCard {
  slug: string;
  title: string;
  theatre: string;
  year: number | null;
  genre: string;
  status: "current" | "archive";
  featured?: boolean;
  kind: Kind;
  shortDescription: string;
  coverUrl: string | null;
  previewUrl: string | null;
}

export interface GalleryImg {
  url: string | null;
  alt: string;
  caption: string;
}

export interface VideoLink {
  url: string;
  label: string;
}

export interface PressEntry {
  type: "review" | "interview" | "award";
  title: string;
  source: string;
  date: string;
  year: number | null;
  excerpt: string;
  link: string | null;
  performance: string | null;
}

export interface WorkDetail extends WorkCard {
  premiere: string; // ISO date
  children: WorkCard[];
  parentSlug: string | null;
  parentKind: Kind | null;
  role: string;
  playwright: string;
  artist: string;
  lightingDesigner: string;
  setDesigner: string;
  composer: string;
  choreographer: string;
  performers: string;
  creditsExtra: string;
  shortDescription: string;
  // Portable Text blocks (rendered with @portabletext/react)
  fullDescription: unknown[] | null;
  gallery: GalleryImg[];
  videos: VideoLink[];
  press: PressEntry[];
}

export interface PlaybillItem {
  slug: string | null;
  title: string;
  date: string; // ISO
  venue: string;
  city: string;
  note: string;
  isPast: boolean;
}

export interface BioData {
  name: string;
  role: string;
  photoUrl: string | null;
  gallery: { url: string | null; alt: string }[];
  text: unknown[] | null;
  timeline: { year: string; description: string }[];
  cvRu: string | null;
  cvEn: string | null;
}

export interface ContactsData {
  email: string;
  socials: { platform: string; url: string; handle: string }[];
}

export interface HomeContent {
  label: string;
  name: string;
  tagline: string;
}

const yearOf = (d?: string | null) =>
  d ? new Date(d).getFullYear() : null;

// Next.js fetch caching: cache the result and tag it by document type so a
// Sanity webhook can revalidate it on demand (see /api/revalidate). The 60s
// revalidate is a fallback if the webhook isn't configured.
const cache = (tags: string[]) => ({ next: { revalidate: 60, tags } });

// Localize a plain RU field that has an optional `<base>_en` companion
// (RU value lives in `<base>`, not `<base>_ru`).
const enOr = (r: Record<string, unknown>, base: string, locale: Locale) =>
  (locale === "en" ? (r[`${base}_en`] as string) : "") || ((r[base] as string) ?? "");

const genreOf = (r: Record<string, unknown>, locale: Locale) => {
  const tag0 = ((r.tags as string[]) ?? [])[0] ?? "";
  return (locale === "en" ? (r.genre_en as string) : "") || tag0;
};

// Shared mapping for catalog tiles / featured / children.
function mapCard(r: Record<string, unknown>, locale: Locale, coverWidth = 1400): WorkCard {
  return {
    slug: (r.slug as string) ?? "",
    title: pick(r, "title", locale),
    theatre: enOr(r, "theatre", locale),
    year: (r.year as number) ?? null,
    genre: genreOf(r, locale),
    status: (r.status as "current" | "archive") ?? "archive",
    featured: Boolean(r.featured),
    kind: (r.kind as Kind) ?? "performance",
    shortDescription: pick(r, "short_description", locale),
    coverUrl: urlForImage(r.cover_image as never)?.width(coverWidth).quality(90).url() ?? null,
    previewUrl:
      urlForImage((r.preview_image || r.cover_image) as never)?.width(900).quality(88).url() ?? null,
  };
}

/* ─── Home (singleton) ───────────────────────────────────────────── */
export async function getHome(locale: Locale): Promise<HomeContent> {
  if (!client) return fallbackHome(locale);
  const r = await client.fetch<Record<string, unknown> | null>(homeQuery, {}, cache(["home"]));
  if (!r) return fallbackHome(locale);
  const fb = fallbackHome(locale);
  return {
    label: pick(r, "hero_label", locale) || fb.label,
    name: pick(r, "hero_name", locale) || fb.name,
    tagline: pick(r, "hero_tagline", locale) || fb.tagline,
  };
}

/* ─── Performances ───────────────────────────────────────────────── */
export async function getPerformances(locale: Locale, kind: Kind = "performance"): Promise<WorkCard[]> {
  if (!client) return fallbackWorks(locale, kind);
  const rows = await client.fetch<Record<string, unknown>[]>(performancesQuery, { kind }, cache(["performance"]));
  if (!rows?.length) return fallbackWorks(locale, kind);
  return rows.map((r) => mapCard(r, locale));
}

export async function getFeaturedPerformances(locale: Locale): Promise<WorkCard[]> {
  const fb = () =>
    [...fallbackWorks(locale, "performance"), ...fallbackWorks(locale, "project"), ...fallbackWorks(locale, "lab")]
      .filter((w) => w.featured)
      .slice(0, 3);
  if (!client) return fb();
  const rows = await client.fetch<Record<string, unknown>[]>(featuredPerformancesQuery, {}, cache(["performance"]));
  if (!rows?.length) return fb();
  return rows.map((r) => mapCard(r, locale, 1800));
}

export async function getPerformance(
  slug: string,
  locale: Locale
): Promise<WorkDetail | null> {
  if (!client) return fallbackWorkDetail(slug, locale);
  const r = await client.fetch<Record<string, unknown> | null>(performanceBySlugQuery, { slug }, cache(["performance", "pressItem"]));
  if (!r) return fallbackWorkDetail(slug, locale);

  const gallery = ((r.gallery as Record<string, unknown>[]) ?? []).map((g) => ({
    url: urlForImage(g as never)?.width(1600).quality(88).url() ?? null,
    alt: (g.alt as string) ?? "",
    caption: pick(g, "caption", locale),
  }));

  const press = ((r.press as Record<string, unknown>[]) ?? []).map((p) => ({
    type: (p.type as PressEntry["type"]) ?? "review",
    title: pick(p, "title", locale),
    source: (p.source as string) ?? "",
    date: (p.date as string) ?? "",
    year: yearOf(p.date as string),
    excerpt: pick(p, "excerpt", locale),
    link: (p.external_link as string) ?? null,
    performance: null,
  }));

  const children = ((r.children as Record<string, unknown>[]) ?? []).map((c) => mapCard(c, locale));

  return {
    slug: (r.slug as string) ?? slug,
    title: pick(r, "title", locale),
    theatre: enOr(r, "theatre", locale),
    year: (r.year as number) ?? null,
    genre: genreOf(r, locale),
    status: (r.status as "current" | "archive") ?? "archive",
    kind: (r.kind as Kind) ?? "performance",
    featured: Boolean(r.featured),
    previewUrl: urlForImage((r.preview_image || r.cover_image) as never)?.width(900).quality(88).url() ?? null,
    parentSlug: (r.parentSlug as string) ?? null,
    parentKind: (r.parentKind as Kind) ?? null,
    children,
    premiere: (r.premiere as string) ?? "",
    role: (r.role as string) ?? "",
    playwright: (r.playwright as string) ?? "",
    artist: (r.artist as string) ?? "",
    lightingDesigner: (r.lighting_designer as string) ?? "",
    setDesigner: (r.set_designer as string) ?? "",
    composer: (r.composer as string) ?? "",
    choreographer: (r.choreographer as string) ?? "",
    performers: (r.performers as string) ?? "",
    creditsExtra: pick(r, "credits_extra", locale),
    shortDescription: pick(r, "short_description", locale),
    fullDescription: pickField<unknown[]>(r, "full_description", locale),
    coverUrl: urlForImage(r.cover_image as never)?.width(2200).quality(90).url() ?? null,
    gallery,
    videos: ((r.video_links as VideoLink[]) ?? []).filter((v) => v?.url),
    press,
  };
}

/* ─── Playbill ───────────────────────────────────────────────────── */
export async function getPlaybill(locale: Locale): Promise<PlaybillItem[]> {
  const now = Date.now();
  if (!client) return fallbackPlaybill(locale);
  const rows = await client.fetch<Record<string, unknown>[]>(playbillQuery, {}, cache(["playbillEntry", "performance"]));
  if (!rows?.length) return fallbackPlaybill(locale);
  return rows.map((r) => ({
    slug: (r.slug as string) ?? null,
    title: pick(r, "perf_title", locale),
    date: (r.date as string) ?? "",
    venue: (r.venue as string) ?? "",
    city: (r.city as string) ?? "",
    note: pick(r, "note", locale),
    isPast: r.date ? new Date(r.date as string).getTime() < now : false,
  }));
}

/* ─── Press ──────────────────────────────────────────────────────── */
export async function getPress(locale: Locale): Promise<PressEntry[]> {
  if (!client) return fallbackPress(locale);
  const rows = await client.fetch<Record<string, unknown>[]>(pressQuery, {}, cache(["pressItem", "performance"]));
  if (!rows?.length) return fallbackPress(locale);
  return rows.map((r) => ({
    type: (r.type as PressEntry["type"]) ?? "review",
    title: pick(r, "title", locale),
    source: (r.source as string) ?? "",
    date: (r.date as string) ?? "",
    year: yearOf(r.date as string),
    excerpt: pick(r, "excerpt", locale),
    link: (r.external_link as string) ?? null,
    performance: (r.related_title_ru as string) ?? null,
  }));
}

/* ─── Bio (singleton) ────────────────────────────────────────────── */
export async function getBio(locale: Locale): Promise<BioData> {
  if (!client) return fallbackBio(locale);
  const r = await client.fetch<Record<string, unknown> | null>(bioQuery, {}, cache(["bio"]));
  if (!r) return fallbackBio(locale);
  const gallery = ((r.gallery as Record<string, unknown>[]) ?? []).map((g) => ({
    url: urlForImage(g as never)?.width(1600).quality(90).url() ?? null,
    alt: (g.alt as string) ?? "",
  }));
  return {
    name: pick(r, "name", locale),
    role: pick(r, "role", locale),
    photoUrl: urlForImage(r.photo as never)?.width(1100).quality(90).url() ?? null,
    gallery,
    text: pickField<unknown[]>(r, "bio_text", locale),
    timeline: ((r.timeline as Record<string, unknown>[]) ?? []).map((tl) => ({
      year: (tl.year as string) ?? "",
      description: pick(tl, "description", locale),
    })),
    cvRu: (r.cv_ru as string) ?? null,
    cvEn: (r.cv_en as string) ?? null,
  };
}

/* ─── Contacts (singleton) ───────────────────────────────────────── */
export async function getContacts(): Promise<ContactsData> {
  if (!client) return fallbackContacts();
  const r = await client.fetch<Record<string, unknown> | null>(contactsQuery, {}, cache(["contacts"]));
  if (!r) return fallbackContacts();
  return {
    email: (r.email as string) ?? "",
    socials: ((r.social_links as ContactsData["socials"]) ?? []).filter((s) => s?.url),
  };
}
