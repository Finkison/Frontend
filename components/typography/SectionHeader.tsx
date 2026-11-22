import React from "react";

export interface SectionHeaderProps {

  eyebrow?: string;

  title: string;

  subtitle?: string;

  asH1?: boolean;

  actions?: React.ReactNode;

  id?: string;

  className?: string;

  align?: "center" | "start";

  invertColors?: boolean;
}

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
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#881337]">
          {eyebrow}
        </p>
      )}
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
