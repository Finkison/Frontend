import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, BookOpenCheck, FileSpreadsheet, School, Users } from "lucide-react";
import { MarketingCTA, MarketingSteps } from "../components/landing/MarketingSections";
import { MarketingPageHero } from "../components/landing/MarketingPageHero";
import { usePageMeta } from "../hooks/usePageMeta";
import { useI18n } from "../i18n";

export default function SchoolsPage(): React.ReactElement {
  const { t } = useI18n();
  usePageMeta(t("public.pages.schoolsTitle"), t("public.pages.schoolsDescription"));

  return (
    <div className="public-page min-h-screen bg-white font-sans text-[#261E1A] selection:bg-[#FFF1F2] selection:text-[#881337] dark:bg-[#1C1512] dark:text-stone-100">
      <MarketingPageHero
        title={t("public.pages.schoolsTitle")}
        description={t("public.pages.schoolsDescription")}
        panelTitle={t("public.marketing.schools.panelTitle")}
        panelItems={[
          t("public.marketing.schools.panel1"),
          t("public.marketing.schools.panel2"),
          t("public.marketing.schools.panel3"),
        ]}
        actions={
          <>
            <Link to="/contact?topic=School%20setup" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#FBBF24] px-5 py-3 text-sm font-bold text-[#1C1512] transition-colors hover:bg-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]">
              {t("public.marketing.common.talkToUs")}<ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/pricing" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]">
              {t("public.navigation.pricing")}
            </Link>
          </>
        }
      />

      <MarketingSteps
        id="school-workflow-heading"
        title={t("public.marketing.schools.workflowTitle")}
        description={t("public.marketing.schools.workflowDescription")}
        tone="cream"
        items={[
          { title: t("public.marketing.schools.step1Title"), description: t("public.marketing.schools.step1Description") },
          { title: t("public.marketing.schools.step2Title"), description: t("public.marketing.schools.step2Description") },
          { title: t("public.marketing.schools.step3Title"), description: t("public.marketing.schools.step3Description") },
          { title: t("public.marketing.schools.step4Title"), description: t("public.marketing.schools.step4Description") },
        ]}
      />

      <MarketingSteps
        id="school-tools-heading"
        title={t("public.marketing.schools.toolsTitle")}
        tone="white"
        items={[
          { icon: Users, title: t("public.marketing.schools.tool1Title"), description: t("public.marketing.schools.tool1Body") },
          { icon: School, title: t("public.marketing.schools.tool2Title"), description: t("public.marketing.schools.tool2Body") },
          { icon: BookOpenCheck, title: t("public.marketing.schools.tool3Title"), description: t("public.marketing.schools.tool3Body") },
          { icon: BarChart3, title: t("public.marketing.schools.tool4Title"), description: t("public.marketing.schools.tool4Body") },
        ]}
      />

      <section className="section border-t border-[#E7E0D6] bg-[#FAF8F5] dark:border-white/10 dark:bg-[#1C1512]" aria-labelledby="school-records-heading">
        <div className="container grid items-start gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 id="school-records-heading" className="text-2xl font-semibold tracking-tight text-[#1C1512] dark:text-white sm:text-3xl">{t("public.marketing.schools.sharedTitle")}</h2>
            <p className="mt-3 text-sm leading-6 text-[#57534E] dark:text-stone-300">{t("public.marketing.schools.sharedDescription")}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            <article className="rounded-xl border border-[#E7E0D6] bg-white p-5 dark:border-white/10 dark:bg-[#261E1A]">
              <FileSpreadsheet className="h-5 w-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-bold text-[#1C1512] dark:text-white">{t("public.marketing.schools.recordsTitle")}</h3>
              <p className="mt-1.5 text-sm leading-6 text-[#57534E] dark:text-stone-300">{t("public.marketing.schools.recordsDescription")}</p>
            </article>
            <article className="rounded-xl border border-[#E7E0D6] bg-white p-5 dark:border-white/10 dark:bg-[#261E1A]">
              <BarChart3 className="h-5 w-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-bold text-[#1C1512] dark:text-white">{t("public.marketing.schools.progressTitle")}</h3>
              <p className="mt-1.5 text-sm leading-6 text-[#57534E] dark:text-stone-300">{t("public.marketing.schools.progressDescription")}</p>
            </article>
          </div>
        </div>
      </section>

      <MarketingCTA
        title={t("public.marketing.schools.ctaTitle")}
        description={t("public.marketing.schools.ctaDescription")}
        primaryLabel={t("public.marketing.common.talkToUs")}
        primaryTo="/contact?topic=School%20setup"
        secondaryLabel={t("public.navigation.pricing")}
        secondaryTo="/pricing"
      />
    </div>
  );
}

export { SchoolsPage as ForSchoolsPage };
