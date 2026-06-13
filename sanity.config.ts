import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { studioProjectId, dataset, apiVersion } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

// Configuration for the embedded Studio mounted at /studio.
export default defineConfig({
  basePath: "/studio",
  projectId: studioProjectId,
  dataset,
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
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
