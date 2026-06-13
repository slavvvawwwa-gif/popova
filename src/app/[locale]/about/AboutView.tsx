"use client";

import { useTranslations } from "next-intl";
import { useReveal, revealStyle } from "@/components/useReveal";
import PhotoStack from "@/components/PhotoStack";
import SectionHead from "@/components/SectionHead";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { BioData } from "@/sanity/lib/data";
import type { PortableTextBlock } from "@portabletext/react";

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="body" style={{ marginBottom: "var(--space-6)" }}>
        {children}
      </p>
    ),
  },
  marks: {
    em: ({ children }) => <em style={{ color: "var(--text-primary)" }}>{children}</em>,
    strong: ({ children }) => <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>{children}</strong>,
  },
};

export default function AboutView({ bio }: { bio: BioData }) {
  const t = useTranslations("about");
  const headerReveal = useReveal();
  const bioReveal = useReveal(100);
  const timelineReveal = useReveal(200);

  // Split name into two lines for the editorial heading
  const [firstName, ...rest] = (bio.name || "Имя Фамилия").split(" ");
  const lastName = rest.join(" ");

  return (
    <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "5rem 2rem 6rem" }}>
      <header ref={headerReveal.ref} style={{ ...revealStyle(headerReveal.visible), marginBottom: "var(--space-16)" }}>
        <SectionHead rule>{t("title")}</SectionHead>
      </header>

      <div
        ref={bioReveal.ref}
        style={{ ...revealStyle(bioReveal.visible, 80), display: "grid", gridTemplateColumns: "1fr", gap: "4rem" }}
        className="about-grid"
      >
        {/* Photo column */}
        <div className="about-photo-col">
          <PhotoStack
            main={{ url: bio.photoUrl, alt: bio.name || "Портрет" }}
            photos={bio.gallery}
            label={bio.name || "Галерея"}
          />

          <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { label: t("download_cv") + " (RU)", file: bio.cvRu ?? "/cv-ru.pdf" },
              { label: t("download_cv") + " (EN)", file: bio.cvEn ?? "/cv-en.pdf" },
            ].map((cv) => (
              <a
                key={cv.label}
                href={cv.file}
                download
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.65rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  cursor: "pointer",
                  width: "fit-content",
                }}
              >
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                  <path d="M6 1v8M2 9l4 4 4-4M1 13h10" stroke="currentColor" strokeWidth="1" />
                </svg>
                {cv.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bio column */}
        <div className="about-bio-col">
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              fontWeight: 300,
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              marginBottom: "3rem",
            }}
          >
            {firstName}
            {lastName && (
              <>
                <br />
                <em style={{ color: "var(--text-secondary)" }}>{lastName}</em>
              </>
            )}
          </h1>

          {bio.role && (
            <SectionHead accent style={{ marginBottom: "var(--space-8)" }}>
              {bio.role}
            </SectionHead>
          )}

          <div className="measure">
            {bio.text ? (
              <PortableText value={bio.text as PortableTextBlock[]} components={ptComponents} />
            ) : (
              <>
                <p className="body" style={{ marginBottom: "var(--space-6)" }}>
                  {t("bio_placeholder")}
                </p>
                <p className="body">
                  Окончил режиссёрский факультет ГИТИСа. Работал в ведущих театрах России и Европы.
                  Лауреат национальных и международных театральных премий.
                </p>
              </>
            )}
          </div>

          {/* Timeline */}
          {bio.timeline.length > 0 && (
            <div ref={timelineReveal.ref} style={{ ...revealStyle(timelineReveal.visible, 120), marginTop: "var(--space-16)" }}>
              <SectionHead style={{ marginBottom: "var(--space-8)" }}>{t("timeline_label")}</SectionHead>

              {bio.timeline.map((item, i) => (
                <div
                  key={item.year + i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1fr",
                    gap: "2.5rem",
                    alignItems: "baseline",
                    padding: "1.75rem 0",
                    borderBottom: "1px solid rgba(237,237,237,0.05)",
                    borderTop: i === 0 ? "1px solid rgba(237,237,237,0.05)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.375rem",
                      fontWeight: 300,
                      color: i === 0 ? "var(--accent)" : "var(--text-secondary)",
                    }}
                  >
                    {item.year}
                  </span>
                  <p className="body" style={{ fontSize: "0.875rem", lineHeight: 1.7 }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .about-grid { grid-template-columns: 320px 1fr !important; }
        }
      `}</style>
    </div>
  );
}
