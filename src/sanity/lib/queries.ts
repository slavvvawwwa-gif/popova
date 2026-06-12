// GROQ queries. Both RU and EN fields are fetched; locale fallback happens
// in the data layer (see lib/data.ts) so a single query serves both languages.

export const homeQuery = /* groq */ `
*[_type == "home"][0] {
  hero_label_ru, hero_label_en,
  hero_name_ru, hero_name_en,
  hero_tagline_ru, hero_tagline_en
}`;

export const performancesQuery = /* groq */ `
*[_type == "performance" && kind == $kind] | order(year desc, _createdAt desc) {
  "slug": slug.current,
  title_ru, title_en, theatre, year, role, tags, status, featured,
  short_description_ru, short_description_en,
  cover_image
}`;

export const featuredPerformancesQuery = /* groq */ `
*[_type == "performance" && featured == true] | order(year desc)[0...3] {
  "slug": slug.current,
  title_ru, title_en, theatre, year, tags, status, cover_image
}`;

export const performanceBySlugQuery = /* groq */ `
*[_type == "performance" && slug.current == $slug][0] {
  "slug": slug.current,
  title_ru, title_en, theatre, year, role, artist, tags, status,
  short_description_ru, short_description_en,
  full_description_ru, full_description_en,
  cover_image,
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
  bio_text_ru, bio_text_en,
  timeline[]{ year, description_ru, description_en },
  "cv_ru": cv_file_ru.asset->url,
  "cv_en": cv_file_en.asset->url
}`;

export const contactsQuery = /* groq */ `
*[_type == "contacts"][0] {
  email,
  social_links[]{ platform, url, handle }
}`;
