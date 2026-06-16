import { defineCliConfig } from "sanity/cli";
import { projectId, dataset } from "./src/sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: "popova-cms-studio",
  deployment: {
    appId: "o3abin6or3svptyzje1cjng8",
    autoUpdates: true,
  },
});
