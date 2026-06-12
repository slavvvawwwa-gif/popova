"use client";

import dynamic from "next/dynamic";

// Load the Studio (and its config graph) only in the browser — never on the
// server. This avoids SSR-time evaluation of Studio internals under Turbopack.
const StudioInner = dynamic(() => import("./StudioInner"), {
  ssr: false,
  loading: () => null,
});

export default function StudioClient() {
  return <StudioInner />;
}
