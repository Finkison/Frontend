import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2, type LucideIcon } from "lucide-react";
import { useI18n } from "../../i18n";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface HeaderAction {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  id?: string;
}

export interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  primaryAction?: HeaderAction;
  secondaryActions?: HeaderAction[];
  badge?: {
    text: string;
    variant?: "brand" | "success" | "warning" | "error" | "info" | "neutral";
  };
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  eyebrow,
  description,
  breadcrumbs,
  primaryAction,
  secondaryActions = [],
  badge,
  children,
}: PageHeaderProps): React.ReactElement {
  const { t } = useI18n();
  const badgeClasses: Record<string, string> = {
    brand: "bg-[#FFF1F2] text-[#881337] border-[#FECDD3] dark:bg-[#4C0519]/50 dark:text-[#FBBF24] dark:border-[#881337]/50",
    success: "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0] dark:bg-green-950/40 dark:text-green-300 dark:border-green-800",
    warning: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800",
    error: "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA] dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
    info: "bg-[#F4EFEA] text-[#5C5046] border-[#E7E0D6] dark:bg-white/5 dark:text-[#E7E0D6] dark:border-white/10",
    neutral: "bg-[#F4EFEA] text-[#574C43] border-[#E8E2D9] dark:bg-white/5 dark:text-[#E7E0D6] dark:border-white/10",
  };

  const renderActionButton = (action: HeaderAction, isPrimary = false) => {
    const Icon = action.icon;
    const baseClasses =
      "inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors min-h-[44px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 dark:focus:ring-[#FBBF24] dark:focus:ring-offset-[#1C1512] disabled:opacity-50 disabled:cursor-not-allowed";

    let variantClasses = "border border-[#D5CBC0] bg-white text-[#261E1A] hover:bg-[#FAF8F5] dark:border-white/15 dark:bg-[#261E1A] dark:text-[#FDFBF7] dark:hover:bg-white/5";
    if (isPrimary || action.variant === "primary") {
      variantClasses = "bg-[#881337] hover:bg-[#9F1239] active:bg-[#BE123C] text-white font-semibold shadow-sm border border-transparent dark:bg-[#FBBF24] dark:hover:bg-[#F59E0B] dark:active:bg-[#D97706] dark:text-[#1C1512]";
    } else if (action.variant === "destructive") {
      variantClasses = "bg-[#B91C1C] hover:bg-red-800 active:bg-red-900 text-white border border-transparent dark:bg-red-700 dark:hover:bg-red-600";
    } else if (action.variant === "ghost") {
      variantClasses = "bg-transparent hover:bg-[#F4EFEA] text-[#5C5046] hover:text-[#261E1A] border border-transparent dark:text-[#E7E0D6] dark:hover:bg-white/5 dark:hover:text-white";
    }

    const content = (
      <>
        {action.loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : Icon ? (
          <Icon className="w-4 h-4 shrink-0" />
        ) : null}
        <span>{action.label}</span>
      </>
    );

    if (action.href && !action.disabled && !action.loading) {
      return (
        <Link
          key={action.label}
          to={action.href}
          id={action.id}
          className={`${baseClasses} ${variantClasses}`}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={action.label}
        id={action.id}
        type="button"
        onClick={action.onClick}
        disabled={action.disabled || action.loading}
        className={`${baseClasses} ${variantClasses}`}
      >
        {content}
      </button>
    );
  };

  return (
    <header className="mb-7 space-y-4 border-b border-[#E7E0D6] pb-6 dark:border-white/10">

      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label={t("appNavigation.breadcrumbNavigation")} className="flex items-center gap-1.5 text-xs text-[#5C5046] dark:text-[#A89C90]">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#A89C90] dark:text-[#7D6F63]" aria-hidden="true" />}
                {isLast || !crumb.href ? (
                  <span className={isLast ? "font-semibold text-[#261E1A] dark:text-[#FDFBF7]" : "text-[#5C5046] dark:text-[#A89C90]"}>
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.href}
                    className="hover:text-[#881337] dark:hover:text-[#FBBF24] hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-[#881337] dark:focus:ring-[#FBBF24] rounded px-0.5"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
        <div className="space-y-1">
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-[#881337] dark:text-[#FBBF24]">{eyebrow}</p>}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#261E1A] dark:text-[#FDFBF7] leading-tight">
              {title}
            </h1>
            {badge && (
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  badgeClasses[badge.variant || "neutral"]
                }`}
              >
                {badge.text}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm sm:text-base text-[#5C5046] dark:text-[#E7E0D6] max-w-[70ch] leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {(primaryAction || secondaryActions.length > 0) && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {secondaryActions.map((sec) => renderActionButton(sec, false))}
            {primaryAction && renderActionButton(primaryAction, true)}
          </div>
        )}
      </div>

      {children}
    </header>
  );
}
