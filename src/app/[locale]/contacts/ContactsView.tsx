"use client";

import { useTranslations } from "next-intl";
import { useReveal, revealStyle } from "@/components/useReveal";
import SectionHead from "@/components/SectionHead";
import { useState } from "react";
import type { ContactsData } from "@/sanity/lib/data";

/* Outline icons keyed by platform name (case-insensitive). */
const ICONS: Record<string, React.ReactNode> = {
  telegram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21.5 4L2.5 11.5l6.5 1.5L11 20l3-5 5 3 2.5-14z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
  vkontakte: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 7h4l4 10 4-10h4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M2 17h5M17 17h5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  youtube: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 9l6 3-6 3V9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
};

const fallbackIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7 13l3 3 7-8" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export default function ContactsView({
  data,
  cvRu,
  cvEn,
}: {
  data: ContactsData;
  cvRu: string | null;
  cvEn: string | null;
}) {
  const t = useTranslations("contacts");
  const headerReveal = useReveal();
  const emailReveal = useReveal(80);
  const socialReveal = useReveal(160);
  const cvReveal = useReveal(240);

  return (
    <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "5rem 2rem 6rem" }}>

      {/* ── Header ───────────────────────────────────────── */}
      <header ref={headerReveal.ref} style={{ ...revealStyle(headerReveal.visible), marginBottom: "var(--space-20)" }}>
        <SectionHead rule>{t("title")}</SectionHead>
      </header>

      {/* ── Email ────────────────────────────────────────── */}
      {data.email && (
        <section
          ref={emailReveal.ref}
          style={{
            ...revealStyle(emailReveal.visible),
            marginBottom: "5rem",
            paddingBottom: "5rem",
            borderBottom: "1px solid rgba(237,237,237,0.06)",
          }}
        >
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            {t("email_label")}
          </p>
          <EmailLink href={`mailto:${data.email}`}>{data.email}</EmailLink>
        </section>
      )}

      {/* ── Social ───────────────────────────────────────── */}
      {data.socials.length > 0 && (
        <section
          ref={socialReveal.ref}
          style={{
            ...revealStyle(socialReveal.visible),
            marginBottom: "5rem",
            paddingBottom: "5rem",
            borderBottom: "1px solid rgba(237,237,237,0.06)",
          }}
        >
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              marginBottom: "2rem",
            }}
          >
            {t("social_label")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: "640px" }}>
            {data.socials.map((s) => (
              <SocialRow
                key={s.platform + s.url}
                platform={s.platform}
                url={s.url}
                handle={s.handle || s.url.replace(/^https?:\/\//, "")}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── CV ───────────────────────────────────────────── */}
      <section ref={cvReveal.ref} style={revealStyle(cvReveal.visible)}>
        <p
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
            marginBottom: "2rem",
          }}
        >
          {t("cv_label")}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <DownloadLink href={cvRu ?? "/cv-ru.pdf"} label={t("download_cv_ru")} />
          <DownloadLink href={cvEn ?? "/cv-en.pdf"} label={t("download_cv_en")} />
        </div>
      </section>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────── */

function EmailLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(1.5rem, 4vw, 3.5rem)",
        fontWeight: 300,
        color: hovered ? "var(--text-primary)" : "var(--text-secondary)",
        textDecoration: "none",
        borderBottom: `1px solid ${hovered ? "rgba(237,237,237,0.4)" : "rgba(237,237,237,0.12)"}`,
        paddingBottom: "6px",
        display: "inline-block",
        transition: "color 250ms var(--ease-out-soft), border-color 250ms var(--ease-out-soft)",
        cursor: "pointer",
        wordBreak: "break-word",
      }}
    >
      {children}
    </a>
  );
}

function SocialRow({ platform, url, handle }: { platform: string; url: string; handle: string }) {
  const [hovered, setHovered] = useState(false);
  const icon = ICONS[platform.toLowerCase()] ?? fallbackIcon;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "140px 1fr 24px",
        alignItems: "center",
        gap: "1.5rem",
        padding: "1.25rem 0",
        borderBottom: "1px solid rgba(237,237,237,0.05)",
        textDecoration: "none",
        cursor: "pointer",
        transition: "opacity 200ms var(--ease-out-soft)",
        opacity: hovered ? 1 : 0.7,
      }}
    >
      <span
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <span style={{ color: "var(--text-secondary)", display: "flex" }}>{icon}</span>
        {platform}
      </span>

      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.125rem",
          fontWeight: 300,
          color: hovered ? "var(--text-primary)" : "var(--text-secondary)",
          transition: "color 200ms var(--ease-out-soft)",
        }}
      >
        {handle}
      </span>

      <span
        style={{
          fontSize: "0.75rem",
          color: hovered ? "var(--text-secondary)" : "transparent",
          transition: "color 200ms var(--ease-out-soft)",
        }}
      >
        ↗
      </span>
    </a>
  );
}

function DownloadLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      download
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.875rem",
        fontSize: "0.7rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: hovered ? "var(--text-primary)" : "var(--text-secondary)",
        textDecoration: "none",
        borderBottom: `1px solid ${hovered ? "rgba(237,237,237,0.35)" : "rgba(237,237,237,0.12)"}`,
        paddingBottom: "3px",
        width: "fit-content",
        transition: "color 200ms var(--ease-out-soft), border-color 200ms var(--ease-out-soft)",
        cursor: "pointer",
      }}
    >
      <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden="true">
        <path d="M5.5 1v8M1.5 8.5l4 4 4-4M1 12.5h9" stroke="currentColor" strokeWidth="1" />
      </svg>
      {label}
    </a>
  );
}
