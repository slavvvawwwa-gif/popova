"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import LazyImage from "@/components/LazyImage";
import type { WorkCard as WorkCardData, HomeContent } from "@/sanity/lib/data";

const SECTION_PATH: Record<string, string> = {
  performance: "/works",
  project: "/projects",
  lab: "/lab",
};
const hrefFor = (c?: WorkCardData | null) =>
  c ? `${SECTION_PATH[c.kind] ?? "/works"}/${c.slug}` : "/works";

/* ─── Scroll-reveal hook ──────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion — show immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ─── Featured card ───────────────────────────────────────────────── */
function WorkCard({
  href,
  title,
  theatre,
  year,
  genre,
  index,
  coverUrl,
  style: extraStyle,
}: {
  href: string;
  title: React.ReactNode;
  theatre: string;
  year: string;
  genre: string;
  index: number;
  coverUrl?: string;
  style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      style={{ textDecoration: "none", display: "block", height: "100%", ...extraStyle }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <article
        style={{
          height: "100%",
          backgroundColor: "var(--bg-surface)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "2rem",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        {/* Cover image — scales on hover */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 600ms var(--ease-out-expo)",
          }}
        >
          <LazyImage
            src={coverUrl}
            alt={typeof title === "string" ? title : ""}
            placeholderLabel={["I", "II", "III"][index]}
            style={{ position: "absolute", inset: 0 }}
          />
        </span>

        {/* Scrim for text legibility (stronger on hover) */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(10,10,10,0.78) 0%, rgba(10,10,10,0.32) 45%, rgba(10,10,10,0.12) 100%)",
            opacity: hovered ? 1 : 0.85,
            transition: "opacity 420ms var(--ease-out-expo)",
          }}
        />

        {/* Year — top right */}
        <span
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            zIndex: 2,
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
          }}
        >
          {year}
        </span>

        {/* Accent marker — bottom left edge, only on hover */}
        <span
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 2,
            width: "2px",
            height: hovered ? "40%" : "0%",
            backgroundColor: "var(--accent)",
            transition: "height 300ms var(--ease-out-soft)",
          }}
        />

        <p
          style={{
            position: "relative",
            zIndex: 2,
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
            marginBottom: "0.5rem",
          }}
        >
          {theatre}
        </p>

        <h3
          style={{
            position: "relative",
            zIndex: 2,
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "var(--text-primary)",
            marginBottom: "0.75rem",
          }}
        >
          {title}
        </h3>

        <span
          style={{
            position: "relative",
            zIndex: 2,
            fontSize: "0.6rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: hovered ? "var(--accent)" : "var(--text-secondary)",
            transition: "color 250ms var(--ease-out-soft)",
          }}
        >
          {genre}
        </span>
      </article>
    </Link>
  );
}

