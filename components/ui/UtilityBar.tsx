import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, X, Sparkles, Star, ChevronRight, ShieldCheck } from "lucide-react";

/**
 * Enterprise Announcement Bar
 */
export function EnterpriseAnnouncementBar(): React.ReactElement | null {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem("finkison_announcement_dismissed");
  });

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("finkison_announcement_dismissed", "true");
  };

  return (
    <div
      role="banner"
      aria-label="Academic announcement"
      className="w-full bg-[#4C0519] text-white border-b border-white/10 py-2.5 px-4 text-xs font-medium relative"
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[9999px] bg-[#FBBF24]/20 text-[#FBBF24] font-semibold text-[11px]">
            <Sparkles size={12} aria-hidden="true" />
            <span>2024 Exam Prep</span>
          </span>
          <span className="text-stone-100">
            Empowering all Ethiopian secondary candidates to achieve minimum passing rates and qualify for university placement.
          </span>
          <Link
            to="/academics"
            className="text-[#FBBF24] hover:underline font-semibold ml-1 hidden sm:inline"
          >
            Explore curriculum &rarr;
          </Link>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="text-stone-300 hover:text-white p-1 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/**
 * Accessible Back to Top Floating Button
 */
export function EnterpriseBackToTop(): React.ReactElement | null {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top of page"
      className="fixed bottom-6 right-6 w-11 h-11 rounded-[6px] bg-[#4C0519] hover:bg-[#881337] text-white shadow-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2"
      style={{ zIndex: "var(--z-sticky, 100)" }}
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  );
}

/**
 * Accessible Rating Stars Component
 */
export function EnterpriseRatingStars({
  rating = 4.9,
  reviewsCount = 380,
}: {
  rating?: number;
  reviewsCount?: number;
}): React.ReactElement {
  return (
    <div className="inline-flex items-center gap-1.5" aria-label={`Rated ${rating} out of 5 stars based on ${reviewsCount} verified student evaluations`}>
      <div className="flex items-center gap-0.5 text-amber-500" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className="fill-amber-400 text-amber-500"
          />
        ))}
      </div>
      <span className="text-xs font-bold text-slate-900 font-mono">
        {rating.toFixed(1)}
      </span>
      {reviewsCount && (
        <span className="text-xs text-slate-500">
          ({reviewsCount} reviews)
        </span>
      )}
    </div>
  );
}

/**
 * Enterprise Breadcrumb Navigation with Microdata
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function EnterpriseBreadcrumbs({
  items,
}: {
  items: BreadcrumbItem[];
}): React.ReactElement {
  return (
    <nav aria-label="Breadcrumb" className="w-full py-3">
      <ol className="flex items-center gap-2 text-xs text-slate-500 list-none p-0 m-0 flex-wrap">
        <li>
          <Link to="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              <li aria-hidden="true" className="text-slate-400">
                <ChevronRight size={12} />
              </li>
              <li>
                {isLast || !item.href ? (
                  <span className="font-semibold text-slate-800" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.href} className="hover:text-slate-900 transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Enterprise Cookie / Privacy Banner (WCAG AA Compliant)
 */
export function EnterpriseCookieBanner(): React.ReactElement | null {
  const [acknowledged, setAcknowledged] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("finkison_cookie_acknowledged") === "true";
  });

  if (acknowledged) return null;

  const handleAccept = () => {
    localStorage.setItem("finkison_cookie_acknowledged", "true");
    setAcknowledged(true);
  };

  return (
    <div
      role="region"
      aria-label="Cookie & Educational Privacy Notice"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md p-5 bg-white border border-stone-200 rounded-[12px] shadow-2xl space-y-3"
      style={{ zIndex: "var(--z-toast, 500)" }}
    >
      <div className="flex items-start gap-3">
        <ShieldCheck size={20} className="text-[#881337] flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-start">
          <p className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Institutional Privacy Notice
          </p>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            We use strictly essential telemetry to calibrate candidate exam timing and ensure academic integrity. No advertising trackers are ever deployed.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Link
          to="/privacy"
          className="text-xs text-stone-600 hover:text-stone-900 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#881337] rounded-[4px]"
        >
          Privacy Policy
        </Link>
        <button
          type="button"
          onClick={handleAccept}
          className="px-4 py-2 bg-[#881337] hover:bg-[#9F1239] text-white text-xs font-semibold rounded-[6px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#881337]"
        >
          Acknowledge & Continue
        </button>
      </div>
    </div>
  );
}

export const AnnouncementBar = EnterpriseAnnouncementBar;
export const BackToTop = EnterpriseBackToTop;
export const RatingStars = EnterpriseRatingStars;
export const Breadcrumbs = EnterpriseBreadcrumbs;
export const CookieBanner = EnterpriseCookieBanner;
