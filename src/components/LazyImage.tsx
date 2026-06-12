"use client";

import { useEffect, useRef, useState } from "react";

interface LazyImageProps {
  src?: string;
  alt: string;
  /** Placeholder label shown when no src is available (pre-CMS) */
  placeholderLabel?: string;
  aspectRatio?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Lazy-loads an image via IntersectionObserver and fades it in (.lazy-img).
 * When no `src` is supplied yet (placeholder/CMS not connected) it still
 * fades in a surface box so the effect is visible on the live placeholders.
 * Fade/scale is disabled under prefers-reduced-motion (handled in CSS).
 */
export default function LazyImage({
  src,
  alt,
  placeholderLabel,
  aspectRatio,
  style,
  className,
}: LazyImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px", threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // For placeholder boxes (no real src) mark loaded as soon as in view
  useEffect(() => {
    if (inView && !src) setLoaded(true);
  }, [inView, src]);

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: "var(--bg-surface)",
        aspectRatio,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      className={className}
    >
      {inView && src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`lazy-img ${loaded ? "is-loaded" : ""}`}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        // Placeholder surface — still fades in once in viewport
        <div
          className={`lazy-img ${loaded ? "is-loaded" : ""}`}
          aria-label={alt}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {placeholderLabel && (
            <span
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.25rem, 3vw, 2rem)",
                fontWeight: 300,
                color: "rgba(237,237,237,0.06)",
                userSelect: "none",
              }}
            >
              {placeholderLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
