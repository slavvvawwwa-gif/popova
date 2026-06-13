// Placeholder content used until a Sanity project is connected.
// Bilingual; resolved by locale with RU fallback.

import type {
  Locale,
  WorkCard,
  WorkDetail,
  PlaybillItem,
  PressEntry,
  BioData,
  ContactsData,
  HomeContent,
} from "./data";

const t = (locale: Locale, ru: string, en: string) => (locale === "en" ? en : ru);

type Kind = "performance" | "project" | "lab";

interface RawWork {
  slug: string;
  ru: string;
  en: string;
  theatre: string;
  year: number;
  genreRu: string;
  genreEn: string;
  status: "current" | "archive";
  featured?: boolean;
  kind: Kind;
}

const WORKS: RawWork[] = [
  { slug: "hamlet", ru: "Гамлет", en: "Hamlet", theatre: "Театр А", year: 2024, genreRu: "Трагедия", genreEn: "Tragedy", status: "current", featured: true, kind: "performance" },
  { slug: "chekhov-three", ru: "Три сестры", en: "Three Sisters", theatre: "Театр Б", year: 2024, genreRu: "Драма", genreEn: "Drama", status: "current", featured: true, kind: "performance" },
  { slug: "woyzeck", ru: "Войцек", en: "Woyzeck", theatre: "Театр В", year: 2023, genreRu: "Драма", genreEn: "Drama", status: "current", featured: true, kind: "performance" },
  { slug: "cherry-orchard", ru: "Вишнёвый сад", en: "The Cherry Orchard", theatre: "Театр А", year: 2022, genreRu: "Комедия", genreEn: "Comedy", status: "archive", kind: "performance" },
  { slug: "seagull", ru: "Чайка", en: "The Seagull", theatre: "Театр Г", year: 2021, genreRu: "Драма", genreEn: "Drama", status: "archive", kind: "performance" },
  { slug: "master", ru: "Мастер и Маргарита", en: "The Master and Margarita", theatre: "Театр Б", year: 2021, genreRu: "Фантасмагория", genreEn: "Phantasmagoria", status: "archive", kind: "performance" },
  { slug: "storm", ru: "Гроза", en: "The Storm", theatre: "Театр В", year: 2020, genreRu: "Трагедия", genreEn: "Tragedy", status: "archive", kind: "performance" },
  { slug: "idiot", ru: "Идиот", en: "The Idiot", theatre: "Театр А", year: 2019, genreRu: "Драма", genreEn: "Drama", status: "archive", kind: "performance" },

  // Проекты
  { slug: "site-specific-river", ru: "Река", en: "The River", theatre: "Набережная", year: 2024, genreRu: "Site-specific", genreEn: "Site-specific", status: "current", kind: "project" },
  { slug: "audio-walk", ru: "Аудиопрогулка", en: "Audio Walk", theatre: "Город", year: 2023, genreRu: "Иммерсивный", genreEn: "Immersive", status: "current", kind: "project" },
  { slug: "gallery-night", ru: "Ночь в музее", en: "Museum Night", theatre: "Галерея", year: 2022, genreRu: "Перформанс", genreEn: "Performance", status: "archive", kind: "project" },

  // Лаборатория
  { slug: "lab-chekhov", ru: "Лаборатория: Чехов", en: "Lab: Chekhov", theatre: "Студия", year: 2024, genreRu: "Эскиз", genreEn: "Sketch", status: "current", kind: "lab" },
  { slug: "lab-newdrama", ru: "Новая драма", en: "New Drama", theatre: "Студия", year: 2023, genreRu: "Читка", genreEn: "Reading", status: "current", kind: "lab" },
  { slug: "lab-movement", ru: "Лаборатория движения", en: "Movement Lab", theatre: "Студия", year: 2022, genreRu: "Воркшоп", genreEn: "Workshop", status: "archive", kind: "lab" },
];

