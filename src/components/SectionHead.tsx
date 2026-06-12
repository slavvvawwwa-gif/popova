/**
 * Section eyebrow label — optionally with a trailing hairline rule.
 * Replaces the repeated inline "tiny uppercase label + line" pattern so the
 * kicker treatment is systematized in one place (Refactoring UI: define systems).
 */
export default function SectionHead({
  children,
  rule = false,
  accent = false,
  as: Tag = "p",
  style,
}: {
  children: React.ReactNode;
  rule?: boolean;
  accent?: boolean;
  as?: "p" | "h2";
  style?: React.CSSProperties;
}) {
  const label = (
    <Tag className={`eyebrow${accent ? " eyebrow--accent" : ""}`} style={{ whiteSpace: "nowrap", margin: 0, ...style }}>
      {children}
    </Tag>
  );

  if (!rule) return label;

  return (
    <div className="section-head">
      {label}
      <span className="rule" aria-hidden="true" />
    </div>
  );
}
