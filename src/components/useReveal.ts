"use client";

import { useEffect, useRef, useState } from "react";

export function useReveal(delay = 0) {
  // typed as `any` so the returned ref attaches to any JSX element type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
        },
        { threshold: 0.08 }
      );
      observer.observe(el);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return { ref, visible };
}

export function revealStyle(visible: boolean, delayMs = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 700ms var(--ease-out-expo) ${delayMs}ms, transform 700ms var(--ease-out-expo) ${delayMs}ms`,
  };
}
