import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { getNavigationForRole, type NavItem } from "./navigationConfig";
import { useI18n } from "../../i18n";
import { MoreHorizontal, X } from "lucide-react";

export interface BottomTabBarProps {
  overrideRole?: string;
  className?: string;
}

export default function BottomTabBar({ overrideRole, className = "" }: BottomTabBarProps): React.ReactElement | null {
  const { user } = useAuthStore();
  const { t } = useI18n();
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLElement>(null);
  const effectiveRole = overrideRole || user?.role || "STUDENT";
  const navConfig = getNavigationForRole(effectiveRole, user?.grade);

  const tabs = navConfig.mobileBottomTabs || [];

  useEffect(() => {
    setIsMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMoreOpen) return;

    const closeOnOutsideInteraction = (event: PointerEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMoreOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideInteraction);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideInteraction);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMoreOpen]);

  const moreItems = useMemo(() => {
    const visibleIds = new Set(tabs.slice(0, 4).map((item) => item.id));
    return [
      ...navConfig.primaryNav,
      ...navConfig.secondaryNav.items,
      ...navConfig.bottomItems,
    ].filter((item, index, all) => !visibleIds.has(item.id) && all.findIndex((candidate) => candidate.id === item.id) === index);
  }, [navConfig, tabs]);

  const isMoreActive = moreItems.some((item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`));

  if (tabs.length === 0) return null;

  const renderItem = (tab: NavItem) => {
    const Icon = tab.icon;
    return (
      <NavLink
        key={tab.id}
        to={tab.to}
        end={tab.to === "/school" || tab.to === "/teacher" || tab.to === "/student" || tab.to === "/parent"}
        className={({ isActive }) =>
          `relative flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[44px] py-1 transition-all focus:outline-none focus:ring-2 focus:ring-[#881337]/30 rounded-xl active:scale-95 ${
            isActive ? "text-[#881337] font-bold" : "text-[#5C5046] hover:text-[#261E1A] dark:text-[#A89C90] dark:hover:text-white font-medium"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110 text-[#881337] dark:text-[#FBBF24]" : "text-[#5C5046] dark:text-[#A89C90]"}`} aria-hidden="true" />
            <span className="text-[11px] leading-3 mt-1 truncate max-w-[64px]">{t(`appNavigation.items.${tab.labelKey}`)}</span>
            {isActive && <span className="absolute bottom-1 w-6 h-0.5 bg-[#881337] dark:bg-[#FBBF24] rounded-full" />}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <nav
      ref={moreMenuRef}
      aria-label={t("appNavigation.mobileTabs")}
      className={`lg:hidden fixed bottom-0 left-0 right-0 min-h-[64px] pb-[max(0.25rem,env(safe-area-inset-bottom,0px))] bg-white/95 dark:bg-[#1C1512]/95 backdrop-blur-md border-t border-[#E7E0D6] dark:border-white/10 z-30 px-2 flex items-center justify-around select-none shadow-md ${className}`}
    >
      {tabs.slice(0, 4).map(renderItem)}
      <button type="button" aria-expanded={isMoreOpen} aria-controls="mobile-more-menu" aria-haspopup="menu" onClick={() => setIsMoreOpen((open) => !open)} className={`relative flex flex-1 flex-col items-center justify-center min-h-[48px] min-w-[44px] rounded-xl py-1 text-[11px] font-medium focus:outline-none focus:ring-2 focus:ring-[#881337]/30 ${isMoreActive || isMoreOpen ? "text-[#881337] font-bold dark:text-[#FBBF24]" : "text-[#5C5046] dark:text-[#A89C90]"}`}>
        {isMoreOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <MoreHorizontal className="h-5 w-5" aria-hidden="true" />}
        <span className="mt-1 leading-3">{t("appNavigation.items.more")}</span>
        {isMoreActive && !isMoreOpen && <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-[#881337] dark:bg-[#FBBF24]" />}
      </button>
      {isMoreOpen && <div id="mobile-more-menu" className="absolute bottom-[calc(100%+0.5rem)] left-2 right-2 max-h-[min(70vh,30rem)] overflow-y-auto rounded-2xl border border-[#E7E0D6] bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#261E1A]" role="menu" aria-label={t("appNavigation.items.more")}>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
          {moreItems.map((item) => {
            const Icon = item.icon;
            return <NavLink key={item.id} to={item.to} end={item.to === "/school" || item.to === "/teacher" || item.to === "/student" || item.to === "/parent"} role="menuitem" className={({ isActive }) => `flex min-h-11 items-center gap-2 rounded-xl px-3 text-left text-xs font-semibold ${isActive ? "bg-[#FFF1F2] text-[#881337] dark:bg-[#4C0519]/40 dark:text-[#FBBF24]" : "text-[#5C5046] hover:bg-[#FAF8F5] dark:text-[#E7E0D6] dark:hover:bg-white/5"}`}><Icon className="h-4 w-4 shrink-0" aria-hidden="true" />{t(`appNavigation.items.${item.labelKey}`)}</NavLink>;
          })}
        </div>
      </div>}
    </nav>
  );
}
