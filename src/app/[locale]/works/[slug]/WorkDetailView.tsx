"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useReveal, revealStyle } from "@/components/useReveal";
import Lightbox, { type LightboxImage } from "@/components/Lightbox";
import LazyImage from "@/components/LazyImage";
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react";
import { useState, useCallback } from "react";
import type { WorkDetail } from "@/sanity/lib/data";

const GALLERY_ASPECTS = ["4/3", "3/4", "16/9", "1/1", "3/4"];

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="body" style={{ lineHeight: 1.9, marginBottom: "var(--space-6)" }}>
        {children}
      </p>
    ),
  },
};

/** Convert a YouTube/Vimeo watch URL into an embeddable URL. */
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export default function WorkDetailView({ work }: { work: WorkDetail }) {
  const t = useTranslations("work");
  const tc = useTranslations("common");

  const headerReveal = useReveal();
  const descReveal = useReveal(80);
  const galleryReveal = useReveal(120);
  const videoReveal = useReveal(160);
  const pressReveal = useReveal(200);

  const lbImages: LightboxImage[] = work.gallery.map((g) => ({
    src: g.url ?? "",
    alt: g.alt,
    caption: g.caption,
  }));

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + lbImages.length) % lbImages.length)),
    [lbImages.length]
  );
  const nextImage = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % lbImages.length)),
    [lbImages.length]
  );

  return (
    <>
      {lightboxIndex !== null && (
        <Lightbox images={lbImages} index={lightboxIndex} onClose={closeLightbox} onPrev={prevImage} onNext={nextImage} />
      )}

      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "5rem 2rem 6rem" }}>
        <Link
          href="/works"
          className="u-link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.625rem",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
            textDecoration: "none",
            marginBottom: "4rem",
          }}
        >
          <svg width="16" height="8" viewBox="0 0 16 8" fill="none" aria-hidden="true">
            <path d="M16 4H2M6 1L2 4L6 7" stroke="currentColor" strokeWidth="0.9" />
          </svg>
          {tc("back")}
        </Link>

        {/* Header */}
        <header
          ref={headerReveal.ref}
          style={{ ...revealStyle(headerReveal.visible), display: "grid", gridTemplateColumns: "1fr", gap: "3rem", marginBottom: "4rem" }}
          className="work-header"
        >
          <div>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              {work.theatre}
              {work.year && <span style={{ color: "rgba(237,237,237,0.2)" }}>—</span>}
              {work.year}
            </p>

            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 300, lineHeight: 0.92, letterSpacing: "-0.025em", color: "var(--text-primary)", marginBottom: "2.5rem" }}>
              {work.title}
            </h1>

            {work.shortDescription && (
              <p className="body" style={{ maxWidth: "560px" }}>
                {work.shortDescription}
              </p>
            )}
          </div>

          <div className="work-meta">
            {[
              { label: t("theatre"), value: work.theatre },
              { label: t("year"), value: work.year ? String(work.year) : "" },
              { label: t("genre"), value: work.genre },
              { label: "Постановщик", value: work.role },
              { label: "Художник", value: work.artist },
            ]
              .filter((r) => r.value)
              .map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", padding: "0.875rem 0", borderBottom: "1px solid rgba(237,237,237,0.05)" }}>
                  <span style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(237,237,237,0.3)" }}>{row.label}</span>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textAlign: "right" }}>{row.value}</span>
                </div>
              ))}
          </div>
        </header>

        {/* Cover */}
        <LazyImage
          src={work.coverUrl ?? undefined}
          alt={`${work.title} — обложка`}
          placeholderLabel={work.title}
          aspectRatio="16/7"
          style={{ width: "100%", marginBottom: "4rem" }}
        />

        {/* Full description */}
        <section ref={descReveal.ref} style={{ ...revealStyle(descReveal.visible), maxWidth: "720px", marginBottom: "5rem" }}>
          {work.fullDescription ? (
            <PortableText value={work.fullDescription as PortableTextBlock[]} components={ptComponents} />
          ) : (
            <p className="body" style={{ lineHeight: 1.9 }}>
              Полное описание спектакля будет доступно после подключения контента через Sanity CMS.
            </p>
          )}
        </section>

        {/* Gallery */}
        {lbImages.length > 0 && (
          <section ref={galleryReveal.ref} style={{ ...revealStyle(galleryReveal.visible), marginBottom: "5rem" }}>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "2rem" }}>
              {t("gallery")}
            </p>

            {/* Masonry "brick wall" — varied-height bricks packed with no gaps */}
            <div className="gallery-grid" style={{ columnCount: 3, columnGap: "2px" }}>
              {lbImages.map((img, i) => (
                <GalleryCell key={i} image={img} index={i} aspect={GALLERY_ASPECTS[i % GALLERY_ASPECTS.length]} onClick={() => openLightbox(i)} />
              ))}
            </div>
          </section>
        )}

        {/* Video */}
        <section ref={videoReveal.ref} style={{ ...revealStyle(videoReveal.visible), marginBottom: "5rem" }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "2rem" }}>
            {t("video")}
          </p>

          {work.videos.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "860px" }}>
              {work.videos.map((v, i) => {
                const embed = toEmbedUrl(v.url);
                return (
                  <div key={i}>
                    <div style={{ aspectRatio: "16/9", backgroundColor: "var(--bg-surface)", overflow: "hidden" }}>
                      {embed ? (
                        <iframe
                          src={embed}
                          title={v.label || `Видео ${i + 1}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ width: "100%", height: "100%", border: 0 }}
                        />
                      ) : (
                        <a href={v.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                          {v.url} ↗
                        </a>
                      )}
                    </div>
                    {v.label && <p style={{ marginTop: "0.75rem", fontSize: "0.7rem", color: "var(--text-secondary)", letterSpacing: "0.06em" }}>{v.label}</p>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ maxWidth: "860px", aspectRatio: "16/9", backgroundColor: "var(--bg-surface)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
              <span style={{ width: "64px", height: "64px", border: "1px solid rgba(237,237,237,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden="true">
                  <path d="M2 1L16 10L2 19V1Z" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
              <span style={{ fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
                YouTube / Vimeo — добавить через Sanity
              </span>
            </div>
          )}
        </section>

        {/* Related press */}
        {work.press.length > 0 && (
          <section ref={pressReveal.ref} style={revealStyle(pressReveal.visible)}>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "2rem" }}>
              {t("press_about")}
            </p>

            <div>
              {work.press.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: "2rem",
                    padding: "1.25rem 0",
                    borderBottom: "1px solid rgba(237,237,237,0.05)",
                    borderTop: i === 0 ? "1px solid rgba(237,237,237,0.05)" : "none",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.0625rem", fontWeight: 300, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: "0.65rem", color: "rgba(237,237,237,0.2)", letterSpacing: "0.06em" }}>
                      {[item.source, item.date].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="u-link" style={{ fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-secondary)", textDecoration: "none", whiteSpace: "nowrap" }}>
                      Читать ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .work-header { grid-template-columns: 3fr 1fr !important; }
        }
        @media (max-width: 639px) {
          .gallery-grid { column-count: 2 !important; }
        }
      `}</style>
    </>
  );
}

function GalleryCell({ image, index, aspect, onClick }: { image: LightboxImage; index: number; aspect: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Открыть фото: ${image.alt}`}
      style={{
        display: "block",
        width: "100%",
        marginBottom: "2px",
        breakInside: "avoid",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        aspectRatio: aspect,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <LazyImage src={image.src || undefined} alt={image.alt} placeholderLabel={String(index + 1).padStart(2, "0")} style={{ position: "absolute", inset: 0 }} />

      <span
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(10,10,10,0.3)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 250ms var(--ease-out-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" stroke="rgba(237,237,237,0.6)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </span>

      {index === 0 && (
        <span style={{ position: "absolute", top: "0.75rem", left: "0.75rem", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "var(--accent)" }} />
      )}
    </button>
  );
}
