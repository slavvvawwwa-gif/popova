"use client";

import { useEffect, useState } from "react";
import { scrollToTop } from "@/lib/smoothScroll";

/** Fixed "back to top" control, bottom-left. Appears after scrolling down. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Наверх"
      style={{
        position: "fixed",
        left: "1.5rem",
        bottom: "1.5rem",
        zIndex: 60,
        width: "44px",
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(10,10,10,0.7)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(237,237,237,0.18)",
        borderRadius: 0,
        color: "var(--text-secondary)",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        pointerEvents: visible ? "auto" : "none",
        transition:
          "opacity 240ms var(--ease-out-soft), transform 240ms var(--ease-out-soft), color 200ms var(--ease-out-soft), border-color 200ms var(--ease-out-soft)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--accent)";
        e.currentTarget.style.borderColor = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--text-secondary)";
        e.currentTarget.style.borderColor = "rgba(237,237,237,0.18)";
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
