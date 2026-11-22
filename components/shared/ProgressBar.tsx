import React from "react";

export interface ProgressBarProps {
  value?: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: "emerald" | "amber" | "blue" | "rose" | "teal";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  color = "blue",
  size = "md",
  className = ""
}: ProgressBarProps): React.ReactElement {
  const percentage = Math.min(100, Math.max(0, Math.round(((value || 0) / (max || 100)) * 100)));

  const sizeHeights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4"
  };

  const solidColors = {
    blue: "bg-[#881337]",
    teal: "bg-[#0F766E]",
    emerald: "bg-[#15803D]",
    amber: "bg-[#B45309]",
    rose: "bg-[#B91C1C]"
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-semibold text-stone-700 dark:text-[#E7E0D6] mb-1.5">
          {label && <span>{label}</span>}
          {showPercentage && <span className="text-stone-500 dark:text-[#A89C90] font-mono ml-auto">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-stone-100 dark:bg-[#201815] rounded-full overflow-hidden ${sizeHeights[size]}`}>
        <div
          className={`h-full rounded-full ${solidColors[color] || "bg-[#881337]"} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
