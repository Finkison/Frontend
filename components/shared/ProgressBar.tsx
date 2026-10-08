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
  color = "teal",
  size = "md",
  className = ""
}: ProgressBarProps): React.ReactElement {
  const percentage = Math.min(100, Math.max(0, Math.round(((value || 0) / (max || 100)) * 100)));

  const sizeHeights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4"
  };

  const gradientColors = {
    teal: "from-[#0A6E55] to-emerald-400",
    emerald: "from-emerald-600 to-teal-400",
    amber: "from-amber-500 to-amber-400",
    blue: "from-blue-600 to-indigo-400",
    rose: "from-rose-600 to-rose-400"
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
          {label && <span>{label}</span>}
          {showPercentage && <span className="text-slate-500 font-mono ml-auto">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeHeights[size]}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradientColors[color]} transition-all duration-500 ease-out`}
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
