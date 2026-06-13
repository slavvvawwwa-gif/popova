"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useReveal, revealStyle } from "@/components/useReveal";
import { useCursorPreview } from "@/components/CursorPreview";
import LazyImage from "@/components/LazyImage";
import { smoothScrollTo } from "@/lib/smoothScroll";
import { byProximity } from "@/lib/sort";
import { useState } from "react";
import type { WorkCard } from "@/sanity/lib/data";

// Bento span pattern (12-col grid) — varied tile sizes, dense packing.
const SPANS: { c: number; r: number }[] = [
  { c: 6, r: 2 },
  { c: 3, r: 1 },
  { c: 3, r: 1 },
  { c: 4, r: 2 },
  { c: 4, r: 1 },
  { c: 4, r: 1 },
];

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
  const basePath = `/${section}`;
  const headerReveal = useReveal();
  const listReveal = useReveal(100);

  const [activeYear, setActiveYear] = useState<number | null>(null);

  const years = [...new Set(works.map((w) => w.year).filter((y): y is number => y !== null))].sort((a, b) => b - a);

  const selectYear = (year: number | null) => {
    setActiveYear(year);
    smoothScrollTo("works-results", 96);
  };

  const filtered = activeYear ? works.filter((w) => w.year === activeYear) : works;
  // #8 — current items ordered by closeness to "now"
  const current = byProximity(filtered.filter((w) => w.status === "current"));
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
          {/* #3 — "Текущие" heading only for спектакли */}
          {section === "works" && (
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "2rem" }}>
              {t("current")}
            </p>
          )}

          {/* #9 — dense bento: varied tile sizes, covers fill cells, no gaps */}
          <div className="works-bento">
            {current.map((work, i) => {
              const s = SPANS[i % SPANS.length];
              return <GridCard key={work.slug} work={work} index={i} basePath={basePath} colSpan={s.c} rowSpan={s.r} />;
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
              {["—", t("title"), t("theatre"), t("filter_year")].map((h) => (
                <span key={h} style={{ fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(237,237,237,0.2)" }}>
                  {h}
                </span>
              ))}
            </div>

            {archive.map((work, i) => (
              <ArchiveRow key={work.slug} work={work} index={i} basePath={basePath} />
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
        .works-bento {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-auto-rows: clamp(120px, 12vw, 200px);
          grid-auto-flow: dense;
          gap: 2px;
        }
        @media (max-width: 1023px) { .works-bento { grid-auto-rows: clamp(120px, 22vw, 200px); } }
        @media (max-width: 599px) {
          .works-bento { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 42vw; }
          .works-bento > .bento-item { grid-column: span 2 !important; grid-row: span 1 !important; }
        }
        @media (max-width: 767px) {
          .archive-row { grid-template-columns: 50px 1fr !important; }
          .archive-row span:nth-child(3),
          .archive-row span:nth-child(4) { display: none; }
        }
      `}</style>
    </div>
  );
}

function GridCard({
  work,
  index,
  basePath,
  colSpan,
  rowSpan,
}: {
  work: WorkCard;
  index: number;
  basePath: string;
  colSpan: number;
  rowSpan: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`${basePath}/${work.slug}`}
      className="bento-item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: "none",
        display: "block",
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        cursor: "pointer",
      }}
    >
      <article style={{ position: "relative", overflow: "hidden", backgroundColor: "var(--bg-surface)", width: "100%", height: "100%" }}>
        {/* Cover fills the cell (object-fit cover); scales on hover */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 600ms var(--ease-out-expo)",
          }}
        >
          <LazyImage
            src={work.coverUrl ?? undefined}
            alt={work.title}
            placeholderLabel={String(index + 1).padStart(2, "0")}
            style={{ position: "absolute", inset: 0 }}
          />
        </span>

        {/* Bottom scrim for legibility */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 45%, transparent 72%)",
            opacity: hovered ? 1 : 0.92,
            transition: "opacity 420ms var(--ease-out-expo)",
          }}
        />

        {/* Accent bar grows on hover */}
        <span style={{ position: "absolute", bottom: 0, left: 0, width: "2px", height: hovered ? "100%" : "0%", backgroundColor: "var(--accent)", transition: "height 300ms var(--ease-out-soft)", zIndex: 2 }} />

        <span style={{ position: "absolute", top: "var(--space-4)", right: "var(--space-4)", fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-primary)", zIndex: 2 }}>
          {work.year}
        </span>

        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "var(--space-6)", zIndex: 2 }}>
          <p style={{ fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
            {work.theatre}
          </p>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.25rem, 2.4vw, 2rem)", fontWeight: 300, lineHeight: 1.05, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
            {work.title}
          </h2>
          {work.genre && (
            <span style={{ fontSize: "0.55rem", letterSpacing: "0.14em", textTransform: "uppercase", color: hovered ? "var(--accent)" : "var(--text-secondary)", transition: "color 250ms var(--ease-out-soft)" }}>
              {work.genre}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}

function ArchiveRow({ work, index, basePath }: { work: WorkCard; index: number; basePath: string }) {
  const [hovered, setHovered] = useState(false);
  const preview = useCursorPreview();
  const isStatic = preview.mode === "static";

  return (
    <Link
      href={`${basePath}/${work.slug}`}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => {
        setHovered(true);
        // #3: hover uses the dedicated vertical preview image (falls back to cover)
        preview.show({ label: work.title, src: work.previewUrl ?? work.coverUrl ?? undefined });
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
