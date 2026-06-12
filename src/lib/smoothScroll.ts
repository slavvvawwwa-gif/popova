"use client";

/**
 * Smoothly scroll an element into view with custom easing.
 * Falls back to an instant jump when the user prefers reduced motion.
 */
export function smoothScrollTo(target: string | HTMLElement, offset = 80) {
  if (typeof window === "undefined") return;

  const el =
    typeof target === "string"
      ? document.getElementById(target.replace(/^#/, ""))
      : target;
  if (!el) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  if (reduced) {
    window.scrollTo(0, top); // instant — no easing
    return;
  }

  const start = window.scrollY;
  const distance = top - start;
  const duration = Math.min(900, Math.max(350, Math.abs(distance) * 0.6));
  let startTime: number | null = null;

  // easeInOutCubic
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (now: number) => {
    if (startTime === null) startTime = now;
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    window.scrollTo(0, start + distance * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}
