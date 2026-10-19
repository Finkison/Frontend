import React from "react";
import { Link } from "react-router-dom";

export interface FinkisonLogoProps {
  /**
   * Layout variant:
   * - "horizontal": Icon mark + FINKISON wordmark side-by-side (default)
   * - "mark": Icon mark only
   * - "full": Icon mark + FINKISON wordmark + Ge'ez subtitle
   * - "vertical": Icon mark centered above wordmark
   */
  variant?: "horizontal" | "mark" | "full" | "vertical";
  /** Size preset */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /** Optional custom link destination (defaults to "/", pass null to disable link) */
  to?: string | null;
  /** Custom class for the wrapper */
  className?: string;
  /** Whether to show the Ge'ez script "ፊንኪሶን" subtitle */
  showGeez?: boolean;
  /** Whether the star should have subtle breathing/pulse animation */
  animated?: boolean;
}

/**
 * Finkison Official Vector Logo Mark
 * Standardized to Academic Crimson (#881337) & Deep Institutional Claret (#4C0519)
 */
export function FinkisonMark({ 
  size = 32, 
  className = "", 
}: { 
  size?: number; 
  className?: string; 
  animated?: boolean;
}): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="Finkison Emblem"
    >
      {/* Outer Squircle Container: Deep Claret with Crimson border */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="14"
        fill="#4C0519"
        stroke="#881337"
        strokeWidth="1.5"
      />

      {/* Core "F" Monogram Architectural Vector */}
      <g>
        {/* 1. Main Spine Pillar (Left of 'F') */}
        <rect
          x="15"
          y="13"
          width="7"
          height="37"
          rx="3.5"
          fill="#881337"
        />

        {/* 2. Top Ascending Wing of Knowledge (Upper Beam of 'F') */}
        <path
          d="M20 13H36C42.5 13 47.8 10.2 50 8C48.2 14.8 41.5 20.5 34 20.5H20V13Z"
          fill="#FBBF24"
        />

        {/* 3. Middle Dynamic Page Beam (Middle Tier of 'F') */}
        <path
          d="M20 27H32.5C37.2 27 41.2 25 43 23.5C41.5 28.5 36.5 32.5 30.5 32.5H20V27Z"
          fill="#FDE68A"
        />

        {/* 4. Base Accent / Page Foundation Notch */}
        <path
          d="M15 45.5C12.5 45.5 10 47 9 48.5C11 49.8 13.5 50 16 50H20V45.5H15Z"
          fill="#881337"
        />
      </g>

      {/* 5. Beacon Star Accent (Top Right Apex) */}
      <g>
        <path
          d="M51 3L52.4 6.8L56.5 8L52.4 9.2L51 13L49.6 9.2L45.5 8L49.6 6.8L51 3Z"
          fill="#FFFBEB"
        />
        <circle cx="51" cy="8" r="1.2" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

export default function FinkisonLogo({
  variant = "horizontal",
  size = "md",
  to = "/",
  className = "",
  showGeez = false,
  animated = false
}: FinkisonLogoProps): React.ReactElement {
  // Size maps
  const markSizeMap = {
    xs: 20,
    sm: 26,
    md: 32,
    lg: 40,
    xl: 52,
    "2xl": 68
  };

  const textClassMap = {
    xs: "text-xs tracking-tight",
    sm: "text-sm tracking-tight",
    md: "text-base tracking-tight",
    lg: "text-lg tracking-tight",
    xl: "text-xl tracking-tight",
    "2xl": "text-2xl tracking-tight"
  };

  const markSize = markSizeMap[size];

  const content = (
    <div
      className={`inline-flex items-center select-none ${
        variant === "vertical" ? "flex-col text-center gap-2" : "gap-2.5"
      } ${className}`}
    >
      {/* Precision Icon Mark */}
      <div className="relative">
        <FinkisonMark size={markSize} animated={animated} />
      </div>

      {/* Wordmark and Subtitle */}
      {variant !== "mark" && (
        <div className={`flex flex-col ${variant === "vertical" ? "items-center" : "items-start"} min-w-0`}>
          <span
            className={`font-sans font-bold ${textClassMap[size]} text-[#261E1A] dark:text-[#FAF8F5] leading-none`}
          >
            FINKISON
          </span>

          {/* Optional Ge'ez / Subtitle Tagline */}
          {(showGeez || variant === "full") && (
            <span className="text-[10px] font-medium text-[#7D6F63] dark:text-[#D5CBC0] tracking-normal mt-0.5">
              ፊንኪሶን • Academic Platform
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex focus:outline-hidden" title="Finkison — Academic Platform">
        {content}
      </Link>
    );
  }

  return content;
}
