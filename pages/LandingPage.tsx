import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  FlaskConical,
  GraduationCap,
  Repeat,
  School,
  UserCheck,
  Users,
} from "lucide-react";

import { LandingHero } from "../components/landing";
import { Accordion, BackToTop, CookieBanner } from "../components/ui";
import { SectionHeader } from "../components/typography/SectionHeader";
import { usePageMeta } from "../hooks/usePageMeta";
import { useI18n } from "../i18n";
import { MarketingSteps } from "../components/landing/MarketingSections";

const LEARNING_TOOLS = [
  {
    icon: BookOpen,
    titleKey: "public.home.lessonsTitle",
    descriptionKey: "public.home.lessonsDescription",
    link: "/academics",
    linkTextKey: "public.home.lessonsLink",
  },
  {
    icon: ClipboardList,
    titleKey: "public.home.practiceTitle",
    descriptionKey: "public.home.practiceDescription",
    link: "/academics",
    linkTextKey: "public.home.practiceLink",
  },
  {
    icon: FlaskConical,
    titleKey: "public.home.scienceTitle",
    descriptionKey: "public.home.scienceDescription",
    link: "/ai-features",
    linkTextKey: "public.home.scienceLink",
  },
  {
    icon: Repeat,
    titleKey: "public.home.reviewTitle",
    descriptionKey: "public.home.reviewDescription",
    link: "/ai-features",
    linkTextKey: "public.home.reviewLink",
  },
];

const AUDIENCES = [
  {
    icon: GraduationCap,
    titleKey: "public.home.studentsTitle",
    descriptionKey: "public.home.studentsDescription",
    link: "/for-students",
    linkTextKey: "public.home.studentsLink",
  },
  {
    icon: UserCheck,
    titleKey: "public.home.teachersTitle",
    descriptionKey: "public.home.teachersDescription",
    link: "/for-teachers",
    linkTextKey: "public.home.teachersLink",
  },
  {
    icon: School,
    titleKey: "public.home.schoolsTitle",
    descriptionKey: "public.home.schoolsDescription",
    link: "/for-schools",
    linkTextKey: "public.home.schoolsLink",
  },
  {
    icon: Users,
    titleKey: "public.home.familiesTitle",
    descriptionKey: "public.home.familiesDescription",
    link: "/for-families",
    linkTextKey: "public.home.familiesLink",
  },
];

const FAQS = [
  {
    id: "grades",
    questionKey: "public.home.faqGradesQuestion",
    answerKey: "public.home.faqGradesAnswer",
  },
  {
    id: "student-tools",
    questionKey: "public.home.faqStudentQuestion",
    answerKey: "public.home.faqStudentAnswer",
  },
  {
    id: "schools",
    questionKey: "public.home.faqSchoolsQuestion",
    answerKey: "public.home.faqSchoolsAnswer",
  },
];

