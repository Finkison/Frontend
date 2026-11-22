import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Send, Linkedin } from "lucide-react";
import FinkisonLogo from "./FinkisonLogo";
import { SITE_CONTENT } from "../../content/siteContent";
import { useI18n } from "../../i18n";

const FOOTER_LINK_KEYS: Record<string, string> = {
  "/academics": "public.footer.curriculum",
  "/ai-features": "public.footer.learningTools",
  "/pricing": "public.footer.plans",
  "/for-schools": "public.footer.schools",
  "/for-teachers": "public.footer.teachers",
  "/for-students": "public.footer.students",
  "/for-families": "public.footer.families",
  "/about": "public.footer.aboutFinkison",
  "/how-we-work": "public.footer.ourWork",
  "/contact": "public.navigation.contact",
  "/security": "public.footer.security",
  "/privacy": "public.footer.privacy",
  "/terms": "public.footer.terms",
};

export default function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear();
  const { t } = useI18n();

  return (
    <footer className="w-full bg-[#FAF8F5] text-stone-600 border-t border-[#E7E0D6] dark:bg-[#1C1512] dark:text-stone-300 dark:border-white/10">

      <div className="container mx-auto py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 pb-10 md:grid-cols-4">

          <div className="col-span-2 md:col-span-1">
            <FinkisonLogo variant="horizontal" size="md" to="/" />
            <p className="text-xs text-neutral-600 dark:text-stone-400 mt-3 leading-relaxed">
              {t("public.footer.tagline")}
            </p>

            <div className="flex gap-3 mt-4">
              <a
                href="https://facebook.com/finkison"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-200 dark:bg-[#261E1A] hover:bg-[#881337] hover:text-white flex items-center justify-center transition-colors text-stone-700 dark:text-stone-300"
                aria-label="Facebook (opens in a new tab)"
              >
                <Facebook className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://t.me/finkison_support"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-200 dark:bg-[#261E1A] hover:bg-[#881337] hover:text-white flex items-center justify-center transition-colors text-stone-700 dark:text-stone-300"
                aria-label="Telegram channel (opens in a new tab)"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://linkedin.com/company/finkison"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-200 dark:bg-[#261E1A] hover:bg-[#881337] hover:text-white flex items-center justify-center transition-colors text-stone-700 dark:text-stone-300"
                aria-label="LinkedIn (opens in a new tab)"
              >
                <Linkedin className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wider mb-3">
              {t("public.footer.explore")}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {SITE_CONTENT.footer.columns.platform.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-stone-600 dark:text-stone-400 hover:text-[#881337] dark:hover:text-[#FBBF24] transition-colors">
                    {t(FOOTER_LINK_KEYS[link.to] || link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wider mb-3">
              {t("public.footer.for")}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {SITE_CONTENT.footer.columns.solutions.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-stone-600 dark:text-stone-400 hover:text-[#881337] dark:hover:text-[#FBBF24] transition-colors">
                    {t(FOOTER_LINK_KEYS[link.to] || link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wider mb-3">
              {t("public.footer.organization")}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {SITE_CONTENT.footer.columns.organization.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-stone-600 dark:text-stone-400 hover:text-[#881337] dark:hover:text-[#FBBF24] transition-colors">
                    {t(FOOTER_LINK_KEYS[link.to] || link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-stone-200 pt-6 dark:border-white/10 md:flex-row">
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {t("public.footer.copyright", { year: currentYear })}
          </p>

          <div className="flex items-center gap-6 text-xs">
            <Link to="/privacy" className="text-stone-600 dark:text-stone-400 hover:text-[#881337] dark:hover:text-[#FBBF24] transition-colors">
              {t("public.footer.privacy")}
            </Link>
            <Link to="/terms" className="text-stone-600 dark:text-stone-400 hover:text-[#881337] dark:hover:text-[#FBBF24] transition-colors">
              {t("public.footer.terms")}
            </Link>
            <span className="text-stone-500 dark:text-stone-400">{SITE_CONTENT.footer.legal.location}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