export function fallbackWorks(locale: Locale, kind: Kind = "performance"): WorkCard[] {
  return WORKS.filter((w) => w.kind === kind).map((w) => ({
    slug: w.slug,
    title: t(locale, w.ru, w.en),
    theatre: w.theatre,
    year: w.year,
    genre: t(locale, w.genreRu, w.genreEn),
    status: w.status,
    featured: w.featured,
    kind: w.kind,
    shortDescription: t(
      locale,
      "Краткое описание появится здесь после наполнения через Sanity.",
      "A short description will appear here once added via Sanity."
    ),
    coverUrl: null,
    previewUrl: null,
  }));
}

export function fallbackWorkDetail(slug: string, locale: Locale): WorkDetail {
  const w = WORKS.find((x) => x.slug === slug) ?? WORKS[0];
  return {
    slug: w.slug,
    title: t(locale, w.ru, w.en),
    theatre: w.theatre,
    year: w.year,
    genre: t(locale, w.genreRu, w.genreEn),
    status: w.status,
    kind: w.kind,
    featured: w.featured,
    previewUrl: null,
    parentSlug: null,
    parentKind: null,
    // Projects/labs show their nested sub-entities (other items of same kind as demo)
    children:
      w.kind === "performance"
        ? []
        : fallbackWorks(locale, w.kind).filter((x) => x.slug !== w.slug),
    premiere: `${w.year}-09-15`,
    role: t(locale, "Варвара Попова", "Varvara Popova"),
    playwright: t(locale, "У. Шекспир", "W. Shakespeare"),
    artist: t(locale, "А. Иванов", "A. Ivanov"),
    lightingDesigner: t(locale, "Е. Петров", "E. Petrov"),
    setDesigner: t(locale, "М. Сидорова", "M. Sidorova"),
    composer: t(locale, "Д. Смирнов", "D. Smirnov"),
    choreographer: t(locale, "О. Кузнецова", "O. Kuznetsova"),
    performers: w.kind === "project" ? t(locale, "Резиденты лаборатории", "Lab residents") : "",
    creditsExtra: "",
    shortDescription: t(
      locale,
      "Спектакль о неспособности действовать в мире, где действие лишилось смысла.",
      "A play about the inability to act in a world where action has lost its meaning."
    ),
    fullDescription: null,
    coverUrl: null,
    gallery: Array.from({ length: 5 }, (_, i) => ({
      url: null,
      alt: t(locale, `Сцена ${i + 1}`, `Scene ${i + 1}`),
      caption: "",
    })),
    videos: [],
    press: [
      {
        type: "review",
        title: t(locale, "Режиссёр открывает новую страницу", "The director opens a new page"),
        source: t(locale, "Театральная газета", "Theatre Gazette"),
        date: "2024-03-15",
        year: 2024,
        excerpt: t(locale, "Мощная, цепляющая постановка.", "A powerful, gripping production."),
        link: "#",
        performance: null,
      },
    ],
  };
}

export function fallbackPlaybill(locale: Locale): PlaybillItem[] {
  const raw = [
    { slug: "hamlet", ru: "Гамлет", en: "Hamlet", date: "2025-07-15T19:00:00", venue: "Театр А", city: t(locale, "Москва", "Moscow"), noteRu: "", noteEn: "" },
    { slug: "chekhov-three", ru: "Три сестры", en: "Three Sisters", date: "2025-07-22T18:30:00", venue: "Театр Б", city: t(locale, "Санкт-Петербург", "St. Petersburg"), noteRu: "", noteEn: "" },
    { slug: "woyzeck", ru: "Войцек", en: "Woyzeck", date: "2025-08-03T19:30:00", venue: "Театр В", city: t(locale, "Москва", "Moscow"), noteRu: "Гастроли", noteEn: "On tour" },
    { slug: "cherry-orchard", ru: "Вишнёвый сад", en: "The Cherry Orchard", date: "2025-03-10T19:00:00", venue: "Театр А", city: t(locale, "Москва", "Moscow"), noteRu: "", noteEn: "" },
    { slug: "seagull", ru: "Чайка", en: "The Seagull", date: "2025-02-14T19:00:00", venue: "Театр Г", city: t(locale, "Казань", "Kazan"), noteRu: "", noteEn: "" },
  ];
  const now = Date.now();
  return raw.map((r) => ({
    slug: r.slug,
    title: t(locale, r.ru, r.en),
    date: r.date,
    venue: r.venue,
    city: r.city,
    note: t(locale, r.noteRu, r.noteEn),
    isPast: new Date(r.date).getTime() < now,
  }));
}

