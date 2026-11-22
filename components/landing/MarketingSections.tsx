import React from "react";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeader } from "../typography/SectionHeader";

export interface MarketingItem {
  icon?: LucideIcon;
  title: string;
  description: string;
}

interface MarketingGridProps {
  id?: string;
  title: string;
  description?: string;
  items: MarketingItem[];
  columns?: 2 | 3 | 4;
  tone?: "white" | "cream";
}

export function MarketingSteps({
  id,
  title,
  description,
  items,
  columns = 4,
  tone = "cream",
}: MarketingGridProps): React.ReactElement {
  const gridColumns = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 xl:grid-cols-4",
  }[columns];

  return (
    <section
      className={`section border-b border-[#E7E0D6] dark:border-white/10 ${tone === "cream" ? "bg-[#FAF8F5] dark:bg-[#1C1512]" : "bg-white dark:bg-[#1C1512]"}`}
      aria-labelledby={id}
    >
      <div className="container space-y-7 sm:space-y-8">
        <SectionHeader id={id} align="start" title={title} subtitle={description} />
        <div className={`grid gap-3.5 ${gridColumns}`}>
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="flex h-full flex-col rounded-2xl border border-[#E7E0D6] bg-white p-5 dark:border-white/10 dark:bg-[#261E1A] sm:p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  {Icon ? (
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FECDD3] bg-[#FFF1F2] text-[#881337] dark:border-[#881337]/40 dark:bg-[#881337]/20 dark:text-[#FBBF24]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF1F2] text-xs font-bold text-[#881337] dark:bg-[#881337]/25 dark:text-[#FBBF24]" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-base font-bold tracking-tight text-[#1C1512] dark:text-white">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-[#57534E] dark:text-stone-300">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface MarketingCTAProps {
  title: string;
  description: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}

export function MarketingCTA({
  title,
  description,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}: MarketingCTAProps): React.ReactElement {
  return (
    <section className="bg-[#4C0519] py-10 text-white sm:py-12" aria-labelledby="marketing-cta-title">
      <div className="container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <h2 id="marketing-cta-title" className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-200 sm:text-base">{description}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
          <Link
            to={primaryTo}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FBBF24] px-5 py-3 text-sm font-bold text-[#1C1512] transition-colors hover:bg-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]"
          >
            {primaryLabel}<ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {secondaryLabel && secondaryTo && (
            <Link
              to={secondaryTo}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
