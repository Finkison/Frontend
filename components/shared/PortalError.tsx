import React from "react";
import { AlertCircle } from "lucide-react";

export interface PortalErrorProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function PortalError({ message, actionLabel = "Try again", onAction, className = "" }: PortalErrorProps): React.ReactElement {
  return (
    <div
      role="alert"
      className={`flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <span className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{message}</span>
      </span>
      {onAction && (
        <button type="button" onClick={onAction} className="min-h-10 self-start rounded-lg border border-rose-300 px-3 text-xs font-semibold hover:bg-rose-100 sm:self-auto dark:border-rose-800 dark:hover:bg-rose-950/40">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
