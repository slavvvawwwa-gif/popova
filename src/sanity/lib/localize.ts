// RU/EN field resolution with fallback to RU (per brief section 3).
// Fields are stored as separate `<name>_ru` / `<name>_en` keys.

type Locale = "ru" | "en";

/** Pick a localized scalar field, falling back to RU when EN is empty. */
export function pick<T extends Record<string, unknown>>(
  obj: T | null | undefined,
  base: string,
  locale: Locale
): string {
  if (!obj) return "";
  const ru = (obj[`${base}_ru`] as string) || "";
  if (locale === "en") {
    const en = (obj[`${base}_en`] as string) || "";
    return en || ru; // fallback to RU
  }
  return ru;
}

/** Pick a localized array/object field (e.g. portable text), falling back to RU. */
export function pickField<V>(
  obj: Record<string, unknown> | null | undefined,
  base: string,
  locale: Locale
): V | null {
  if (!obj) return null;
  const ru = obj[`${base}_ru`] as V | undefined;
  if (locale === "en") {
    const en = obj[`${base}_en`] as V | undefined;
    return (en ?? ru ?? null) as V | null;
  }
  return (ru ?? null) as V | null;
}
