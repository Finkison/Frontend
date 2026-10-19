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
  return (
    <div
      className={`border border-dashed border-[#E2E8F0] rounded-[8px] p-8 text-center bg-[#F8FAFC] flex flex-col items-center justify-center space-y-3 ${className}`}
      role="region"
      aria-label="Empty content"
    >
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>

      <div className="space-y-1 max-w-sm">
        {title && (
          <h4 className="text-sm font-semibold text-[#0F172A]">{title}</h4>
        )}
        <p className="text-xs text-[#475569] leading-5">{description}</p>
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
