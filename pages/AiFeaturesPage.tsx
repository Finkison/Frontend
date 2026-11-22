import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Brain, ClipboardList, FlaskConical, Repeat, Sliders } from "lucide-react";
import { MarketingCTA, MarketingSteps } from "../components/landing/MarketingSections";
import { MarketingPageHero } from "../components/landing/MarketingPageHero";
import { usePageMeta } from "../hooks/usePageMeta";
import { useI18n } from "../i18n";

export default function AiFeaturesPage(): React.ReactElement {
  const { t } = useI18n();
  usePageMeta(t("public.pages.learningTitle"), t("public.pages.learningDescription"));

  return (
    <div className="public-page min-h-screen bg-[#FAF8F5] font-sans text-[#261E1A] selection:bg-[#FECDD3] selection:text-[#4C0519] dark:bg-[#1C1512] dark:text-stone-100">
      <MarketingPageHero
        title={t("public.pages.learningTitle")}
        description={t("public.pages.learningDescription")}
        panelTitle={t("public.marketing.learning.panelTitle")}
        panelItems={[
          t("public.marketing.learning.panel1"),
          t("public.marketing.learning.panel2"),
          t("public.marketing.learning.panel3"),
        ]}
        actions={
          <>
            <Link to="/academics" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#FBBF24] px-5 py-3 text-sm font-bold text-[#1C1512] transition-colors hover:bg-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]">
              {t("public.home.browseCurriculum")}<ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/for-students" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]">
              {t("public.navigation.students")}
            </Link>
          </>
        }
      />

      <MarketingSteps
        id="learning-toolkit-heading"
        title={t("public.marketing.learning.flowTitle")}
        description={t("public.marketing.learning.flowDescription")}
        tone="white"
        columns={3}
        items={[
          { icon: BookOpen, title: t("public.marketing.learning.tool1Title"), description: t("public.marketing.learning.tool1Body") },
          { icon: ClipboardList, title: t("public.marketing.learning.tool2Title"), description: t("public.marketing.learning.tool2Body") },
          { icon: Repeat, title: t("public.marketing.learning.tool3Title"), description: t("public.marketing.learning.tool3Body") },
          { icon: Brain, title: t("public.marketing.learning.tool4Title"), description: t("public.marketing.learning.tool4Body") },
          { icon: FlaskConical, title: t("public.marketing.learning.tool5Title"), description: t("public.marketing.learning.tool5Body") },
          { icon: Sliders, title: t("public.marketing.learning.tool6Title"), description: t("public.marketing.learning.tool6Body") },
        ]}
      />

      <section className="border-t border-[#E7E0D6] bg-white py-14 dark:border-white/10 dark:bg-[#261E1A]" aria-labelledby="ai-audience-heading">
        <div className="container">
          <h2 id="ai-audience-heading" className="max-w-3xl text-2xl font-semibold tracking-tight text-[#261E1A] dark:text-stone-50 sm:text-3xl">
            {t("public.marketing.learning.aiReviewHeading")}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] p-5 dark:border-white/10 dark:bg-[#1C1512]">
              <h3 className="text-base font-semibold text-[#261E1A] dark:text-stone-50">{t("public.marketing.learning.studentAIHeading")}</h3>
              <p className="mt-2 text-sm leading-6 text-[#57534E] dark:text-stone-300">{t("public.marketing.learning.studentAIBody")}</p>
            </article>
            <article className="rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] p-5 dark:border-white/10 dark:bg-[#1C1512]">
              <h3 className="text-base font-semibold text-[#261E1A] dark:text-stone-50">{t("public.marketing.learning.teacherAIHeading")}</h3>
              <p className="mt-2 text-sm leading-6 text-[#57534E] dark:text-stone-300">{t("public.marketing.learning.teacherAIBody")}</p>
            </article>
          </div>
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
            {t("public.marketing.learning.aiReviewBody")}
          </p>
        </div>
      </section>

      <section className="border-t border-[#E7E0D6] bg-[#FAF8F5] py-7 dark:border-white/10 dark:bg-[#1C1512]">
        <div className="container flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-[#57534E] dark:text-stone-300">{t("public.copy.aiPrivacyBody")}</p>
          <Link to="/privacy" className="inline-flex min-h-10 shrink-0 items-center gap-2 text-sm font-semibold text-[#881337] underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-[#881337] dark:text-[#FBBF24]">
            {t("public.copy.privacyPolicy")}<ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <MarketingCTA
        title={t("public.marketing.learning.panelTitle")}
        description={t("public.marketing.learning.flowDescription")}
        primaryLabel={t("public.home.browseCurriculum")}
        primaryTo="/academics"
        secondaryLabel={t("public.marketing.common.talkToUs")}
        secondaryTo="/contact"
      />
    </div>
  );
}

export { AiFeaturesPage as AIFeaturesPage };
