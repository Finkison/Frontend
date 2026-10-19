import React from "react";
import { type LucideIcon } from "lucide-react";

export interface MetaItem {
  icon?: LucideIcon | React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  text: string;
  ariaLabel?: string;
}

export interface MetaProps {
  /** Metadata items list. Maximum of 3 items enforced to eliminate UI clutter */
  items: MetaItem[];
  /** Optional delimiter between items, defaults to middle dot '•' */
  separator?: string;
  /** Optional container class */
  className?: string;
}

/**
 * Meta - Enterprise Standard Metadata Row Pattern
 * Enforces:
 * - Cap at maximum 3 items (trims excess to keep clean UI)
 * - Single line with overflow ellipsis (.text-meta)
 * - 13-14px font size, 500 weight, muted contrast
 * - Proper ARIA labels and decorative icon hiding
 */
export const Meta: React.FC<MetaProps> = ({
  items,
  separator = "•",
  className = "",
}) => {
  // Strict rule: Cap at 3 items maximum
  const displayItems = items.slice(0, 3);

  if (displayItems.length === 0) return null;

  return (
    <div
      className={`text-meta flex items-center flex-wrap gap-2 text-[var(--txt3,#64748B)] ${className}`}
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
                  className="w-3.5 h-3.5 shrink-0 icon-first-line text-[var(--txt3,#64748B)]"
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
