import React from "react";

export interface SectionHeaderProps {
  /** Optional eyebrow text (max 3 words recommended, ALL CAPS allowed only here) */
  eyebrow?: string;
  /** Section title */
  title: string;
  /** Optional subtitle or lead paragraph */
  subtitle?: string;
  /** If true, renders as H1 instead of H2 */
  asH1?: boolean;
  /** Optional CTA buttons or action elements */
  actions?: React.ReactNode;
  /** Optional HTML ID for landmark anchor */
  id?: string;
  /** Additional custom class names */
  className?: string;
  /** Alignment: 'center' (default) or 'start' */
  align?: "center" | "start";
  /** If true, inverts colors to crisp white and bright stone for dark/crimson sections */
  invertColors?: boolean;
}

/**
 * SectionHeader - Enterprise Standard Typography Pattern
 * Enforces:
 * - Centered high-impact kicker / eyebrow (bolder font-extrabold, tracking-wider)
 * - Refined unbolded section title (font-medium, sleek modern enterprise)
 * - Centered subtitle with optimal line length
 * - Semantic H1/H2 hierarchy
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  asH1 = false,
  actions,
  id,
  className = "",
  align = "center",
  invertColors = false,
}) => {
  const isCenter = align === "center";
  return (
    <div
      className={`section-header-block ${isCenter ? "text-center mx-auto" : "text-start"} ${className}`}
      id={id}
    >
      {asH1 ? (
        <h1
          className={`text-h1 font-medium ${
            invertColors ? "!text-white" : ""
          } ${isCenter ? "text-center mx-auto" : "text-start"}`}
        >
          {title}
        </h1>
      ) : (
        <h2
          className={`text-h2 font-medium ${
            invertColors ? "!text-white" : ""
          } ${isCenter ? "text-center mx-auto" : "text-start"}`}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          className={`text-lead ${
            invertColors ? "!text-stone-100" : ""
          } ${isCenter ? "text-center mx-auto" : "text-start"}`}
        >
          {subtitle}
        </p>
      )}
      {actions && (
        <div
          className={`section-header-actions ${
            isCenter ? "justify-center" : "justify-start"
          }`}
        >
          {actions}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
