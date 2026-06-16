// Sanity environment configuration.
// Values are read from .env.local — see README for how to obtain them.

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "mq82kdu0";

// Server-only read token (optional — only needed for drafts/private datasets).
export const readToken = process.env.SANITY_API_READ_TOKEN || "";

// True once a real project ID is present. The frontend falls back to
// placeholder content until this is configured, so the site builds and runs
// without a Sanity project.
export const isSanityConfigured = Boolean(projectId);

// defineConfig requires a non-empty, format-valid projectId at import time.
// Use a harmless dummy until the real ID is set.
export const studioProjectId = projectId || "missing-project-id";
