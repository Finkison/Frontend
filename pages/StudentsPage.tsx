import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Brain, FlaskConical, Repeat } from "lucide-react";
import { MarketingCTA, MarketingSteps } from "../components/landing/MarketingSections";
import { MarketingPageHero } from "../components/landing/MarketingPageHero";
import { usePageMeta } from "../hooks/usePageMeta";
import { useI18n } from "../i18n";

export default function StudentsPage(): React.ReactElement {
  const { t } = useI18n();
  usePageMeta(t("public.pages.studentsTitle"), t("public.pages.studentsDescription"));

  return (
    <div className="public-page min-h-screen bg-white font-sans text-[#261E1A] selection:bg-[#FFF1F2] selection:text-[#881337] dark:bg-[#1C1512] dark:text-stone-100">
      <MarketingPageHero
        title={t("public.pages.studentsTitle")}
        description={t("public.pages.studentsDescription")}
        panelTitle={t("public.marketing.students.panelTitle")}
        panelItems={[
          t("public.marketing.students.panel1"),
          t("public.marketing.students.panel2"),
          t("public.marketing.students.panel3"),
        ]}
        actions={
          <>
            <Link to="/register?role=student" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#FBBF24] px-5 py-3 text-sm font-bold text-[#1C1512] transition-colors hover:bg-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]">
              {t("start_learning")}<ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/academics" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]">
              {t("public.home.browseCurriculum")}
            </Link>
          </>
        }
      />

      <MarketingSteps
        id="student-journey-heading"
        title={t("public.marketing.students.journeyTitle")}
        description={t("public.marketing.students.journeyDescription")}
        tone="cream"
        items={[
          { title: t("public.marketing.students.step1Title"), description: t("public.marketing.students.step1Description") },
          { title: t("public.marketing.students.step2Title"), description: t("public.marketing.students.step2Description") },
          { title: t("public.marketing.students.step3Title"), description: t("public.marketing.students.step3Description") },
          { title: t("public.marketing.students.step4Title"), description: t("public.marketing.students.step4Description") },
        ]}
      />

      <MarketingSteps
        id="student-tools-heading"
        title={t("public.marketing.students.toolsTitle")}
        description={t("public.marketing.students.toolsDescription")}
        tone="white"
        items={[
          { icon: BookOpen, title: t("public.marketing.students.tool1Title"), description: t("public.marketing.students.tool1Body") },
          { icon: Brain, title: t("public.marketing.students.tool2Title"), description: t("public.marketing.students.tool2Body") },
          { icon: FlaskConical, title: t("public.marketing.students.tool3Title"), description: t("public.marketing.students.tool3Body") },
          { icon: Repeat, title: t("public.marketing.students.tool4Title"), description: t("public.marketing.students.tool4Body") },
        ]}
      />

      <MarketingCTA
        title={t("public.home.ctaTitle")}
        description={t("public.home.ctaDescription")}
        primaryLabel={t("public.home.browseCurriculum")}
        primaryTo="/academics"
        secondaryLabel={t("public.marketing.common.learnMore")}
        secondaryTo="/ai-features"
      />
    </div>
  );
}

export { StudentsPage as ForStudentsPage };
