import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { colorInput } from "@sanity/color-input";

import { dataset, apiVersion } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import { deleteWithContent } from "./src/sanity/actions/deleteWithContent";

// Configuration for the embedded Studio mounted at /studio.
export default defineConfig({
  basePath: "/studio",
  projectId: "mq82kdu0",
  dataset,
  auth: {
    providers: [
      {
        name: "google",
        title: "Google",
        url: "https://api.sanity.io/v2021-10-01/auth/login/google",
        logo: "/static/google-logo.svg",
      },
    ],
    redirectOnSingle: true,
  },
  // "New document" templates that preset `kind`, so creating from each catalog
  // list (Спектакли / Проекты / Лаборатория) lands in the right section.
  schema: {
    types: schema.types,
    templates: (prev) => [
      ...prev,
      { id: "new-performance", title: "Спектакль", schemaType: "performance", value: { kind: "performance" } },
      { id: "new-project", title: "Проект", schemaType: "performance", value: { kind: "project" } },
      { id: "new-lab", title: "Лаборатория", schemaType: "performance", value: { kind: "lab" } },
    ],
  },
  document: {
    // Add a cascade-delete action to performances (спектакли/проекты/лаборатории)
    actions: (prev, { schemaType }) =>
      schemaType === "performance" ? [...prev, deleteWithContent] : prev,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    colorInput(),
  ],
});
