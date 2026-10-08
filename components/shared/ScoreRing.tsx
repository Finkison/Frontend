import React from "react";

export interface ScoreRingProps {
  score?: number;
  target?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export default function ScoreRing({
  score = 0,
  target = 700,
  size = 120,
  strokeWidth = 10,
  label = "PREDICTED SCORE",
  className = ""
}: ScoreRingProps): React.ReactElement {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safeScore = Math.max(0, Math.min(score, target));
  const progressRatio = safeScore / target;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="rotate-[-90deg] transform"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#0A6E55"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-serif font-bold text-slate-900 leading-none" style={{ fontSize: size * 0.22 }}>
            {score}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
            /{target}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mt-2">
          {label}
        </span>
      )}
    </div>
  );
}