export function fallbackPress(locale: Locale): PressEntry[] {
  return [
    {
      type: "review",
      title: t(locale, "Режиссёр открывает новую страницу", "The director opens a new page"),
      source: t(locale, "Театральная газета", "Theatre Gazette"),
      date: "2024-03-15",
      year: 2024,
      excerpt: t(locale, "Мощная, цепляющая постановка. Режиссёр демонстрирует зрелость видения.", "A powerful, gripping production. The director shows a mature vision."),
      link: "#",
      performance: t(locale, "Гамлет", "Hamlet"),
    },
    {
      type: "interview",
      title: t(locale, "«Театр должен говорить о живом»", "“Theatre must speak of the living”"),
      source: "Культура.РФ",
      date: "2024-02-08",
      year: 2024,
      excerpt: t(locale, "О методе работы с артистами и природе современного театра.", "On working with actors and the nature of contemporary theatre."),
      link: "#",
      performance: null,
    },
    {
      type: "award",
      title: t(locale, "Лауреат премии «Золотая маска» — Лучший режиссёр", "Golden Mask Award laureate — Best Director"),
      source: t(locale, "Союз театральных деятелей РФ", "Union of Theatre Workers"),
      date: "2023-04-01",
      year: 2023,
      excerpt: t(locale, "За постановку «Гамлет» в Театре А.", "For the production of Hamlet at Theatre A."),
      link: null,
      performance: t(locale, "Гамлет", "Hamlet"),
    },
    {
      type: "review",
      title: t(locale, "Спектакль года по версии «Театрала»", "Production of the Year by Teatral"),
      source: t(locale, "Журнал «Театрал»", "Teatral Magazine"),
      date: "2023-12-01",
      year: 2023,
      excerpt: t(locale, "«Три сестры» вошли в топ лучших спектаклей сезона.", "Three Sisters entered the top productions of the season."),
      link: "#",
      performance: t(locale, "Три сестры", "Three Sisters"),
    },
  ];
}

export function fallbackBio(locale: Locale): BioData {
  return {
    name: t(locale, "Имя Фамилия", "First Last"),
    role: t(locale, "Театральный режиссёр", "Theatre Director"),
    photoUrl: null,
    gallery: Array.from({ length: 4 }, (_, i) => ({
      url: null,
      alt: t(locale, `Фото ${i + 1}`, `Photo ${i + 1}`),
    })),
    text: null,
    timeline: [
      { year: "2024", description: t(locale, "Постановка «Гамлет» в Театре А. Участие в фестивале «Золотая маска».", "Production of Hamlet at Theatre A. Golden Mask festival.") },
      { year: "2022", description: t(locale, "Международный проект в Théâtre de la Ville, Париж.", "International project at Théâtre de la Ville, Paris.") },
      { year: "2020", description: t(locale, "Дебютная авторская постановка.", "Debut author's production.") },
      { year: "2018", description: t(locale, "Окончание ГИТИСа (режиссёрский факультет).", "Graduated from GITIS (Directing Department).") },
    ],
    cvRu: null,
    cvEn: null,
  };
}

export function fallbackHome(locale: Locale): HomeContent {
  return {
    label: t(locale, "Театральный режиссёр", "Theatre Director"),
    name: t(locale, "Имя Фамилия", "First Last"),
    tagline: t(
      locale,
      "Режиссёр, создающий театр на пересечении традиции и современности",
      "A director creating theatre at the crossroads of tradition and the contemporary"
    ),
  };
}

export function fallbackContacts(): ContactsData {
  return {
    email: "director@example.com",
    socials: [
      { platform: "Telegram", url: "https://t.me/director_handle", handle: "@director_handle" },
      { platform: "Instagram", url: "https://instagram.com/director.handle", handle: "@director.handle" },
      { platform: "VKontakte", url: "https://vk.com/director_handle", handle: "/director_handle" },
      { platform: "YouTube", url: "https://youtube.com/@director", handle: "@director" },
    ],
  };
}
