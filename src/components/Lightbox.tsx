"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({ images, index, onClose, onPrev, onNext }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const image = images[index];

  // Focus close button on open
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Keyboard: Esc → close, ← → navigate
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    // Lock body scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  // Focus trap: keep focus inside overlay
  const handleFocusTrap = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
      "button, [href], [tabindex]:not([tabindex='-1'])"
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  };

  if (typeof document === "undefined") return null;

  // Portal to <body> so the overlay is centred on the viewport, not inside a
  // transformed ancestor (reveal animations use transform → would offset fixed).
  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Фото ${index + 1} из ${images.length}: ${image.alt}`}
      onKeyDown={handleFocusTrap}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "rgba(10,10,10,0.96)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        backdropFilter: "blur(4px)",
      }}
    >
      {/* Close */}
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Закрыть"
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "1.5rem",
          background: "none",
          border: "1px solid rgba(237,237,237,0.15)",
          color: "var(--text-secondary)",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "color 200ms var(--ease-out-soft), border-color 200ms var(--ease-out-soft)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>

      {/* Counter */}
      <p
        style={{
          position: "absolute",
          top: "1.75rem",
          left: "2rem",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
        }}
      >
        {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
      </p>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={onPrev}
          aria-label="Предыдущее фото"
          style={{
            position: "absolute",
            left: "1.5rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "1px solid rgba(237,237,237,0.12)",
            color: "var(--text-secondary)",
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "color 200ms var(--ease-out-soft), border-color 200ms var(--ease-out-soft)",
          }}
        >
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
            <path d="M16 5H2M6 1L2 5L6 9" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        style={{
          maxWidth: "min(90vw, 1100px)",
          maxHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {/* Image surface — real image when available, else placeholder */}
        <div
          style={{
            backgroundColor: "var(--bg-surface)",
            width: "min(80vw, 900px)",
            height: "min(65vh, 600px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {image.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.src}
              alt={image.alt}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 6vw, 4rem)",
                fontWeight: 300,
                color: "rgba(237,237,237,0.08)",
              }}
            >
              {image.alt}
            </span>
          )}
        </div>

        {image.caption && (
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              color: "var(--text-secondary)",
              textAlign: "center",
            }}
          >
            {image.caption}
          </p>
        )}
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={onNext}
          aria-label="Следующее фото"
          style={{
            position: "absolute",
            right: "1.5rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "1px solid rgba(237,237,237,0.12)",
            color: "var(--text-secondary)",
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "color 200ms var(--ease-out-soft), border-color 200ms var(--ease-out-soft)",
          }}
        >
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
            <path d="M0 5H14M10 1L14 5L10 9" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      )}
    </div>,
    document.body
  );
}
