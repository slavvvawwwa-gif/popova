"use client";

import { useState, useCallback } from "react";
import LazyImage from "@/components/LazyImage";
import Lightbox, { type LightboxImage } from "@/components/Lightbox";

interface Photo {
  url: string | null;
  alt: string;
}

/**
 * "Stack of photos": main photo on top with a couple of offset cards behind.
 * Clicking opens a lightbox to browse the whole set.
 */
export default function PhotoStack({
  main,
  photos,
  label,
}: {
  main: Photo;
  photos: Photo[];
  label: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [index, setIndex] = useState<number | null>(null);

  const all: LightboxImage[] = [main, ...photos]
    .filter((p) => p) // keep order; placeholders allowed
    .map((p) => ({ src: p.url ?? "", alt: p.alt }));

  const open = useCallback(() => setIndex(0), []);
  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(() => setIndex((i) => (i === null ? null : (i - 1 + all.length) % all.length)), [all.length]);
  const next = useCallback(() => setIndex((i) => (i === null ? null : (i + 1) % all.length)), [all.length]);

  // Up to 3 cards behind the main one for the "stack" depth
  const behind = Math.min(3, Math.max(0, photos.length));
  const offsets = [
    { x: 10, y: 10, r: 2.5 },
    { x: -8, y: 16, r: -3 },
    { x: 16, y: 4, r: 4 },
  ];

  return (
    <div style={{ position: "relative", maxWidth: "380px" }}>
      {/* Behind cards */}
      {Array.from({ length: behind }).map((_, i) => {
        const o = offsets[i];
        const spread = hovered ? 1.6 : 1;
        return (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "var(--bg-surface)",
              aspectRatio: "3/4",
              transform: `translate(${o.x * spread}px, ${o.y * spread}px) rotate(${o.r}deg)`,
              transition: "transform 360ms var(--ease-out-soft)",
              border: "1px solid rgba(237,237,237,0.06)",
              zIndex: 0,
            }}
          />
        );
      })}

      {/* Top (main) photo — opens the gallery */}
      <button
        type="button"
        onClick={open}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={label}
        style={{
          position: "relative",
          zIndex: 1,
          display: "block",
          width: "100%",
          padding: 0,
          border: "none",
          background: "none",
          cursor: "pointer",
        }}
      >
        <LazyImage
          src={main.url ?? undefined}
          alt={main.alt}
          placeholderLabel="ИФ"
          aspectRatio="3/4"
          style={{ width: "100%" }}
        />
        {/* count badge */}
        {all.length > 1 && (
          <span
            style={{
              position: "absolute",
              bottom: "0.75rem",
              right: "0.75rem",
              padding: "0.3rem 0.6rem",
              backgroundColor: "rgba(10,10,10,0.7)",
              backdropFilter: "blur(6px)",
              fontSize: "0.6rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-primary)",
              border: "1px solid rgba(237,237,237,0.18)",
            }}
          >
            {all.length} фото
          </span>
        )}
      </button>

      {index !== null && (
        <Lightbox images={all} index={index} onClose={close} onPrev={prev} onNext={next} />
      )}
    </div>
  );
}
