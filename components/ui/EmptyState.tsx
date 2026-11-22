import React from "react";
import { type LucideIcon, FolderOpen } from "lucide-react";
import Button from "./Button";

export interface EmptyStateProps {
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = FolderOpen,
  className = "",
}: EmptyStateProps): React.ReactElement {
  const titleId = title ? `empty-state-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` : undefined;

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-3 rounded-xl border border-dashed border-[#E7E0D6] bg-[#FAF8F5] p-8 text-center dark:border-white/10 dark:bg-[#1C1512] ${className}`}
      role={title ? "region" : undefined}
      aria-labelledby={titleId}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-400 dark:bg-[#201815] dark:text-[#A89C90]">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>

      <div className="space-y-1 max-w-sm">
        {title && (
          <h4 id={titleId} className="text-sm font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{title}</h4>
        )}
        <p className="text-xs leading-5 text-[#5C5046] dark:text-[#E7E0D6]">{description}</p>
      </div>

      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
