import { defineType, defineField, defineArrayMember } from "sanity";

/** Contacts (singleton) — section 4. Links only, no contact form. */
export const contacts = defineType({
  name: "contacts",
  title: "Контакты",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Электронная почта",
      type: "string",
      validation: (r) =>
        r.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: "email" }).warning("Похоже на некорректный email"),
    }),
    defineField({
      name: "social_links",
      title: "Социальные сети / мессенджеры",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Платформа",
              type: "string",
              description: "Напр. Telegram, Instagram, VKontakte, YouTube.",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "url",
              title: "Ссылка",
              type: "url",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "handle",
              title: "Отображаемый хэндл",
              type: "string",
              description: "Напр. @director — опционально.",
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Контакты" }),
  },
});
