import React from "react";
import { type LucideIcon } from "lucide-react";

export interface MetaItem {
  icon?: LucideIcon | React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  text: string;
  ariaLabel?: string;
}

export interface MetaProps {

  items: MetaItem[];

  separator?: string;

  className?: string;
}

export const Meta: React.FC<MetaProps> = ({
  items,
  separator = "•",
  className = "",
}) => {

  const displayItems = items.slice(0, 3);

  if (displayItems.length === 0) return null;

  return (
    <div
      className={`text-meta flex items-center flex-wrap gap-2 text-[var(--txt3,#A89C90)] ${className}`}
      role="list"
      aria-label="Metadata"
    >
      {displayItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <React.Fragment key={index}>
            <span
              className="inline-flex items-center gap-1.5 shrink-0"
              role="listitem"
              aria-label={item.ariaLabel}
            >
              {Icon && (
                <Icon
                  className="w-3.5 h-3.5 shrink-0 icon-first-line text-[var(--txt3,#A89C90)]"
                  aria-hidden="true"
                />
              )}
              <span>{item.text}</span>
            </span>
            {index < displayItems.length - 1 && (
              <span
                className="text-[var(--txt3,#94A3B8)] select-none opacity-60 text-xs shrink-0"
                aria-hidden="true"
              >
                {separator}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Meta;
