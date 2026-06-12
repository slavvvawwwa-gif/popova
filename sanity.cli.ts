import { defineCliConfig } from "sanity/cli";
import { projectId, dataset } from "./src/sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  // Studio is embedded in the Next.js app at /studio
  studioHost: undefined,
  autoUpdates: true,
});
