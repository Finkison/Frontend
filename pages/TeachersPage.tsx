import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, FileSpreadsheet, Layers, Users } from "lucide-react";
import { MarketingCTA, MarketingSteps } from "../components/landing/MarketingSections";
import { MarketingPageHero } from "../components/landing/MarketingPageHero";
import { usePageMeta } from "../hooks/usePageMeta";
import { useI18n } from "../i18n";

export default function TeachersPage(): React.ReactElement {
  const { t } = useI18n();
  usePageMeta(t("public.pages.teachersTitle"), t("public.pages.teachersDescription"));

  return (
    <div className="public-page min-h-screen bg-white font-sans text-[#261E1A] selection:bg-[#FFF1F2] selection:text-[#881337] dark:bg-[#1C1512] dark:text-stone-100">
      <MarketingPageHero
        title={t("public.pages.teachersTitle")}
        description={t("public.pages.teachersDescription")}
        panelTitle={t("public.marketing.teachers.panelTitle")}
        panelItems={[
          t("public.marketing.teachers.panel1"),
          t("public.marketing.teachers.panel2"),
          t("public.marketing.teachers.panel3"),
        ]}
        actions={
          <>
            <Link to="/contact?topic=School%20setup" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#FBBF24] px-5 py-3 text-sm font-bold text-[#1C1512] transition-colors hover:bg-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]">
              {t("public.marketing.common.talkToUs")}<ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/academics" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]">
              {t("public.home.browseCurriculum")}
            </Link>
          </>
        }
      />

      <MarketingSteps
        id="teacher-workflow-heading"
        title={t("public.marketing.teachers.workflowTitle")}
        description={t("public.marketing.teachers.workflowDescription")}
        tone="cream"
        items={[
          { title: t("public.marketing.teachers.step1Title"), description: t("public.marketing.teachers.step1Description") },
          { title: t("public.marketing.teachers.step2Title"), description: t("public.marketing.teachers.step2Description") },
          { title: t("public.marketing.teachers.step3Title"), description: t("public.marketing.teachers.step3Description") },
          { title: t("public.marketing.teachers.step4Title"), description: t("public.marketing.teachers.step4Description") },
        ]}
      />

      <MarketingSteps
        id="teacher-tools-heading"
        title={t("public.marketing.teachers.toolsTitle")}
        tone="white"
        items={[
          { icon: Layers, title: t("public.marketing.teachers.tool1Title"), description: t("public.marketing.teachers.tool1Body") },
          { icon: FileSpreadsheet, title: t("public.marketing.teachers.tool2Title"), description: t("public.marketing.teachers.tool2Body") },
          { icon: BarChart3, title: t("public.marketing.teachers.tool3Title"), description: t("public.marketing.teachers.tool3Body") },
          { icon: Users, title: t("public.marketing.teachers.tool4Title"), description: t("public.marketing.teachers.tool4Body") },
        ]}
      />

      <MarketingCTA
        title={t("public.marketing.teachers.ctaTitle")}
        description={t("public.marketing.teachers.ctaDescription")}
        primaryLabel={t("public.marketing.common.talkToUs")}
        primaryTo="/contact?topic=School%20setup"
        secondaryLabel={t("public.pages.pricingTitle")}
        secondaryTo="/pricing"
      />
    </div>
  );
}

export { TeachersPage as ForTeachersPage };
