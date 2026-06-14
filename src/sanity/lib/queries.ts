// GROQ queries. Both RU and EN fields are fetched; locale fallback happens
// in the data layer (see lib/data.ts) so a single query serves both languages.

export const homeQuery = /* groq */ `
*[_type == "home"][0] {
  hero_label_ru, hero_label_en,
  hero_name_ru, hero_name_en,
  hero_tagline_ru, hero_tagline_en
}`;

// Shared card projection (catalog tiles / children / featured)
const CARD = /* groq */ `
  "slug": slug.current,
  title_ru, title_en, theatre, theatre_en, year, premiere, kind, role, tags, genre_en, status, featured,
  short_description_ru, short_description_en,
  cover_image, preview_image
`;

// Top-level catalog by kind (excludes nested sub-entities)
export const performancesQuery = /* groq */ `
*[_type == "performance" && kind == $kind && !defined(parent)] | order(year desc, _createdAt desc) {
  ${CARD}
}`;

// Featured across all kinds (the "В избранное" checkbox). Ordered by proximity
// to now in the data layer, then sliced to 3.
export const featuredPerformancesQuery = /* groq */ `
*[_type == "performance" && featured == true && !defined(parent)] {
  ${CARD}
}`;

export const performanceBySlugQuery = /* groq */ `
*[_type == "performance" && slug.current == $slug][0] {
  "slug": slug.current,
  title_ru, title_en, theatre, theatre_en, year, kind, premiere, role, tags, genre_en, status,
  playwright, artist, lighting_designer, set_designer, composer, choreographer, performers,
  credits_extra_ru, credits_extra_en,
  short_description_ru, short_description_en,
  full_description_ru, full_description_en,
  content[]{
    _type,
    body_ru, body_en,
    images[]{ asset, alt, caption_ru, caption_en }
  },
  cover_image,
  "parentSlug": parent->slug.current,
  "parentKind": parent->kind,
  "children": *[_type == "performance" && parent._ref == ^._id] | order(year desc, _createdAt desc) {
    ${CARD}
  },
  gallery[]{ asset, alt, caption_ru, caption_en },
  video_links[]{ url, label },
  "press": *[_type == "pressItem" && references(^._id)] | order(date desc) {
    type, title_ru, title_en, source, date, excerpt_ru, excerpt_en, external_link
  }
}`;

export const playbillQuery = /* groq */ `
*[_type == "playbillEntry"] | order(date asc) {
  date, venue, city, note_ru, note_en,
  "slug": performance->slug.current,
  "perf_title_ru": performance->title_ru,
  "perf_title_en": performance->title_en
}`;

export const pressQuery = /* groq */ `
*[_type == "pressItem"] | order(date desc) {
  type, title_ru, title_en, source, date,
  excerpt_ru, excerpt_en, external_link,
  "related_title_ru": related_performance->title_ru
}`;

export const bioQuery = /* groq */ `
*[_type == "bio"][0] {
  name_ru, name_en, role_ru, role_en, photo,
  gallery[]{ asset, alt },
  bio_text_ru, bio_text_en,
  festivals[]{ period, description_ru, description_en },
  education[]{ period, description_ru, description_en },
  letters[]{ period, description_ru, description_en },
  "cv_ru": cv_file_ru.asset->url,
  "cv_en": cv_file_en.asset->url
}`;

export const contactsQuery = /* groq */ `
*[_type == "contacts"][0] {
  email,
  social_links[]{ platform, url, handle }
}`;
