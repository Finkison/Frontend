import React from "react";
import { Link } from "react-router-dom";
import { 
  Scale, 
  ShieldCheck, 
  Users, 
  Clock, 
  ArrowRight 
} from "lucide-react";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";

export default function TermsPage(): React.ReactElement {
  const { t } = useI18n();
  usePageMeta(t("public.pages.termsTitle"), t("public.pages.termsDescription"));

  const TERMS = [
    {
      icon: <Scale className="w-6 h-6 text-[#881337]" />,
      title: t("public.termsInfo.useTitle"),
      body: t("public.termsInfo.useBody"),
    },
    {
      icon: <Clock className="w-6 h-6 text-[#881337]" />,
      title: t("public.termsInfo.accountTitle"),
      body: t("public.termsInfo.accountBody"),
    },
    {
      icon: <Users className="w-6 h-6 text-[#881337]" />,
      title: t("public.termsInfo.pricingTitle"),
      body: t("public.termsInfo.pricingBody"),
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#881337]" />,
      title: t("public.termsInfo.resultsTitle"),
      body: t("public.termsInfo.resultsBody"),
    },
  ];

  return (
    <div className="public-dark-page min-h-screen bg-white dark:bg-[#261E1A] text-[#261E1A] dark:text-[#FDFBF7] font-sans selection:bg-[#FFF1F2] selection:text-[#881337]">

      <section className="py-20 sm:py-28 bg-[#4C0519] text-white border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
            {t("public.pages.termsTitle")}
          </h1>
          <p className="text-base sm:text-lg text-[#E7E0D6] leading-relaxed max-w-2xl mx-auto">
            {t("public.pages.termsDescription")}
          </p>

        </div>
      </section>

      <section className="py-20 sm:py-28 bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E7E0D6] dark:border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <p className="mx-auto max-w-3xl text-sm leading-6 text-[#57534E] dark:text-stone-300">
            {t("public.termsInfo.intro")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            {TERMS.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 shadow-xs transition-shadow duration-200 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF1F2] dark:bg-[#4C0519]/40 border border-[#FECDD3] dark:border-[#881337]/50 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1C1512] tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-base text-[#57534E] leading-relaxed pt-2 border-t border-stone-100 dark:border-white/10">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-2xl text-left">
              <h3 className="text-xl font-bold text-[#1C1512]">
                {t("public.termsInfo.questionsTitle")}
              </h3>
            </div>
            <Link
              to="/contact"
              className="min-h-[44px] px-8 py-3 rounded-[8px] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-sm font-semibold transition-colors inline-flex items-center gap-2 shrink-0 shadow-sm"
            >
              <span>{t("public.termsInfo.contactUs")}</span>
              <ArrowRight className="w-4 h-4 text-[#1C1512]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
