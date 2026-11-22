import React, { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Building2,
  X,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { getNavigationForRole, type NavItem } from "./navigationConfig";
import { useI18n } from "../../i18n";

export interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  overrideRole?: string;
}

export default function Sidebar({
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
  overrideRole,
}: SidebarProps): React.ReactElement {
  const { user, role } = useAuthStore();
  const { t } = useI18n();
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const currentSchool = user?.school || t("appNavigation.defaultSchool");

  const effectiveRole = overrideRole || user?.role || role || "SCHOOL_ADMIN";
  const navConfig = getNavigationForRole(effectiveRole, user?.grade);
  const secondaryGroups = navConfig.secondaryGroups || [navConfig.secondaryNav];
  const isSecondaryRouteActive = secondaryGroups.flatMap((group) => group.items).some(
    (item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
  );
  const [openSecondaryGroups, setOpenSecondaryGroups] = React.useState<Record<string, boolean>>({});

  const compact = isCollapsed && !isMobileOpen;

  useEffect(() => {
    if (!isSecondaryRouteActive) return;
    setOpenSecondaryGroups((current) => {
      const next = { ...current };
      secondaryGroups.forEach((group, index) => {
        const key = group.groupTitleKey || `secondary-${index}`;
        if (group.items.some((item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`))) next[key] = true;
      });
      return next;
    });
  }, [isSecondaryRouteActive, location.pathname]);

  useEffect(() => {
    if (isMobileOpen) {
      onCloseMobile();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseMobile();
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !drawerRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !drawerRef.current.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.requestAnimationFrame(() => previousFocusRef.current?.focus());
    };
  }, [isMobileOpen, onCloseMobile]);

  const renderNavItem = (item: NavItem) => {

    if (item.disabled) return null;
    const Icon = item.icon;

    return (
      <NavLink
        key={item.id}
        to={item.to}
        end={item.to === "/school" || item.to === "/teacher" || item.to === "/student" || item.to === "/parent"}
        tabIndex={0}
        aria-label={compact ? t(`appNavigation.items.${item.labelKey}`) : undefined}
        title={compact ? t(`appNavigation.items.${item.labelKey}`) : undefined}
        className={({ isActive }) =>
          `group relative flex items-center min-h-[44px] px-3 rounded-[8px] transition-colors select-none focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 dark:focus:ring-offset-[#1C1512] ${
            compact ? "justify-center" : "gap-2"
          } ${
            isActive
              ? "bg-[#FFF1F2] text-[#881337] border-l-[3px] border-[#881337] font-semibold dark:bg-[#4C0519]/40 dark:text-[#FBBF24] dark:border-[#FBBF24]"
              : "text-[#5C5046] hover:bg-[#FAF8F5] hover:text-[#261E1A] font-medium dark:text-[#E7E0D6] dark:hover:bg-white/5 dark:hover:text-white"
          }`
        }
      >
        {({ isActive }) => {
          const active = isActive;
          return (
            <>
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  active ? "text-[#881337] dark:text-[#FBBF24]" : "text-[#5C5046] group-hover:text-[#261E1A] dark:text-[#A89C90] dark:group-hover:text-white"
                }`}
                aria-hidden="true"
              />

              {!compact && (
                <span className="flex-1 truncate text-sm leading-5">
                  {t(`appNavigation.items.${item.labelKey}`)}
                </span>
              )}

              {!compact && item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-[8px] text-[10px] font-mono tabular-nums font-bold shrink-0 ${
                    active ? "bg-[#881337] text-white dark:bg-[#FBBF24] dark:text-[#1C1512]" : "bg-[#F4EFEA] text-[#5C5046] dark:bg-white/10 dark:text-[#E7E0D6]"
                  }`}
                  aria-label={t("appNavigation.pendingItems", { count: Number(item.badge) })}
                >
                  {item.badge}
                </span>
              )}

              {compact && (
                <div
                  role="tooltip"
                  aria-hidden="true"
                  className="absolute left-full ml-2 px-2.5 py-1 rounded-[8px] bg-stone-900 text-white text-xs font-medium whitespace-nowrap shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity z-50"
                >
                  {t(`appNavigation.items.${item.labelKey}`)}
                  {item.badge !== undefined && ` (${item.badge})`}
                </div>
              )}
            </>
          );
        }}
      </NavLink>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      <div>

        <div className="p-3 border-b border-[#E7E0D6] dark:border-white/10">
          <div className="relative">
            <div
              role="group"
              aria-label={`${t("appNavigation.currentSchool")}: ${currentSchool}`}
              className={`w-full flex items-center ${
                compact ? "justify-center" : "justify-between gap-2.5"
              } p-1 rounded-[8px]`}
            >
              <div className="flex items-center gap-2.5 min-w-0">

                <div className="w-8 h-8 rounded-[8px] bg-[#881337] text-white flex items-center justify-center font-bold text-sm shrink-0 dark:bg-[#FBBF24] dark:text-[#1C1512]">
                  <Building2 className="w-4 h-4" aria-hidden="true" />
                </div>
                {!compact && (
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#261E1A] dark:text-[#FDFBF7] truncate">
                      {currentSchool}
                    </p>
                    <p className="text-[10px] text-stone-400 dark:text-[#A89C90] font-medium truncate">
                      {t(`appNavigation.roles.${navConfig.roleNameKey}`)}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        <div className="p-3 space-y-1">
          {navConfig.primaryNav.map((item) => renderNavItem(item))}
        </div>

        <div className="px-3 pb-3">
          {compact ? (
            <div className="h-px bg-[#E7E0D6] dark:bg-white/10 my-2" aria-hidden="true" />
          ) : (
            <div className="space-y-1">
              {secondaryGroups.map((group, index) => {
                const key = group.groupTitleKey || `secondary-${index}`;
                const isOpen = openSecondaryGroups[key] ?? index === 0;
                return (
                  <div key={key}>
                    <button
                      type="button"
                      onClick={() => setOpenSecondaryGroups((current) => ({ ...current, [key]: !isOpen }))}
                      aria-expanded={isOpen}
                      className="flex min-h-[36px] w-full items-center justify-between rounded-[8px] px-3 py-1.5 text-left text-[10px] font-bold uppercase tracking-wider text-stone-400 transition-colors hover:bg-[#FAF8F5] hover:text-[#5C5046] focus:outline-none focus:ring-2 focus:ring-[#881337] dark:text-[#A89C90] dark:hover:bg-white/5 dark:hover:text-[#E7E0D6] dark:focus:ring-[#FBBF24]"
                    >
                      <span>{group.groupTitleKey ? t(`appNavigation.groups.${group.groupTitleKey}`) : t("appNavigation.groups.learningTools")}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                    <div className={`${isOpen ? "space-y-1" : "hidden"} mt-1`}>
                      {group.items.map((item) => renderNavItem(item))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {compact && <div className="space-y-1 mt-1">{secondaryGroups.flatMap((group) => group.items).map((item) => renderNavItem(item))}</div>}
        </div>
      </div>

      <div className="p-3 border-t border-[#E7E0D6] dark:border-white/10 space-y-1 bg-white dark:bg-[#1C1512]">
        {navConfig.bottomItems.map((item) => renderNavItem(item))}

        <button
          type="button"
          onClick={onToggleCollapse}
          className={`w-full hidden lg:flex items-center ${
            compact ? "justify-center" : "gap-2"
          } min-h-[44px] px-3 rounded-[8px] text-[#5C5046] hover:bg-[#FAF8F5] hover:text-[#261E1A] dark:text-[#A89C90] dark:hover:bg-white/5 dark:hover:text-white text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#881337] dark:focus:ring-[#FBBF24]`}
          aria-label={compact ? t("appNavigation.expandSidebar") : t("appNavigation.collapseSidebar")}
          title={compact ? t("appNavigation.expandSidebar") : t("appNavigation.collapseSidebar")}
        >
          {compact ? (
            <PanelLeftOpen className="w-5 h-5 shrink-0 text-[#5C5046] dark:text-[#A89C90]" />
          ) : (
            <>
              <PanelLeftClose className="w-5 h-5 shrink-0 text-[#5C5046] dark:text-[#A89C90]" />
              <span className="truncate">{t("appNavigation.collapseSidebar")}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>

      <nav
        aria-label={t("appNavigation.mainNavigation")}
        className={`hidden lg:flex flex-col bg-[#FFFFFF] dark:bg-[#1C1512] border-r border-[#E7E0D6] dark:border-white/10 shrink-0 fixed top-[56px] left-0 bottom-0 z-20 transition-all duration-200 select-none overflow-y-auto ${
          compact ? "w-[64px]" : "w-[240px]"
        }`}
      >
        {sidebarContent}
      </nav>

      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("appNavigation.mobileNavigation")}
          className="fixed inset-0 z-50 lg:hidden"
        >

          <div
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          <div
            ref={drawerRef}
            className="relative w-[280px] max-w-[85vw] h-full bg-[#FFFFFF] dark:bg-[#1C1512] shadow-xl flex flex-col justify-between overflow-y-auto z-10"
          >

            <div className="absolute top-3 right-3 z-20">
              <button
                type="button"
                onClick={onCloseMobile}
                className="flex items-center justify-center p-2 rounded-[8px] text-stone-500 hover:text-[#261E1A] hover:bg-[#F4EFEA] dark:text-[#A89C90] dark:hover:text-white dark:hover:bg-white/10 min-h-[44px] min-w-[44px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#881337] dark:focus:ring-[#FBBF24]"
                ref={closeButtonRef}
                aria-label={t("appNavigation.closeNavigation")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
