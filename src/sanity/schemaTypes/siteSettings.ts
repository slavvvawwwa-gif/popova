import { defineType, defineField } from "sanity";

/** Site-wide settings (singleton) — e.g. the decorative background overlay. */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Настройки сайта",
  type: "document",
  fields: [
    defineField({
      name: "background_svg",
      title: "Фоновое изображение (вектор / SVG)",
      type: "file",
      options: { accept: "image/svg+xml,.svg,image/png,image/*" },
      description:
        "Накладывается поверх чёрного фона. Всегда занимает строго правую половину экрана, " +
        "не заходит за середину и не двигается при прокрутке. Лучше всего — векторный SVG.",
    }),
    defineField({
      name: "background_opacity",
      title: "Прозрачность фона (%)",
      type: "number",
      initialValue: 100,
      validation: (r) => r.min(0).max(100),
      description: "0 — изображение невидимо, 100 — полностью непрозрачно.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Настройки сайта" }),
  },
});
