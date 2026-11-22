import React, { useEffect, useRef, useState } from "react";

export interface StatItem {
  id: string;
  targetNumber: number;
  suffix?: string;
  prefix?: string;
  label: string;
  caption: string;
}

export interface StatsCounterProps {
  /** Supply verified figures from the product or organization. */
  stats: StatItem[];
}

export type EnterpriseStatsCounterProps = StatsCounterProps;

export default function StatsCounter({ stats }: StatsCounterProps): React.ReactElement | null {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }

    let animationFrame = 0;
    const startedAt = window.performance.now();
    const duration = 900;

    const animate = (now: number) => {
      const linearProgress = Math.min((now - startedAt) / duration, 1);
      setProgress(1 - Math.pow(1 - linearProgress, 3));
      if (linearProgress < 1) animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [isVisible]);

  if (stats.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
      role="region"
      aria-label="Platform information"
    >
      {stats.map((stat) => {
        const currentValue = Math.round(stat.targetNumber * progress);
        return (
          <article
            key={stat.id}
            className="rounded-xl border border-stone-200/80 bg-stone-50 p-5 text-start transition-colors hover:border-stone-300 dark:border-white/10 dark:bg-[#261E1A] dark:hover:border-white/20 sm:p-6"
          >
            <div className="flex items-baseline gap-1 font-mono text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white sm:text-4xl">
              <span aria-hidden="true">
                {stat.prefix}{currentValue.toLocaleString()}{stat.suffix}
              </span>
              <span className="sr-only">
                {stat.prefix || ""}{stat.targetNumber.toLocaleString()}{stat.suffix || ""}
              </span>
            </div>
            <h3 className="mt-2 text-base font-bold leading-snug text-stone-900 dark:text-white">
              {stat.label}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              {stat.caption}
            </p>
          </article>
        );
      })}
    </div>
  );
}