/* ─── Page ────────────────────────────────────────────────────────── */
export default function HomeView({
  hero,
  featured,
}: {
  hero: HomeContent;
  featured: WorkCardData[];
}) {
  const t = useTranslations("home");
  const tn = useTranslations("nav");

  const heroReveal = useReveal();
  const featuredReveal = useReveal();

  // Map up to three featured works onto the bespoke A/B/C layout.
  const cards = [0, 1, 2].map((i) => featured[i] ?? null);

  return (
    <>
      {/* ══════════════════ HERO ══════════════════════════════════ */}
      <section
        ref={heroReveal.ref as React.RefObject<HTMLElement>}
        style={{
          minHeight: "100svh",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "0 2rem",
          display: "grid",
          gridTemplateColumns: "1fr",
          alignItems: "center",
          position: "relative",
          opacity: heroReveal.visible ? 1 : 0,
          transform: heroReveal.visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 800ms var(--ease-out-expo), transform 800ms var(--ease-out-expo)",
        }}
      >
        {/* Top rule + label */}
        <div
          style={{
            position: "absolute",
            top: "5rem",
            left: "2rem",
            right: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <span
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--accent)",
              whiteSpace: "nowrap",
            }}
          >
            {hero.label}
          </span>
          <span
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "rgba(237,237,237,0.08)",
            }}
          />
        </div>

        {/* Main name block */}
        <div style={{ paddingTop: "2rem" }}>
          <h1
            className="display"
            style={{
              fontSize: "clamp(3.5rem, 11vw, 8.5rem)",
              lineHeight: 0.9,
              color: "var(--text-primary)",
              marginBottom: "0",
            }}
          >
            {hero.name}
          </h1>

          {/* Tagline row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "3rem",
              marginTop: "3rem",
              flexWrap: "wrap",
            }}
          >
            <p
              className="body"
              style={{
                fontSize: "clamp(0.875rem, 1.4vw, 1.0625rem)",
                maxWidth: "400px",
                lineHeight: 1.7,
              }}
            >
              {hero.tagline}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link
                href="/works"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "1rem",
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  paddingBottom: "3px",
                  borderBottom: "1px solid rgba(237,237,237,0.3)",
                  whiteSpace: "nowrap",
                  transition: "border-color 200ms var(--ease-out-soft), color 200ms var(--ease-out-soft)",
                }}
              >
                {t("hero_cta")}
                <svg
                  width="28"
                  height="8"
                  viewBox="0 0 28 8"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 4H26M22 1L26 4L22 7"
                    stroke="currentColor"
                    strokeWidth="0.8"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom-right decorative counter */}
        <div
          style={{
            position: "absolute",
            bottom: "3rem",
            right: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "0.25rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
            }}
          >
            — 01
          </span>
          <span
            style={{
              width: "1px",
              height: "40px",
              backgroundColor: "rgba(237,237,237,0.1)",
            }}
          />
        </div>

        {/* Large ghost serif number — decorative, desktop only */}
        <span
          aria-hidden="true"
          className="hidden lg:block"
          style={{
            position: "absolute",
            right: "-0.5rem",
            bottom: "4rem",
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(10rem, 20vw, 18rem)",
            fontWeight: 300,
            lineHeight: 1,
            color: "rgba(237,237,237,0.025)",
            userSelect: "none",
            pointerEvents: "none",
            letterSpacing: "-0.04em",
          }}
        >
          I
        </span>
      </section>

      {/* ══════════════════ FEATURED WORKS ═══════════════════════ */}
      <section
        ref={featuredReveal.ref as React.RefObject<HTMLElement>}
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "0 2rem 4rem",
          borderTop: "1px solid rgba(237,237,237,0.06)",
          paddingTop: "3rem",
          opacity: featuredReveal.visible ? 1 : 0,
          transform: featuredReveal.visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 700ms var(--ease-out-expo) 100ms, transform 700ms var(--ease-out-expo) 100ms",
        }}
      >
        {/* Section header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
            }}
          >
            {t("featured_label")}
          </p>
          <Link
            href="/works"
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(237,237,237,0.15)",
              paddingBottom: "1px",
              transition: "color 200ms var(--ease-out-soft), border-color 200ms var(--ease-out-soft)",
            }}
          >
            {tn("works")} →
          </Link>
        </div>

        {/*
          Desktop grid — named areas:
          ┌─────────────────────────┬──────────────────┐
          │                         │      card-b       │
          │         card-a          ├──────────────────┤
          │     (tall, 2 rows)      │      card-c       │
          └─────────────────────────┴──────────────────┘
          Columns: 60% | 40%
          Rows: ~260px | ~260px  (equal halves)
        */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "60% 40%",
            gridTemplateRows: "260px 260px",
            gridTemplateAreas: `"card-a card-b" "card-a card-c"`,
            gap: "2px",
          }}
          className="featured-grid"
        >
          <div style={{ gridArea: "card-a" }}>
            <WorkCard
              href={hrefFor(cards[0])}
              title={cards[0]?.title ?? "—"}
              theatre={cards[0]?.theatre ?? ""}
              year={cards[0]?.year ? String(cards[0].year) : ""}
              genre={cards[0]?.genre ?? ""}
              coverUrl={cards[0]?.coverUrl ?? undefined}
              index={0}
              style={{ minHeight: "100%" }}
            />
          </div>
          <div style={{ gridArea: "card-b" }}>
            <WorkCard
              href={hrefFor(cards[1])}
              title={cards[1]?.title ?? "—"}
              theatre={cards[1]?.theatre ?? ""}
              year={cards[1]?.year ? String(cards[1].year) : ""}
              genre={cards[1]?.genre ?? ""}
              coverUrl={cards[1]?.coverUrl ?? undefined}
              index={1}
            />
          </div>
          <div style={{ gridArea: "card-c" }}>
            <WorkCard
              href={hrefFor(cards[2])}
              title={cards[2]?.title ?? "—"}
              theatre={cards[2]?.theatre ?? ""}
              year={cards[2]?.year ? String(cards[2].year) : ""}
              genre={cards[2]?.genre ?? ""}
              coverUrl={cards[2]?.coverUrl ?? undefined}
              index={2}
              style={{ backgroundColor: "#141414" }}
            />
          </div>
        </div>

        <style>{`
          @media (max-width: 639px) {
            .featured-grid {
              grid-template-columns: 1fr !important;
              grid-template-rows: 300px 220px 220px !important;
              grid-template-areas:
                "card-a"
                "card-b"
                "card-c" !important;
            }
          }
          @media (min-width: 640px) and (max-width: 1023px) {
            .featured-grid {
              grid-template-columns: 55% 45% !important;
              grid-template-rows: 240px 240px !important;
            }
          }
        `}</style>
      </section>
    </>
  );
}
