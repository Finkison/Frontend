import React from "react";

export interface CardTextProps {
  /** Card heading (clamped to 2 lines, max 60 chars recommended) */
  title: string;
  /** Card body description (clamped to 3 lines, max 120 chars recommended) */
  description?: string;
  /** Optional metadata row (author, date, duration, cap at 3 items) */
  meta?: React.ReactNode;
  /** Optional primary action / link / button, pinned to card bottom */
  cta?: React.ReactNode;
  /** Heading semantic level, default 'h3' */
  titleAs?: "h2" | "h3" | "h4" | "div";
  /** Optional container class */
  className?: string;
}

/**
 * CardText - Enterprise Standard Card Typography Pattern
 * Enforces:
 * - Equal height alignment via CSS line clamping and min-heights
 * - Strict vertical rhythm: Title -> 8-12px -> Description -> 12-16px -> Meta -> 16-24px -> CTA
 * - CTA pinned to bottom (margin-top: auto)
 * - Strict sentence case
 */
export const CardText: React.FC<CardTextProps> = ({
  title,
  description,
  meta,
  cta,
  titleAs: TitleTag = "h3",
  className = "",
}) => {
  return (
    <div className={`enterprise-card-vertical ${className}`}>
      <div className="card-title-block">
        <TitleTag className="text-card-title" title={title}>
          {title}
        </TitleTag>
      </div>

      {description && (
        <div className="card-desc-block">
          <p className="text-card-desc" title={description}>
            {description}
          </p>
        </div>
      )}

      {meta && <div className="card-meta-block">{meta}</div>}

      {cta && <div className="card-cta-pin">{cta}</div>}
    </div>
  );
};

export default CardText;
