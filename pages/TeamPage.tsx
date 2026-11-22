import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Building2, Cpu, Target } from "lucide-react";
import { MarketingCTA, MarketingSteps } from "../components/landing/MarketingSections";
import { MarketingPageHero } from "../components/landing/MarketingPageHero";
import { usePageMeta } from "../hooks/usePageMeta";
import { useI18n } from "../i18n";

export default function TeamPage(): React.ReactElement {
  const { t } = useI18n();
  usePageMeta(t("public.pages.teamTitle"), t("public.pages.teamDescription"));

  const areas = [
    { icon: BookOpen, title: t("public.marketing.work.area1Title"), description: t("public.marketing.work.area1Body") },
    { icon: Target, title: t("public.marketing.work.area2Title"), description: t("public.marketing.work.area2Body") },
    { icon: Cpu, title: t("public.marketing.work.area3Title"), description: t("public.marketing.work.area3Body") },
    { icon: Building2, title: t("public.marketing.work.area4Title"), description: t("public.marketing.work.area4Body") },
  ];

  return (
    <div className="public-page min-h-screen bg-white font-sans text-[#261E1A] selection:bg-[#FFF1F2] selection:text-[#881337] dark:bg-[#1C1512] dark:text-stone-100">
      <MarketingPageHero
        title={t("public.pages.teamTitle")}
        description={t("public.pages.teamDescription")}
        panelTitle={t("public.marketing.work.panelTitle")}
        panelItems={[
          t("public.marketing.work.panel1"),
          t("public.marketing.work.panel2"),
          t("public.marketing.work.panel3"),
        ]}
        actions={
          <>
            <Link to="/about" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#FBBF24] px-5 py-3 text-sm font-bold text-[#1C1512] transition-colors hover:bg-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]">
              {t("public.pages.aboutTitle")}<ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/contact" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]">
              {t("public.navigation.contact")}
            </Link>
          </>
        }
      />

      <section className="section border-b border-[#E7E0D6] bg-[#FAF8F5] dark:border-white/10 dark:bg-[#1C1512]" aria-labelledby="work-heading">
        <div className="container space-y-7 sm:space-y-8">
          <div>
            <h2 id="work-heading" className="text-2xl font-semibold tracking-tight text-[#1C1512] dark:text-white sm:text-3xl">{t("public.marketing.work.areasTitle")}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#57534E] dark:text-stone-300">{t("public.marketing.work.areasDescription")}</p>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
            {areas.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-[#E7E0D6] bg-white p-5 dark:border-white/10 dark:bg-[#261E1A]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FECDD3] bg-[#FFF1F2] text-[#881337] dark:border-[#881337]/40 dark:bg-[#881337]/20 dark:text-[#FBBF24]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-[#1C1512] dark:text-white">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-[#57534E] dark:text-stone-300">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <MarketingSteps
        id="how-we-work-heading"
        title={t("public.marketing.work.flowTitle")}
        tone="white"
        columns={3}
        items={[
          { title: t("public.marketing.work.step1Title"), description: t("public.marketing.work.step1Body") },
          { title: t("public.marketing.work.step2Title"), description: t("public.marketing.work.step2Body") },
          { title: t("public.marketing.work.step3Title"), description: t("public.marketing.work.step3Body") },
        ]}
      />

      <MarketingCTA
        title={t("public.marketing.work.ctaTitle")}
        description={t("public.marketing.work.ctaDescription")}
        primaryLabel={t("public.marketing.common.talkToUs")}
        primaryTo="/contact"
        secondaryLabel={t("public.pages.aboutTitle")}
        secondaryTo="/about"
      />
    </div>
  );
}
