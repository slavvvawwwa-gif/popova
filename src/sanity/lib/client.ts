import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, isSanityConfigured } from "../env";

// Returns null until a real project ID is configured, so the data layer can
// fall back to placeholder content without throwing.
export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Disabled so Next's data cache (tag-based on-demand revalidation) is the
      // single source of caching — avoids the CDN serving stale data after a
      // webhook bust. Pages stay fast via Next's cache; updates are instant.
      useCdn: false,
      perspective: "published",
    })
  : null;
