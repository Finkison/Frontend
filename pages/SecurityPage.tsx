import React from "react";
import { ArrowRight, Brain, KeyRound, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";

export default function SecurityPage(): React.ReactElement {
  const { t } = useI18n();
  usePageMeta(t("public.pages.securityTitle"), t("public.pages.securityDescription"));

  const controls = [
    {
      icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
      title: t("public.securityInfo.accessTitle"),
      description: t("public.securityInfo.accessBody"),
    },
    {
      icon: <KeyRound className="h-5 w-5" aria-hidden="true" />,
      title: t("public.securityInfo.sessionsTitle"),
      description: t("public.securityInfo.sessionsBody"),
    },
    {
      icon: <Users className="h-5 w-5" aria-hidden="true" />,
      title: t("public.securityInfo.schoolTitle"),
      description: t("public.securityInfo.schoolBody"),
    },
    {
      icon: <Brain className="h-5 w-5" aria-hidden="true" />,
      title: t("public.securityInfo.aiTitle"),
      description: t("public.securityInfo.aiBody"),
    },
  ];

  return (
    <div className="public-dark-page min-h-screen bg-white font-sans text-[#261E1A] dark:bg-[#261E1A] dark:text-[#FDFBF7]">
      <section className="border-b border-white/10 bg-[#4C0519] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl space-y-5 px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold tracking-wide text-[#FBBF24]">{t("public.securityInfo.eyebrow")}</p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {t("public.pages.securityTitle")}
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-[#F5E9E2] sm:text-lg">
            {t("public.pages.securityDescription")}
          </p>
          <Link to="/privacy" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            {t("public.securityInfo.privacyLink")}<ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="bg-[#FAF8F5] py-12 dark:bg-[#1C1512] sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {controls.map((control) => (
              <article key={control.title} className="rounded-2xl border border-[#E7E0D6] bg-white p-6 dark:border-white/10 dark:bg-[#261E1A] sm:p-7">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#881337] dark:bg-[#4C0519] dark:text-[#FBBF24]">
                  {control.icon}
                </span>
                <h2 className="text-lg font-semibold tracking-tight text-[#1C1512] dark:text-[#FDFBF7]">{control.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#574C43] dark:text-[#D6CFC8]">{control.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl border border-[#E7E0D6] bg-white p-6 dark:border-white/10 dark:bg-[#261E1A] sm:flex-row sm:items-center sm:p-8">
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold tracking-tight text-[#1C1512] dark:text-[#FDFBF7]">{t("public.securityInfo.contactTitle")}</h2>
              <p className="mt-2 text-sm leading-6 text-[#574C43] dark:text-[#D6CFC8]">{t("public.securityInfo.contactBody")}</p>
            </div>
            <Link to="/contact?topic=Security%20and%20data" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-[#FBBF24] px-5 py-2.5 text-sm font-semibold text-[#1C1512] transition-colors hover:bg-[#F59E0B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337]">
              {t("public.securityInfo.contactButton")}<ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
