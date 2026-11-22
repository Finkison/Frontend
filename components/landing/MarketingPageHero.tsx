import React from "react";
import { Check } from "lucide-react";

interface MarketingPageHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  panelTitle: string;
  panelItems: string[];
}

/** A shared hero for public product pages, with the same hierarchy and CTA rhythm. */
export function MarketingPageHero({
  eyebrow,
  title,
  description,
  actions,
  panelTitle,
  panelItems,
}: MarketingPageHeroProps): React.ReactElement {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#4C0519] bg-[#4C0519] text-white">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_82%_35%,rgba(136,19,55,0.82),transparent_48%),radial-gradient(ellipse_at_10%_10%,rgba(251,191,36,0.12),transparent_36%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.09] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_right,black,transparent_82%)]"
        aria-hidden="true"
      />
      <div className="container relative z-10 py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-9 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-4 text-start lg:col-span-7">
            <div className="space-y-4">
              {eyebrow && (
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#FDE68A]">{eyebrow}</p>
              )}
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-white [text-wrap:balance] sm:text-5xl lg:text-[3.5rem]">
                {title}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#F4EFEA] sm:text-lg sm:leading-8">
                {description}
              </p>
            </div>
            {actions && <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">{actions}</div>}
          </div>

          <aside className="lg:col-span-5" aria-label={panelTitle}>
            <div className="rounded-2xl border border-white/20 bg-white/[0.07] p-5 shadow-xl backdrop-blur-md sm:p-6">
              <h2 className="text-sm font-bold tracking-wide text-white sm:text-base">{panelTitle}</h2>
              <ul className="mt-4 space-y-3">
                {panelItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#F4EFEA]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FBBF24] text-[#4C0519]">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
