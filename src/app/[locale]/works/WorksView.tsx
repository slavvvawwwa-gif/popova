"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useReveal, revealStyle } from "@/components/useReveal";
import { useCursorPreview } from "@/components/CursorPreview";
import LazyImage from "@/components/LazyImage";
import { smoothScrollTo } from "@/lib/smoothScroll";
import { useState } from "react";
import type { WorkCard } from "@/sanity/lib/data";

// Varied aspect ratios — combined with alternating 7/5 column widths this
// keeps the bento visually heterogeneous (no repeated identical card).
const BENTO_ASPECTS = ["3/2", "4/5", "16/9", "1/1", "5/4", "3/4"];

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        padding: "0.25rem 0",
        fontSize: "0.65rem",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
        cursor: "pointer",
        borderBottom: active ? "1px solid var(--accent)" : "1px solid transparent",
        paddingBottom: "3px",
        transition: "color 200ms var(--ease-out-soft), border-color 200ms var(--ease-out-soft)",
      }}
    >
      {children}
    </button>
  );
}

export default function WorksView({
  works,
  section = "works",
}: {
  works: WorkCard[];
  section?: "works" | "projects" | "lab";
}) {
  const t = useTranslations(section);
  const headerReveal = useReveal();
  const listReveal = useReveal(100);

  const [activeYear, setActiveYear] = useState<number | null>(null);

  const years = [...new Set(works.map((w) => w.year).filter((y): y is number => y !== null))].sort((a, b) => b - a);

  const selectYear = (year: number | null) => {
    setActiveYear(year);
    smoothScrollTo("works-results", 96);
  };

  const filtered = activeYear ? works.filter((w) => w.year === activeYear) : works;
  const current = filtered.filter((w) => w.status === "current");
  const archive = filtered.filter((w) => w.status === "archive");

  return (
    <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "5rem 2rem 6rem" }}>
      <header
        ref={headerReveal.ref}
        style={{
          ...revealStyle(headerReveal.visible),
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "1.5rem",
          marginBottom: "3.5rem",
          borderBottom: "1px solid rgba(237,237,237,0.06)",
          paddingBottom: "2rem",
        }}
      >
        <p style={{ fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
          {t("title")}
        </p>

        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "baseline" }}>
          <FilterButton active={activeYear === null} onClick={() => selectYear(null)}>
            {t("filter_all")}
          </FilterButton>
          {years.map((year) => (
            <FilterButton key={year} active={activeYear === year} onClick={() => selectYear(year)}>
              {year}
            </FilterButton>
          ))}
        </div>
      </header>

      <span id="works-results" style={{ position: "absolute" }} aria-hidden="true" />

      {/* Current */}
      {current.length > 0 && (
        <section ref={listReveal.ref} style={{ ...revealStyle(listReveal.visible), marginBottom: "5rem" }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "2rem" }}>
            {t("current")}
          </p>

          {/* Asymmetric bento: alternating 7/5 column widths + varied aspect.
              Last lone card spans full width. First card bleeds into the
              left gutter (grid-break, QUALITY_DIRECTIVES §4 item 1). */}
          <div className="works-bento" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "2px" }}>
            {current.map((work, i) => {
              const pair = Math.floor(i / 2);
              const pos = i % 2;
              const lone = i === current.length - 1 && current.length % 2 === 1;
              const colSpan = lone ? 12 : pair % 2 === 0 ? (pos === 0 ? 7 : 5) : pos === 0 ? 5 : 7;
              const aspect = BENTO_ASPECTS[i % BENTO_ASPECTS.length];
              return <GridCard key={work.slug} work={work} index={i} colSpan={colSpan} aspect={aspect} bleed={i === 0} />;
            })}
          </div>
        </section>
      )}

      {/* Archive */}
      {archive.length > 0 && (
        <section>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "2rem" }}>
            {t("archive")}
          </p>

          <div>
            <div
              className="archive-row"
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 180px 100px",
                gap: "2rem",
                padding: "0.75rem 0",
                borderBottom: "1px solid rgba(237,237,237,0.1)",
                marginBottom: "0.25rem",
              }}
            >
              {["—", t("title"), "Театр", t("filter_year")].map((h) => (
                <span key={h} style={{ fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(237,237,237,0.2)" }}>
                  {h}
                </span>
              ))}
            </div>

            {archive.map((work, i) => (
              <ArchiveRow key={work.slug} work={work} index={i} />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontStyle: "italic", color: "var(--text-secondary)" }}>
          {t("no_results")}
        </p>
      )}

      <style>{`
        @media (max-width: 767px) {
          .works-bento { grid-template-columns: 1fr !important; }
          .works-bento > .bento-item { grid-column: 1 / -1 !important; margin-left: 0 !important; }
          .archive-row { grid-template-columns: 50px 1fr !important; }
          .archive-row span:nth-child(3),
          .archive-row span:nth-child(4) { display: none; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .works-bento { grid-template-columns: repeat(2, 1fr) !important; }
          .works-bento > .bento-item { grid-column: auto !important; margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}

function GridCard({
  work,
  index,
  colSpan,
  aspect,
  bleed,
}: {
  work: WorkCard;
  index: number;
  colSpan: number;
  aspect: string;
  bleed: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/works/${work.slug}`}
      className="bento-item"
      style={{
        textDecoration: "none",
        display: "block",
        gridColumn: `span ${colSpan}`,
        marginLeft: bleed ? "calc(var(--space-6) * -1)" : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <article
        style={{
          aspectRatio: aspect,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "var(--space-6)",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          backgroundColor: "var(--bg-surface)",
          borderRadius: 0,
        }}
      >
        {/* Cover — scales up on hover (420ms expo) */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 420ms var(--ease-out-expo)",
          }}
        >
          <LazyImage src={work.coverUrl ?? undefined} alt={work.title} style={{ position: "absolute", inset: 0 }} />
        </span>

        {/* Scrim 0 → .35 */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(10,10,10,0.35)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 420ms var(--ease-out-expo)",
          }}
        />

        {/* Decorative index numeral — shifts up + brightens on hover */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "var(--space-3)",
            bottom: "var(--space-12)",
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(3.5rem, 7vw, 6rem)",
            fontWeight: 300,
            lineHeight: 1,
            color: hovered ? "rgba(237,237,237,0.09)" : "rgba(237,237,237,0.05)",
            transform: hovered ? "translateY(-6px)" : "translateY(0)",
            transition: "transform 400ms var(--ease-out-soft), color 400ms var(--ease-out-soft)",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span style={{ position: "absolute", top: "var(--space-4)", right: "var(--space-4)", fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-secondary)", zIndex: 2 }}>
          {work.year}
        </span>

        {/* Single accent signal — full-height bar grows on hover */}
        <span
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "2px",
            height: hovered ? "100%" : "0%",
            backgroundColor: "var(--accent)",
            transition: "height 300ms var(--ease-out-soft)",
            zIndex: 2,
          }}
        />

        <p style={{ position: "relative", zIndex: 2, fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
          {work.theatre}
        </p>
        <h2 style={{ position: "relative", zIndex: 2, fontFamily: "var(--font-serif)", fontSize: "clamp(1.25rem, 2.4vw, 2rem)", fontWeight: 300, lineHeight: 1.05, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          {work.title}
        </h2>
        {work.genre && (
          <span style={{ position: "relative", zIndex: 2, fontSize: "0.55rem", letterSpacing: "0.14em", textTransform: "uppercase", color: hovered ? "var(--accent)" : "var(--text-secondary)", transition: "color 250ms var(--ease-out-soft)" }}>
            {work.genre}
          </span>
        )}
      </article>
    </Link>
  );
}

function ArchiveRow({ work, index }: { work: WorkCard; index: number }) {
  const [hovered, setHovered] = useState(false);
  const preview = useCursorPreview();
  const isStatic = preview.mode === "static";

  return (
    <Link
      href={`/works/${work.slug}`}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => {
        setHovered(true);
        preview.show({ label: work.title, src: work.coverUrl ?? undefined });
      }}
      onMouseLeave={() => {
        setHovered(false);
        preview.hide();
      }}
    >
      <div
        className="archive-row"
        style={{
          display: "grid",
          gridTemplateColumns: "60px 1fr 180px 100px",
          gap: "2rem",
          alignItems: "center",
          padding: "1.25rem 0",
          borderBottom: "1px solid rgba(237,237,237,0.04)",
          cursor: "pointer",
          transition: "opacity 200ms var(--ease-out-soft)",
          opacity: hovered ? 1 : 0.65,
        }}
      >
        <span style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 300, color: "var(--text-secondary)" }}>
          {work.year}
        </span>

        <span style={{ display: "flex", alignItems: "center", gap: "1rem", minWidth: 0 }}>
          {isStatic && (
            <span
              aria-hidden="true"
              style={{
                flexShrink: 0,
                width: "44px",
                height: "44px",
                backgroundColor: "var(--bg-surface)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-serif)",
                fontSize: "0.75rem",
                color: "rgba(237,237,237,0.2)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {work.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={work.coverUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                String(index + 1).padStart(2, "0")
              )}
              <span style={{ position: "absolute", left: 0, bottom: 0, width: "2px", height: "100%", backgroundColor: "var(--accent)" }} />
            </span>
          )}
          <span
            className="u-link"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
              fontWeight: 300,
              color: hovered ? "var(--text-primary)" : "var(--text-secondary)",
              transition: "color 200ms var(--ease-out-soft)",
            }}
          >
            {work.title}
          </span>
        </span>

        <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", letterSpacing: "0.04em" }}>{work.theatre}</span>
        <span style={{ fontSize: "0.55rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-secondary)" }}>{work.genre}</span>
      </div>
    </Link>
  );
}
