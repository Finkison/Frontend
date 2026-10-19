import React, { useState, useEffect, useRef } from "react";

export interface StatItem {
  id: string;
  targetNumber: number;
  suffix?: string;
  prefix?: string;
  label: string;
  caption: string;
}

export interface StatsCounterProps {
  stats?: StatItem[];
}
export type EnterpriseStatsCounterProps = StatsCounterProps;

const DEFAULT_STATS: StatItem[] = [
  {
    id: "grades",
    targetNumber: 4,
    suffix: " levels",
    label: "Secondary grade coverage",
    caption: "Full syllabus mastery across Grades 9, 10, 11, and 12.",
  },
  {
    id: "streams",
    targetNumber: 2,
    suffix: " tracks",
    label: "Preparatory streams",
    caption: "Dedicated Natural Science and Social Science national examination tracks.",
  },
  {
    id: "modules",
    targetNumber: 12,
    suffix: " subjects",
    label: "Core curriculum subjects",
    caption: "Comprehensive textbook units with verified item banks and worked solutions.",
  },
  {
    id: "past-papers",
    targetNumber: 8,
    suffix: "+ years",
    label: "Past entrance papers",
    caption: "Verified national papers across multiple examination years with official marking rubrics.",
  },
];

export default function StatsCounter({
  stats = DEFAULT_STATS,
}: StatsCounterProps): React.ReactElement {
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
      role="region"
      aria-label="Platform telemetry and impact statistics"
    >
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="p-6 rounded-[12px] bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors text-start"
        >
          {/* Animated or Final Value (Final value in DOM for screen readers and search bots) */}
          <div className="flex items-baseline gap-1 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
            <span>{stat.prefix}</span>
            <span aria-hidden="true">
              {hasAnimated
                ? stat.targetNumber.toLocaleString()
                : stat.targetNumber.toLocaleString()}
            </span>
            <span className="sr-only">
              {stat.prefix || ""}
              {stat.targetNumber}
              {stat.suffix || ""}
            </span>
            <span className="text-[#881337] dark:text-[#FBBF24]">{stat.suffix}</span>
          </div>

          <h3 className="mt-2 text-base font-bold text-slate-900 leading-snug">
            {stat.label}
          </h3>

          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            {stat.caption}
          </p>
        </div>
      ))}
    </div>
  );
}
