import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useI18n } from "../../i18n";

export default function LandingHero(): React.ReactElement {
  const { t } = useI18n();

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate overflow-hidden border-b border-[#4C0519] bg-[#4C0519] text-white"
    >
      <img
        src="/images/digital-classroom-learning.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        style={{ objectPosition: "center 60%" }}
        fetchPriority="high"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#4C0519]/35" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#4C0519]/90 via-[#4C0519]/68 to-[#4C0519]/25" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#1C1512]/50 via-transparent to-[#1C1512]/5" aria-hidden="true" />

      <div className="container relative z-10 py-16 sm:py-24 lg:py-28">
        <div className="max-w-4xl space-y-7 text-start sm:space-y-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#FDE68A] backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {t("public.hero.eyebrow")}
          </p>
          <div className="space-y-5">
            <h1
              id="home-hero-title"
              className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.45)] [text-wrap:balance] sm:text-6xl lg:text-[4.25rem] xl:text-[4.75rem]"
            >
              {t("public.hero.title")}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[#FFF8F2] [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] sm:text-lg sm:leading-8">
              {t("public.hero.description")}
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
            <Link
              to="/register"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#261E1A] shadow-lg shadow-black/20 transition-colors hover:bg-[#FFF8F2] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]"
            >
              {t("public.hero.primaryCta")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/for-schools"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 bg-[#1C1512]/25 px-6 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-[#1C1512]/45 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]"
            >
              {t("public.hero.secondaryCta")}
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
