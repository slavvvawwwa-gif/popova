import type { StructureResolver } from "sanity/structure";

// Bio and Contacts are singletons — one document each, edited in place.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Контент")
    .items([
      S.listItem()
        .title("Главная")
        .id("home")
        .child(S.document().schemaType("home").documentId("home")),
      S.listItem()
        .title("Биография")
        .id("bio")
        .child(S.document().schemaType("bio").documentId("bio")),
      S.listItem()
        .title("Контакты")
        .id("contacts")
        .child(S.document().schemaType("contacts").documentId("contacts")),
      S.divider(),
      // One document type (performance) split by `kind` into three catalogs
      S.listItem()
        .title("Спектакли")
        .id("perf-performance")
        .child(
          S.documentList()
            .title("Спектакли")
            .filter('_type == "performance" && kind == "performance"')
            .initialValueTemplates([])
        ),
      S.listItem()
        .title("Проекты")
        .id("perf-project")
        .child(
          S.documentList()
            .title("Проекты")
            .filter('_type == "performance" && kind == "project"')
        ),
      S.listItem()
        .title("Лаборатория")
        .id("perf-lab")
        .child(
          S.documentList()
            .title("Лаборатория")
            .filter('_type == "performance" && kind == "lab"')
        ),
      S.divider(),
      S.documentTypeListItem("pressItem").title("Пресса / Награды"),
    ]);
