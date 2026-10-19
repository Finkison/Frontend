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
    info: "bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]",
    success: "bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]",
    warning: "bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]",
    error: "bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C]",
  };

  const iconColors = {
    info: "text-[#1D4ED8]",
    success: "text-[#15803D]",
    warning: "text-[#B45309]",
    error: "text-[#B91C1C]",
  };

  return (
    <div
      role="alert"
      className={`border rounded-[8px] p-3.5 flex items-start gap-3 text-xs leading-5 ${variantStyles[variant]} ${className}`}
    >
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColors[variant]}`} aria-hidden="true" />
      <div className="flex-1 space-y-0.5">
        {title && <p className="font-semibold">{title}</p>}
        <p className="text-slate-700">{message}</p>
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
          className="p-1 rounded hover:bg-black/5 text-slate-500 hover:text-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default Banner;
