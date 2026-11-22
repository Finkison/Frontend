import React, { useState } from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export type BannerVariant = "info" | "success" | "warning" | "error";

export interface BannerProps {
  variant?: BannerVariant;
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function Banner({
  variant = "info",
  title,
  message,
  dismissible = true,
  onDismiss,
  action,
  className = "",
}: BannerProps): React.ReactElement | null {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
  };
  const Icon = icons[variant];

  const variantStyles = {
    info: "border-[#FECDD3] bg-[#FFF1F2] text-[#881337] dark:border-[#881337]/50 dark:bg-[#4C0519]/40 dark:text-[#FBBF24]",
    success: "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D] dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200",
    warning: "border-[#FDE68A] bg-[#FFFBEB] text-[#B45309] dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200",
    error: "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C] dark:border-red-900 dark:bg-red-950/30 dark:text-red-200",
  };

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border p-3.5 text-xs leading-5 ${variantStyles[variant]} ${className}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="flex-1 space-y-0.5">
        {title && <p className="font-semibold">{title}</p>}
        <p className="text-stone-700 dark:text-[#E7E0D6]">{message}</p>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="font-semibold underline mt-1 cursor-pointer hover:opacity-80"
          >
            {action.label}
          </button>
        )}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded hover:bg-black/5 text-stone-500 dark:text-[#A89C90] hover:text-stone-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default Banner;
