import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bell, BookOpenCheck, MessageCircle, Users } from "lucide-react";
import { MarketingCTA, MarketingSteps } from "../components/landing/MarketingSections";
import { MarketingPageHero } from "../components/landing/MarketingPageHero";
import { usePageMeta } from "../hooks/usePageMeta";
import { useI18n } from "../i18n";

export default function FamiliesPage(): React.ReactElement {
  const { t } = useI18n();
  usePageMeta(t("public.pages.familiesTitle"), t("public.pages.familiesDescription"));

  return (
    <div className="public-page min-h-screen bg-white font-sans text-[#261E1A] selection:bg-[#FFF1F2] selection:text-[#881337] dark:bg-[#1C1512] dark:text-stone-100">
      <MarketingPageHero
        title={t("public.pages.familiesTitle")}
        description={t("public.pages.familiesDescription")}
        panelTitle={t("public.marketing.families.panelTitle")}
        panelItems={[
          t("public.marketing.families.panel1"),
          t("public.marketing.families.panel2"),
          t("public.marketing.families.panel3"),
        ]}
        actions={
          <>
            <Link to="/register?role=parent" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#FBBF24] px-5 py-3 text-sm font-bold text-[#1C1512] transition-colors hover:bg-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]">
              {t("public.marketing.families.createAccount")}<ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/login" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]">
              {t("public.navigation.signIn")}
            </Link>
          </>
        }
      />

      <MarketingSteps
        id="family-journey-heading"
        title={t("public.marketing.families.journeyTitle")}
        description={t("public.marketing.families.journeyDescription")}
        tone="cream"
        items={[
          { icon: Users, title: t("public.marketing.families.step1Title"), description: t("public.marketing.families.step1Description") },
          { icon: BookOpenCheck, title: t("public.marketing.families.step2Title"), description: t("public.marketing.families.step2Description") },
          { icon: Bell, title: t("public.marketing.families.step3Title"), description: t("public.marketing.families.step3Description") },
          { icon: MessageCircle, title: t("public.marketing.families.step4Title"), description: t("public.marketing.families.step4Description") },
        ]}
      />

      <section className="border-t border-[#E7E0D6] bg-[#FAF8F5] py-6 dark:border-white/10 dark:bg-[#1C1512]">
        <div className="container flex flex-col gap-2 text-sm leading-6 text-[#57534E] dark:text-stone-300 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("public.copy.familyPrivacyNote")}</p>
          <Link to="/privacy" className="shrink-0 font-semibold text-[#881337] underline-offset-4 hover:underline dark:text-[#FBBF24]">{t("public.footer.privacy")}</Link>
        </div>
      </section>

      <MarketingCTA
        title={t("public.marketing.families.ctaTitle")}
        description={t("public.marketing.families.ctaDescription")}
        primaryLabel={t("public.marketing.families.createAccount")}
        primaryTo="/register?role=parent"
        secondaryLabel={t("public.navigation.contact")}
        secondaryTo="/contact?topic=Other"
      />
    </div>
  );
}