export default function LandingPage(): React.ReactElement {
  const { t } = useI18n();
  usePageMeta(
    t("public.hero.title"),
    t("public.hero.description")
  );

  const localizedFaqs = FAQS.map((faq) => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  return (
    <div className="public-page min-h-screen bg-[#FAF8F5] font-sans text-stone-900 selection:bg-[#FECDD3] selection:text-[#4C0519] dark:bg-[#1C1512] dark:text-[#FDFBF7]">
      <LandingHero />

      <section className="relative z-10 -mt-5 pb-2" aria-labelledby="home-scope-heading">
        <div className="container">
          <h2 id="home-scope-heading" className="sr-only">{t("public.home.scopeHeading")}</h2>
          <dl className="grid overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg shadow-[#261E1A]/10 dark:border-white/10 dark:bg-[#261E1A] sm:grid-cols-3 sm:divide-x sm:divide-stone-200 dark:sm:divide-white/10">
            <div className="border-b border-stone-200 px-5 py-4 dark:border-white/10 sm:border-b-0 sm:px-6 sm:py-5">
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400">{t("public.home.scopeCurriculumLabel")}</dt>
              <dd className="mt-1.5 text-sm font-semibold leading-6 text-stone-900 dark:text-white">{t("public.home.scopeCurriculumValue")}</dd>
            </div>
            <div className="border-b border-stone-200 px-5 py-4 dark:border-white/10 sm:border-b-0 sm:px-6 sm:py-5">
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400">{t("public.home.scopeLanguagesLabel")}</dt>
              <dd className="mt-1.5 text-sm font-semibold leading-6 text-stone-900 dark:text-white">{t("public.home.scopeLanguagesValue")}</dd>
            </div>
            <div className="px-5 py-4 sm:px-6 sm:py-5">
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400">{t("public.home.scopeAudienceLabel")}</dt>
              <dd className="mt-1.5 text-sm font-semibold leading-6 text-stone-900 dark:text-white">{t("public.home.scopeAudienceValue")}</dd>
            </div>
          </dl>
        </div>
      </section>

      <MarketingSteps
        id="learning-journey-heading"
        title={t("public.marketing.home.journeyTitle")}
        description={t("public.marketing.home.journeyDescription")}
        tone="white"
        items={[
          { icon: BookOpen, title: t("public.marketing.home.step1Title"), description: t("public.marketing.home.step1Description") },
          { icon: ClipboardList, title: t("public.marketing.home.step2Title"), description: t("public.marketing.home.step2Description") },
          { icon: Repeat, title: t("public.marketing.home.step3Title"), description: t("public.marketing.home.step3Description") },
          { icon: GraduationCap, title: t("public.marketing.home.step4Title"), description: t("public.marketing.home.step4Description") },
        ]}
      />

      <section className="section border-b border-stone-200 bg-[#FAF8F5] dark:border-white/10 dark:bg-[#1C1512]" aria-labelledby="learning-tools-heading">
        <div className="container space-y-7 sm:space-y-8">
          <SectionHeader
            id="learning-tools-heading"
            align="start"
            title={t("public.home.toolsHeading")}
          />

          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-4">
            {LEARNING_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <article
                  key={tool.titleKey}
                  className="group flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5 transition-colors hover:border-[#881337]/35 hover:shadow-sm dark:border-white/10 dark:bg-[#261E1A] dark:hover:bg-[#30241F] sm:p-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#FECDD3] bg-[#FFF1F2] text-[#881337] dark:border-[#881337]/40 dark:bg-[#881337]/20 dark:text-[#FBBF24]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-bold tracking-tight text-stone-900 dark:text-white">{t(tool.titleKey)}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-6 text-stone-600 dark:text-stone-300">{t(tool.descriptionKey)}</p>
                  <Link
                    to={tool.link}
                    className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 dark:text-[#FBBF24] dark:focus:ring-offset-[#261E1A]"
                  >
                    {t(tool.linkTextKey)}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section border-b border-stone-200 bg-white dark:border-white/10 dark:bg-[#1C1512]" aria-labelledby="audience-heading">
        <div className="container space-y-7 sm:space-y-8">
          <SectionHeader
            id="audience-heading"
            align="start"
            title={t("public.home.audienceHeading")}
          />

          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-4">
            {AUDIENCES.map((audience) => {
              const Icon = audience.icon;
              return (
                <article
                  key={audience.titleKey}
                  className="flex flex-col rounded-2xl border border-stone-200 bg-[#FAF8F5] p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-5"
                >
                  <div className="flex flex-1 items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4EFEA] text-[#881337] dark:bg-[#881337]/20 dark:text-[#FBBF24]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="flex flex-1 flex-col">
                      <h3 className="text-lg font-bold tracking-tight text-stone-900 dark:text-white">{t(audience.titleKey)}</h3>
                      <p className="mt-1.5 max-w-lg flex-1 text-sm leading-6 text-stone-600 dark:text-stone-300">{t(audience.descriptionKey)}</p>
                    </div>
                  </div>
                  <Link
                    to={audience.link}
                    className="mt-4 inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 dark:text-[#FBBF24] dark:focus:ring-offset-[#261E1A]"
                  >
                    {t(audience.linkTextKey)}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section border-b border-stone-200 bg-white dark:border-white/10 dark:bg-[#1C1512]" aria-labelledby="faq-heading">
        <div className="container grid gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <SectionHeader
              id="faq-heading"
              align="start"
              title={t("public.home.faqHeading")}
            />
          </div>
          <div className="lg:col-span-8">
            <Accordion items={localizedFaqs} allowMultiple={false} defaultOpenId="" />
          </div>
        </div>
      </section>

      <section className="bg-[#4C0519] py-12 text-white sm:py-16" aria-labelledby="cta-heading">
        <div className="container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <h2 id="cta-heading" className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {t("public.home.ctaTitle")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-200 sm:text-base">
              {t("public.home.ctaDescription")}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FBBF24] px-5 py-3 text-sm font-bold text-[#1C1512] transition-colors hover:bg-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]"
            >
              {t("public.hero.primaryCta")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/contact?topic=School%20setup"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]"
            >
              {t("public.marketing.common.talkToUs")}
            </Link>
          </div>
        </div>
      </section>

      <BackToTop />
      <CookieBanner />
    </div>
  );
}
