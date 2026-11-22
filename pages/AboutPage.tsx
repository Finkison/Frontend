import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, School, Target, UserCheck, Users } from "lucide-react";
import { MarketingCTA, MarketingSteps } from "../components/landing/MarketingSections";
import { MarketingPageHero } from "../components/landing/MarketingPageHero";
import { SectionHeader } from "../components/typography/SectionHeader";
import { usePageMeta } from "../hooks/usePageMeta";
import { useI18n } from "../i18n";

const AUDIENCES = [
  {
    icon: GraduationCap,
    titleKey: "public.footer.students",
    descriptionKey: "public.navigation.studentsDescription",
    to: "/for-students",
    linkKey: "public.home.studentsLink",
  },
  {
    icon: Users,
    titleKey: "public.footer.teachers",
    descriptionKey: "public.navigation.teachersDescription",
    to: "/for-teachers",
    linkKey: "public.home.teachersLink",
  },
  {
    icon: School,
    titleKey: "public.footer.schools",
    descriptionKey: "public.navigation.schoolsDescription",
    to: "/for-schools",
    linkKey: "public.home.schoolsLink",
  },
  {
    icon: UserCheck,
    titleKey: "public.footer.families",
    descriptionKey: "public.navigation.familiesDescription",
    to: "/for-families",
    linkKey: "public.home.familiesLink",
  },
];

export default function AboutPage(): React.ReactElement {
  const { t } = useI18n();
  usePageMeta(t("public.pages.aboutTitle"), t("public.pages.aboutDescription"));

  return (
    <div className="public-page min-h-screen bg-white font-sans text-[#261E1A] selection:bg-[#FFF1F2] selection:text-[#881337] dark:bg-[#1C1512] dark:text-stone-100">
      <MarketingPageHero
        title={t("public.pages.aboutTitle")}
        description={t("public.pages.aboutDescription")}
        panelTitle={t("public.marketing.about.panelTitle")}
        panelItems={[
          t("public.marketing.about.panelStudent"),
          t("public.marketing.about.panelTeacher"),
          t("public.marketing.about.panelSchool"),
        ]}
        actions={
          <>
            <Link to="/academics" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#FBBF24] px-5 py-3 text-sm font-bold text-[#1C1512] transition-colors hover:bg-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]">
              {t("public.home.browseCurriculum")}<ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/contact" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]">
              {t("public.navigation.contact")}
            </Link>
          </>
        }
      />

      <section className="section border-b border-[#E7E0D6] bg-[#FAF8F5] dark:border-white/10 dark:bg-[#1C1512]" aria-labelledby="about-purpose-heading">
        <div className="container space-y-7 sm:space-y-8">
          <SectionHeader id="about-purpose-heading" align="start" title={t("public.marketing.about.approachTitle")} subtitle={t("public.marketing.about.approachBody")} />
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-[#E7E0D6] bg-white p-6 sm:p-7 dark:border-white/10 dark:bg-[#261E1A]">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#881337] dark:text-[#FBBF24]">{t("public.marketing.common.vision")}</p>
              <h2 className="mt-3 text-xl font-bold tracking-tight text-[#1C1512] dark:text-white">{t("public.marketing.about.visionTitle")}</h2>
              <p className="mt-2 text-sm leading-6 text-[#57534E] dark:text-stone-300">{t("public.marketing.about.visionBody")}</p>
            </article>
            <article className="rounded-2xl border border-[#E7E0D6] bg-[#4C0519] p-6 text-white sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#FDE68A]">{t("public.marketing.common.mission")}</p>
              <h2 className="mt-3 text-xl font-bold tracking-tight text-white">{t("public.marketing.about.missionTitle")}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-200">{t("public.marketing.about.missionBody")}</p>
            </article>
          </div>
        </div>
      </section>

      <MarketingSteps
        id="design-principles-heading"
        title={t("public.marketing.about.principlesTitle")}
        tone="white"
        items={[
          { icon: GraduationCap, title: t("public.marketing.about.principle1Title"), description: t("public.marketing.about.principle1Body") },
          { icon: ArrowRight, title: t("public.marketing.about.principle2Title"), description: t("public.marketing.about.principle2Body") },
          { icon: Target, title: t("public.marketing.about.principle3Title"), description: t("public.marketing.about.principle3Body") },
          { icon: UserCheck, title: t("public.marketing.about.principle4Title"), description: t("public.marketing.about.principle4Body") },
        ]}
      />

      <section className="section bg-[#FAF8F5] dark:bg-[#1C1512]" aria-labelledby="about-audiences-heading">
        <div className="container space-y-7 sm:space-y-8">
          <SectionHeader id="about-audiences-heading" align="start" title={t("public.marketing.about.panelTitle")} subtitle={t("public.marketing.about.approachBody")} />
          <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-4">
            {AUDIENCES.map(({ icon: Icon, titleKey, descriptionKey, to, linkKey }) => (
              <article key={titleKey} className="flex h-full flex-col rounded-2xl border border-[#E7E0D6] bg-white p-5 dark:border-white/10 dark:bg-[#261E1A]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FECDD3] bg-[#FFF1F2] text-[#881337] dark:border-[#881337]/40 dark:bg-[#881337]/20 dark:text-[#FBBF24]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-[#1C1512] dark:text-white">{t(titleKey)}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-6 text-[#57534E] dark:text-stone-300">{t(descriptionKey)}</p>
                <Link to={to} className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337] dark:text-[#FBBF24]">
                  {t(linkKey)}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <MarketingCTA
        title={t("public.marketing.about.panelTitle")}
        description={t("public.marketing.about.approachBody")}
        primaryLabel={t("public.marketing.common.learnMore")}
        primaryTo="/ai-features"
        secondaryLabel={t("public.marketing.common.talkToUs")}
        secondaryTo="/contact"
      />
    </div>
  );
}
