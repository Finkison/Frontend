import React from "react";
import { type LucideIcon } from "lucide-react";

export type BadgeVariant =
  | "brand"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

export type AllowedBadgeCategory = "status" | "level" | "access" | "recency";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  type?: AllowedBadgeCategory;
  value?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  size?: "sm" | "md";
  className?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
}

/**
 * Standardized Badge Component
 * Strictly adheres to 24px height, 12px font size, 6px radius, and WCAG AA semantic tokens.
 */
export function Badge({
  children,
  variant,
  type = "status",
  value,
  icon: Icon,
  ariaLabel,
  className = "",
  ...props
}: BadgeProps): React.ReactElement {
  const content = value || children;

  let colorClass = "bg-[#F8FAFC] text-[#334155] border-[#E2E8F0] dark:bg-[#1E293B] dark:text-[#CBD5E1] dark:border-[#334155]";

  if (variant) {
    const variantStyles: Record<BadgeVariant, string> = {
      brand: "bg-[#FFF1F2] text-[#881337] border-[#FECDD3] dark:bg-[#4C0519] dark:text-[#FECDD3] dark:border-[#881337]",
      success: "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0] dark:bg-[#052E16] dark:text-[#86EFAC] dark:border-[#166534]",
      warning: "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A] dark:bg-[#451A03] dark:text-[#FCD34D] dark:border-[#B45309]",
      error: "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA] dark:bg-[#450A0A] dark:text-[#FCA5A5] dark:border-[#991B1B]",
      info: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] dark:bg-[#451A03] dark:text-[#FCD34D] dark:border-[#B45309]",
      neutral: "bg-[#F8FAFC] text-[#334155] border-[#E2E8F0] dark:bg-[#1E293B] dark:text-[#CBD5E1] dark:border-[#334155]",
    };
    colorClass = variantStyles[variant] || colorClass;
  } else if (type === "status") {
    const textStr = String(content).toLowerCase();
    if (textStr.includes("live") || textStr.includes("completed")) {
      colorClass = "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0] dark:bg-[#052E16] dark:text-[#86EFAC] dark:border-[#166534]";
    } else if (textStr.includes("progress")) {
      colorClass = "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A] dark:bg-[#451A03] dark:text-[#FCD34D] dark:border-[#B45309]";
    } else {
      colorClass = "bg-[#F8FAFC] text-[#334155] border-[#E2E8F0] dark:bg-[#1E293B] dark:text-[#CBD5E1] dark:border-[#334155]";
    }
  } else if (type === "level") {
    colorClass = "bg-[#FFF1F2] text-[#881337] border-[#FECDD3] dark:bg-[#4C0519] dark:text-[#FECDD3] dark:border-[#881337]";
  } else if (type === "access") {
    colorClass = "bg-[#F8FAFC] text-[#334155] border-[#CBD5E1] dark:bg-[#1E293B] dark:text-[#E2E8F0] dark:border-[#475569]";
  } else if (type === "recency") {
    colorClass = "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] dark:bg-[#451A03] dark:text-[#FCD34D] dark:border-[#B45309]";
  }

  return (
    <span
      className={`inline-flex items-center h-6 px-2.5 text-xs font-medium rounded-[6px] border ${colorClass} gap-1.5 shrink-0 whitespace-nowrap leading-none ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />}
      <span>{content}</span>
    </span>
  );
}

export default Badge;
