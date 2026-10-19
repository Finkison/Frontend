import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2, type LucideIcon } from "lucide-react";

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
  description,
  breadcrumbs,
  primaryAction,
  secondaryActions = [],
  badge,
  children,
}: PageHeaderProps): React.ReactElement {
  const badgeClasses: Record<string, string> = {
    brand: "bg-[#FFF1F2] text-[#881337] border-[#FECDD3]",
    success: "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]",
    warning: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]",
    error: "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]",
    info: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]",
    neutral: "bg-[#F4EFEA] text-[#574C43] border-[#E8E2D9]",
  };

  const renderActionButton = (action: HeaderAction, isPrimary = false) => {
    const Icon = action.icon;
    const baseClasses =
      "inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-[8px] transition-colors min-h-[44px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    let variantClasses = "border border-[#64748B] bg-white text-[#1C1512] hover:bg-[#FAF8F5]";
    if (isPrimary || action.variant === "primary") {
      variantClasses = "bg-[#FBBF24] hover:bg-[#F59E0B] active:bg-[#D97706] text-[#1C1512] font-semibold shadow-2xs border border-transparent";
    } else if (action.variant === "destructive") {
      variantClasses = "bg-[#B91C1C] hover:bg-red-800 active:bg-red-900 text-white border border-transparent";
    } else if (action.variant === "ghost") {
      variantClasses = "bg-transparent hover:bg-[#F4EFEA] text-[#574C43] hover:text-[#1C1512] border border-transparent";
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
    <div className="mb-6 space-y-2 border-b border-[#E8E2D9] pb-5">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#574C43]">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                {isLast || !crumb.href ? (
                  <span className={isLast ? "font-semibold text-[#1C1512]" : "text-[#574C43]"}>
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.href}
                    className="hover:text-[#881337] hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-[#881337] rounded px-0.5"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#1C1512] leading-8">
              {title}
            </h1>
            {badge && (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-[8px] text-xs font-medium border ${
                  badgeClasses[badge.variant || "neutral"]
                }`}
              >
                {badge.text}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-[#574C43] max-w-[70ch] leading-5">
              {description}
            </p>
          )}
        </div>

        {/* Actions Cluster */}
        {(primaryAction || secondaryActions.length > 0) && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {secondaryActions.map((sec) => renderActionButton(sec, false))}
            {primaryAction && renderActionButton(primaryAction, true)}
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
