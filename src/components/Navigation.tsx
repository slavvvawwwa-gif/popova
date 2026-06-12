"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { key: "about", href: "/about" },
  { key: "works", href: "/works" },
  { key: "projects", href: "/projects" },
  { key: "lab", href: "/lab" },
  { key: "contacts", href: "/contacts" },
] as const;

export default function Navigation({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const pathnameWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  const isActive = (href: string) => {
    const clean = pathnameWithoutLocale;
    if (href === "/") return clean === "/";
    return clean.startsWith(href);
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(237,237,237,0.06)",
      }}
    >
      <nav
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "0 2rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo / name */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.25rem",
            fontWeight: 300,
            color: "var(--text-primary)",
            textDecoration: "none",
            letterSpacing: "0.04em",
          }}
        >
          {t("home")}
        </Link>

        {/* Desktop links */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}
          className="hidden md:flex"
        >
          {NAV_LINKS.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className={isActive(href) ? undefined : "u-link"}
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: isActive(href) ? "var(--accent)" : "var(--text-secondary)",
                transition: "color 200ms var(--ease-out-soft)",
                position: "relative",
                paddingBottom: "2px",
              }}
            >
              {t(key)}
              {/* Active underline indicator (persistent) */}
              {isActive(href) && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "-1px",
                    left: 0,
                    right: 0,
                    height: "1px",
                    backgroundColor: "var(--accent)",
                  }}
                />
              )}
            </Link>
          ))}

          {/* Lang switch — both options, active highlighted */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginLeft: "1rem",
              paddingLeft: "1rem",
              borderLeft: "1px solid rgba(237,237,237,0.12)",
            }}
          >
            {(["ru", "en"] as const).map((lang) => (
              <a
                key={lang}
                href={`/${lang}${pathnameWithoutLocale}`}
                className={locale === lang ? undefined : "u-link"}
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: locale === lang ? "var(--text-primary)" : "var(--text-secondary)",
                  fontWeight: locale === lang ? 500 : 300,
                  transition: "color 200ms var(--ease-out-soft)",
                  ...(locale === lang
                    ? { borderBottom: "1px solid var(--text-primary)", paddingBottom: "1px" }
                    : {}),
                }}
                aria-current={locale === lang ? "true" : undefined}
              >
                {lang.toUpperCase()}
              </a>
            ))}
          </div>
        </div>

        {/* Mobile burger */}
        <button
          className="flex md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
            color: "var(--text-primary)",
          }}
        >
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            {menuOpen ? (
              <>
                <line x1="1" y1="1" x2="21" y2="15" stroke="currentColor" strokeWidth="1.5" />
                <line x1="21" y1="1" x2="1" y2="15" stroke="currentColor" strokeWidth="1.5" />
              </>
            ) : (
              <>
                <line x1="0" y1="2" x2="22" y2="2" stroke="currentColor" strokeWidth="1.5" />
                <line x1="0" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="1.5" />
                <line x1="0" y1="14" x2="22" y2="14" stroke="currentColor" strokeWidth="1.5" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="flex md:hidden"
          style={{
            flexDirection: "column",
            padding: "1rem 2rem 1.5rem",
            gap: "1.25rem",
            borderTop: "1px solid rgba(237,237,237,0.06)",
          }}
        >
          {NAV_LINKS.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: isActive(href) ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              {isActive(href) && (
                <span style={{ color: "var(--accent)", marginRight: "0.5rem" }}>—</span>
              )}
              {t(key)}
            </Link>
          ))}

          {/* Mobile lang switch */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "0.5rem",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(237,237,237,0.06)",
            }}
          >
            {(["ru", "en"] as const).map((lang) => (
              <a
                key={lang}
                href={`/${lang}${pathnameWithoutLocale}`}
                style={{
                  fontSize: "0.875rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: locale === lang ? "var(--text-primary)" : "var(--text-secondary)",
                  fontWeight: locale === lang ? 500 : 300,
                  ...(locale === lang
                    ? { borderBottom: "1px solid var(--text-primary)", paddingBottom: "1px" }
                    : {}),
                }}
              >
                {lang.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
