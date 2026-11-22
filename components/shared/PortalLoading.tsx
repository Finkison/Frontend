import React from "react";

export interface PortalLoadingProps {
  message?: string;
  className?: string;
}

export default function PortalLoading({ message = "Loading…", className = "" }: PortalLoadingProps): React.ReactElement {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-2xl border border-[#E7E0D6] bg-white p-10 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90] ${className}`}
    >
      <span className="mx-auto mb-3 block h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-[#881337] dark:border-white/20 dark:border-t-[#FBBF24]" aria-hidden="true" />
      {message}
    </div>
  );
}
