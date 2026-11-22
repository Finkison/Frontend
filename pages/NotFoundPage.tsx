import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, BookOpen } from "lucide-react";
import { FinkisonMark } from "../components/shared/FinkisonLogo";
import { useI18n } from "../i18n";

export default function NotFoundPage(): React.ReactElement {
  const { t } = useI18n();
  useEffect(() => {
    document.title = `${t("public.notFound.title")} | Finkison`;
  }, [t]);

  return (
    <div className="public-dark-page min-h-[70vh] flex items-center justify-center px-4 bg-[#FAF8F5] dark:bg-[#1C1512] text-[#1C1512] font-sans">
      <div className="text-center max-w-lg space-y-6 p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#261E1A] border border-[#E8E2D9] shadow-xs">

        <div className="flex justify-center">
          <FinkisonMark size={64} />
        </div>

        <div>
          <span className="text-5xl font-mono font-bold text-[#881337] tracking-tight block">404</span>
          <h1 className="text-2xl font-bold text-[#1C1512] mt-2 tracking-tight">{t("public.notFound.title")}</h1>
          <p className="text-sm text-[#574C43] dark:text-[#E7E0D6] mt-2 leading-relaxed">
            {t("public.notFound.description")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[6px] bg-[#881337] hover:bg-[#9F1239] active:bg-[#BE123C] text-white text-xs font-semibold transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-[#881337]"
          >
            <Home className="w-4 h-4 text-white" />
            <span>{t("public.notFound.home")}</span>
          </Link>
          <Link
            to="/academics"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[6px] border border-[#E8E2D9] hover:bg-[#FAF8F5] dark:hover:bg-white/5 text-[#1C1512] dark:text-[#FDFBF7] text-xs font-semibold transition-colors"
          >
            <BookOpen className="w-4 h-4 text-[#574C43] dark:text-[#E7E0D6]" />
            <span>{t("public.notFound.curriculum")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
