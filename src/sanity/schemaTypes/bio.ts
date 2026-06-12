import { defineType, defineField, defineArrayMember } from "sanity";

/** Bio (singleton) — section 4 */
export const bio = defineType({
  name: "bio",
  title: "Биография",
  type: "document",
  fields: [
    defineField({
      name: "name_ru",
      title: "Имя (RU)",
      type: "string",
    }),
    defineField({
      name: "name_en",
      title: "Имя (EN)",
      type: "string",
    }),
    defineField({
      name: "role_ru",
      title: "Роль / профессия (RU)",
      type: "string",
      initialValue: "Театральный режиссёр",
    }),
    defineField({
      name: "role_en",
      title: "Роль / профессия (EN)",
      type: "string",
    }),
    defineField({
      name: "photo",
      title: "Фотография",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio_text_ru",
      title: "Биография (RU)",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "bio_text_en",
      title: "Биография (EN)",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "timeline",
      title: "Хронология",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "year",
              title: "Год",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({ name: "description_ru", title: "Описание (RU)", type: "text", rows: 2 }),
            defineField({ name: "description_en", title: "Описание (EN)", type: "text", rows: 2 }),
          ],
          preview: {
            select: { title: "year", subtitle: "description_ru" },
          },
        }),
      ],
    }),
    defineField({
      name: "cv_file_ru",
      title: "CV — PDF (RU)",
      type: "file",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "cv_file_en",
      title: "CV — PDF (EN)",
      type: "file",
      options: { accept: ".pdf" },
    }),
  ],
  preview: {
    prepare: () => ({ title: "Биография" }),
  },
});
