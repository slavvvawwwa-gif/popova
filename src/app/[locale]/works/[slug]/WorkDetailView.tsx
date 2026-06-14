"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useReveal, revealStyle } from "@/components/useReveal";
import { useCursorPreview } from "@/components/CursorPreview";
import Lightbox, { type LightboxImage } from "@/components/Lightbox";
import LazyImage from "@/components/LazyImage";
import { spanFor } from "@/lib/bento";
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react";
import { useState, useCallback } from "react";
import type { WorkDetail, GalleryImg } from "@/sanity/lib/data";

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

function fmtPremiere(iso: string, locale: "ru" | "en") {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale === "en" ? "en-GB" : "ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function WorkDetailView({
  work,
  basePath = "/works",
}: {
  work: WorkDetail;
  basePath?: string;
}) {
  const t = useTranslations("work");
  const tc = useTranslations("common");
  const locale = useLocale() as "ru" | "en";
  const preview = useCursorPreview();

  // Back goes to the parent (if this is a sub-entity) or the section list.
  const backHref = work.parentSlug ? `${basePath}/${work.parentSlug}` : basePath;

  const headerReveal = useReveal();
  const descReveal = useReveal(80);
  const videoReveal = useReveal(160);
  const pressReveal = useReveal(200);

  return (
    <>
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "5rem 2rem 6rem" }}>
        <Link
          href={backHref}
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
              { label: t("premiere"), value: fmtPremiere(work.premiere, locale) },
              { label: t("genre"), value: work.genre },
              { label: t("role"), value: work.role },
              { label: t("playwright"), value: work.playwright },
              { label: t("artist"), value: work.artist },
              { label: t("lighting"), value: work.lightingDesigner },
              { label: t("set_designer"), value: work.setDesigner },
              { label: t("composer"), value: work.composer },
              { label: t("choreographer"), value: work.choreographer },
              { label: t("performers"), value: work.performers },
            ]
              .filter((r) => r.value)
              .map((row) => <MetaRow key={row.label} label={row.label} value={row.value} />)}

            {/* "Дополнительно" — at the bottom of the credits block, justified */}
            {work.creditsExtra && (
              <div style={{ paddingTop: "1.25rem" }}>
                <span style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "0.6rem" }}>
                  {t("extra")}
                </span>
                <p
                  className="body"
                  style={{ fontSize: "0.8rem", lineHeight: 1.7, textAlign: "justify", textJustify: "inter-word", hyphens: "auto", whiteSpace: "pre-line" }}
                >
                  {work.creditsExtra}
                </p>
              </div>
            )}
          </div>
        </header>

        {/* Cover — full viewport width (breaks out of the 1440 container) */}
        <div style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", marginBottom: "4rem" }}>
          <LazyImage
            src={work.coverUrl ?? undefined}
            alt={`${work.title} — обложка`}
            placeholderLabel={work.title}
            aspectRatio="16/7"
            style={{ width: "100%" }}
          />
        </div>

        {/* Full description — justified, accent drop cap on first letter */}
        <section ref={descReveal.ref} className="work-desc" style={{ ...revealStyle(descReveal.visible), maxWidth: "720px", marginBottom: work.creditsExtra ? "2.5rem" : "5rem" }}>
          {work.fullDescription ? (
            <PortableText value={work.fullDescription as PortableTextBlock[]} components={ptComponents} />
          ) : (
            <p className="body" style={{ lineHeight: 1.9 }}>
              {locale === "en"
                ? "A full description will appear here once added in the CMS."
                : "Полное описание появится здесь после наполнения через CMS."}
            </p>
          )}
        </section>

        {/* Free-form content blocks (projects / labs): text / gallery in order.
            Additional text blocks alternate left / right on desktop (#). */}
        {work.content.map((block, i) => {
          if (block.kind === "text") {
            const textIdx = work.content.slice(0, i).filter((b) => b.kind === "text").length;
            return <ContentText key={i} body={block.body} align={textIdx % 2 === 1 ? "right" : "left"} locale={locale} />;
          }
          return (
            <section key={i} style={{ marginBottom: "5rem" }}>
              <GalleryBlock images={block.images} />
            </section>
          );
        })}

        {/* Sub-entities (releases) for projects / labs */}
        {work.children.length > 0 && (
          <section style={{ marginBottom: "5rem" }}>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "2rem" }}>
              {t("releases")}
            </p>
            <div>
              {work.children.map((c, i) => (
                <Link
                  key={c.slug}
                  href={`${basePath}/${c.slug}`}
                  className="child-row"
                  onMouseEnter={() => preview.show({ label: c.title, src: c.previewUrl ?? c.coverUrl ?? undefined })}
                  onMouseLeave={() => preview.hide()}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "72px 1fr auto",
                    gap: "1.5rem",
                    alignItems: "baseline",
                    padding: "1.25rem 0",
                    borderTop: i === 0 ? "1px solid rgba(237,237,237,0.1)" : "none",
                    borderBottom: "1px solid rgba(237,237,237,0.05)",
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", color: "var(--text-secondary)" }}>
                    {c.year ?? ""}
                  </span>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.05rem, 1.8vw, 1.4rem)", fontWeight: 300, color: "var(--text-primary)" }}>
                    {c.title}
                  </span>
                  <span style={{ fontSize: "0.55rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-secondary)", textAlign: "right" }}>
                    {c.genre}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Main gallery */}
        {work.gallery.length > 0 && (
          <section style={{ marginBottom: "5rem" }}>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "2rem" }}>
              {t("gallery")}
            </p>
            <GalleryBlock images={work.gallery} />
          </section>
        )}

        {/* Video — rendered only when at least one video is present */}
        {work.videos.length > 0 && (
          <section ref={videoReveal.ref} style={{ ...revealStyle(videoReveal.visible), marginBottom: "5rem" }}>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "2rem" }}>
              {t("video")}
            </p>

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
          </section>
        )}

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
                      {locale === "en" ? "Read ↗" : "Читать ↗"}
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
      `}</style>
    </>
  );
}

function GalleryBlock({ images }: { images: GalleryImg[] }) {
  const reveal = useReveal(80);
  const lb: LightboxImage[] = images.map((g) => ({ src: g.url ?? "", alt: g.alt, caption: g.caption }));
  const [idx, setIdx] = useState<number | null>(null);
  const close = useCallback(() => setIdx(null), []);
  const prev = useCallback(() => setIdx((i) => (i === null ? null : (i - 1 + lb.length) % lb.length)), [lb.length]);
  const next = useCallback(() => setIdx((i) => (i === null ? null : (i + 1) % lb.length)), [lb.length]);
  if (!images.length) return null;
  return (
    <div ref={reveal.ref} style={revealStyle(reveal.visible)}>
      {idx !== null && <Lightbox images={lb} index={idx} onClose={close} onPrev={prev} onNext={next} />}
      <div className="bento-grid">
        {lb.map((img, i) => {
          const s = spanFor(i);
          return <GalleryCell key={i} image={img} index={i} colSpan={s.c} rowSpan={s.r} onClick={() => setIdx(i)} />;
        })}
      </div>
    </div>
  );
}

function ContentText({ body, align, locale }: { body: unknown[] | null; align: "left" | "right"; locale: "ru" | "en" }) {
  const reveal = useReveal(80);
  return (
    <section
      ref={reveal.ref}
      className={`work-desc${align === "right" ? " content-text--right" : ""}`}
      style={{ ...revealStyle(reveal.visible), maxWidth: "720px", marginBottom: "var(--space-12)" }}
    >
      {body ? (
        <PortableText value={body as PortableTextBlock[]} components={ptComponents} />
      ) : (
        <p className="body" style={{ lineHeight: 1.9 }}>
          {locale === "en" ? "Text block — add content in the CMS." : "Текстовый блок — добавьте содержимое в CMS."}
        </p>
      )}
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", padding: "0.875rem 0", borderBottom: "1px solid rgba(237,237,237,0.05)" }}
    >
      <span style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: h ? "var(--accent)" : "var(--text-primary)", transition: "color 200ms var(--ease-out-soft)" }}>
        {label}
      </span>
      <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function GalleryCell({ image, index, colSpan, rowSpan, onClick }: { image: LightboxImage; index: number; colSpan: number; rowSpan: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Открыть фото: ${image.alt}`}
      className="bento-item"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span style={{ position: "absolute", inset: 0, transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform 600ms var(--ease-out-expo)" }}>
        <LazyImage src={image.src || undefined} alt={image.alt} placeholderLabel={String(index + 1).padStart(2, "0")} style={{ position: "absolute", inset: 0 }} />
      </span>

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
