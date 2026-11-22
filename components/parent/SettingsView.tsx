import React from "react";
import { Globe2, Moon, UserRound } from "lucide-react";
import useAuthStore from "../../store/authStore";
import PublicPreferences from "../shared/PublicPreferences";
import PageHeader from "../shared/PageHeader";
import { useI18n } from "../../i18n";
import PortalPage from "../shared/PortalPage";

export default function ParentSettingsView(): React.ReactElement {
  const { t } = useI18n();
  const user = useAuthStore((state) => state.user);

  return (
    <PortalPage className="max-w-3xl space-y-6">
      <PageHeader
        eyebrow={t("parentSettings.eyebrow")}
        title={t("parentSettings.title")}
        description={t("parentSettings.description")}
      />

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-6" aria-labelledby="parent-account-heading">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#881337] dark:bg-[#4C0519]/40 dark:text-[#FBBF24]"><UserRound className="h-5 w-5" aria-hidden="true" /></span>
          <div className="min-w-0 flex-1">
            <h2 id="parent-account-heading" className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("parentSettings.account")}</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs text-stone-500 dark:text-[#A89C90]">{t("parentSettings.name")}</dt><dd className="mt-1 truncate text-sm font-medium text-stone-800 dark:text-[#E7E0D6]">{user?.fullName || user?.name || t("parentSettings.notProvided")}</dd></div>
              <div><dt className="text-xs text-stone-500 dark:text-[#A89C90]">{t("parentSettings.email")}</dt><dd className="mt-1 truncate text-sm font-medium text-stone-800 dark:text-[#E7E0D6]">{user?.email || t("parentSettings.notProvided")}</dd></div>
            </dl>
            <p className="mt-4 text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t("parentSettings.accountHelp")}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-6" aria-labelledby="parent-preferences-heading">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4EFEA] text-[#881337] dark:bg-white/10 dark:text-[#FBBF24]"><Globe2 className="h-5 w-5" aria-hidden="true" /></span>
          <div className="min-w-0 flex-1">
            <h2 id="parent-preferences-heading" className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("parentSettings.preferences")}</h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-[#E7E0D6]">{t("parentSettings.preferencesDescription")}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <PublicPreferences variant="drawer" />
              <span className="inline-flex items-center gap-2 text-xs text-stone-500 dark:text-[#A89C90]"><Moon className="h-4 w-4" aria-hidden="true" />{t("parentSettings.themeDescription")}</span>
            </div>
          </div>
        </div>
      </section>
    </PortalPage>
  );
}
