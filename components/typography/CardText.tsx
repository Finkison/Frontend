import React from "react";

export interface CardTextProps {

  title: string;

  description?: string;

  meta?: React.ReactNode;

  cta?: React.ReactNode;

  titleAs?: "h2" | "h3" | "h4" | "div";

  className?: string;
}

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
