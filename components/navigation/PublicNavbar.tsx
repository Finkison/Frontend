import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight, ShieldCheck } from "lucide-react";
import FinkisonLogo from "../shared/FinkisonLogo";
import PublicPreferences from "../shared/PublicPreferences";
import { useI18n } from "../../i18n";

type NavigationMenu = "platform" | "solutions" | null;

export default function PublicNavbar(): React.ReactElement {
  const location = useLocation();
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<NavigationMenu>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const platformRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const platformTriggerRef = useRef<HTMLButtonElement>(null);
  const solutionsTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileCloseButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const closeMobileDrawer = useCallback(() => {
    setMobileDrawerOpen(false);
    window.requestAnimationFrame(() => mobileMenuButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (!platformRef.current?.contains(target) && !solutionsRef.current?.contains(target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (!mobileDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileCloseButtonRef.current?.focus();

    const handleDrawerKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileDrawer();
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), select:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

    document.addEventListener("keydown", handleDrawerKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleDrawerKeyDown);
    };
  }, [mobileDrawerOpen, closeMobileDrawer]);

  useEffect(() => {
    setOpenMenu(null);
    if (mobileDrawerOpen) closeMobileDrawer();
    // Route changes close an open drawer and return focus to its trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const platformItems = [
    { label: t("public.navigation.curriculum"), to: "/academics" },
    { label: t("public.navigation.learningTools"), to: "/ai-features" },
    { label: t("public.navigation.howItWorks"), to: "/how-we-work" },
  ];

  const solutionItems = [
    { label: t("public.navigation.students"), to: "/for-students" },
    { label: t("public.navigation.families"), to: "/for-families" },
    { label: t("public.navigation.teachers"), to: "/for-teachers" },
    { label: t("public.navigation.schools"), to: "/for-schools" },
  ];

  const isPlatformActive = ["/academics", "/subjects", "/ai-features", "/how-we-work"].includes(location.pathname);
  const isSolutionsActive = ["/for-students", "/for-families", "/for-teachers", "/for-schools", "/students", "/teachers", "/schools"].includes(location.pathname) || location.pathname.startsWith("/solutions/");
  const routeAliases: Record<string, string[]> = {
    "/academics": ["/academics", "/subjects"],
    "/for-students": ["/for-students", "/students", "/solutions/students"],
    "/for-families": ["/for-families", "/families"],
    "/for-teachers": ["/for-teachers", "/teachers", "/solutions/teachers"],
    "/for-schools": ["/for-schools", "/schools", "/solutions/schools"],
  };
  const isRouteCurrent = (to: string) => (routeAliases[to] || [to]).includes(location.pathname);

  const renderDropdown = (
    menu: Exclude<NavigationMenu, null>,
    label: string,
    items: typeof platformItems,
    triggerRef: React.RefObject<HTMLButtonElement | null>,
    containerRef: React.RefObject<HTMLDivElement | null>,
    active: boolean
  ) => {
    const isOpen = openMenu === menu;
    const menuId = `public-nav-${menu}`;
    return (
      <div
        className="relative"
        ref={containerRef}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setOpenMenu((current) => current === menu ? null : current);
          }
        }}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpenMenu((current) => current === menu ? null : menu)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && isOpen) {
              event.preventDefault();
              setOpenMenu(null);
              triggerRef.current?.focus();
            }
          }}
          className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 py-2 transition-colors ${
            active || isOpen
              ? "bg-[#FFF1F2] font-semibold text-[#881337] dark:bg-[#4C0519]/40 dark:text-[#FBBF24]"
              : "text-stone-700 hover:bg-stone-100/80 hover:text-stone-950 dark:text-stone-200 dark:hover:bg-white/5 dark:hover:text-white"
          }`}
          aria-expanded={isOpen}
          aria-controls={menuId}
        >
          {label}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
        <ul id={menuId} hidden={!isOpen} className="absolute left-0 top-[calc(100%+8px)] z-50 w-72 list-none rounded-2xl border border-stone-200/90 bg-white/95 p-2 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#261E1A]/95">
            {items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpenMenu(null)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      event.preventDefault();
                      setOpenMenu(null);
                      triggerRef.current?.focus();
                    }
                  }}
                  aria-current={isRouteCurrent(item.to) ? "page" : undefined}
                  className={`group flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:text-white dark:hover:bg-white/5 ${
                    isRouteCurrent(item.to) ? "bg-[#FFF1F2] dark:bg-[#4C0519]/30" : ""
                  }`}
                >
                  {item.label}<ArrowRight className="h-3.5 w-3.5 text-stone-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
        </ul>
      </div>
    );
  };

  const linkClass = (active: boolean) => `rounded-lg px-3 py-2 transition-colors ${
    active
      ? "bg-[#FFF1F2] font-semibold text-[#881337] dark:bg-[#4C0519]/40 dark:text-[#FBBF24]"
      : "text-stone-700 hover:bg-stone-100/80 hover:text-stone-950 dark:text-stone-200 dark:hover:bg-white/5 dark:hover:text-white"
  }`;

  return (
    <header
      className={`sticky top-0 h-16 select-none border-b transition-all duration-200 lg:h-[72px] ${
        scrolled
          ? "border-stone-200/80 bg-white/90 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-[#1C1512]/90"
          : "border-transparent bg-white/75 backdrop-blur-sm dark:bg-[#1C1512]/75"
      }`}
      style={{ zIndex: "var(--z-sticky, 100)" }}
    >
      <div className="flex h-full items-center justify-between gap-2.5 px-4 sm:gap-4 sm:px-6 lg:px-8 xl:px-10">
        <FinkisonLogo variant="horizontal" size="md" to="/" />

        <nav aria-label={t("public.navigation.mainMenu")} className="hidden items-center gap-1 text-sm font-medium xl:flex">
          {renderDropdown("platform", t("public.navigation.platform"), platformItems, platformTriggerRef, platformRef, isPlatformActive)}
          {renderDropdown("solutions", t("public.navigation.solutions"), solutionItems, solutionsTriggerRef, solutionsRef, isSolutionsActive)}
          <Link to="/pricing" className={linkClass(location.pathname === "/pricing")} aria-current={location.pathname === "/pricing" ? "page" : undefined}>{t("public.navigation.pricing")}</Link>
          <Link to="/about" className={linkClass(location.pathname === "/about" || location.pathname === "/team")} aria-current={location.pathname === "/about" || location.pathname === "/team" ? "page" : undefined}>{t("public.navigation.about")}</Link>
          <Link to="/contact" className={linkClass(location.pathname === "/contact")} aria-current={location.pathname === "/contact" ? "page" : undefined}>{t("public.navigation.contact")}</Link>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <PublicPreferences variant="header" />
          <Link to="/login" className="rounded-lg px-3 py-2 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-100/70 hover:text-stone-950 dark:text-stone-200 dark:hover:bg-white/5 dark:hover:text-white">
            {t("public.navigation.signIn")}
          </Link>
          <Link to="/register" className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[#FBBF24] px-4 py-2 text-xs font-bold text-[#1C1512] shadow-xs transition-colors hover:bg-[#F59E0B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337]">
            {t("public.navigation.getStarted")}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 xl:hidden">
          <Link to="/login" className="hidden rounded-lg px-2.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-white/10 sm:inline-flex">
            {t("public.navigation.signIn")}
          </Link>
          <Link to="/register" className="hidden min-h-10 items-center rounded-lg bg-[#FBBF24] px-3 py-2 text-xs font-bold text-[#1C1512] shadow-xs hover:bg-[#F59E0B] sm:inline-flex">
            {t("public.navigation.getStarted")}
          </Link>
          <button
            ref={mobileMenuButtonRef}
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl p-2 text-stone-900 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:text-white dark:hover:bg-white/10"
            aria-label={t("public.navigation.openMenu")}
            aria-expanded={mobileDrawerOpen}
            aria-haspopup="dialog"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {mobileDrawerOpen && (
        <div className="fixed inset-0 flex justify-start bg-stone-900/60 backdrop-blur-sm" style={{ zIndex: "var(--z-drawer, 300)" }}>
          <button type="button" className="absolute inset-0 h-full w-full cursor-default" onClick={closeMobileDrawer} aria-label={t("public.navigation.closeMenu")} />
          <div ref={drawerRef} className="relative z-10 flex h-full w-full max-w-sm flex-col justify-between overflow-y-auto border-r border-stone-200 bg-white p-5 text-stone-900 shadow-2xl dark:border-white/10 dark:bg-[#1C1512] dark:text-white sm:p-6" role="dialog" aria-modal="true" aria-label={t("public.navigation.mobileMenu")}>
            <div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-4 dark:border-white/10">
                <FinkisonLogo variant="horizontal" size="sm" to="/" />
                <button ref={mobileCloseButtonRef} type="button" onClick={closeMobileDrawer} className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-white" aria-label={t("public.navigation.closeMenu")}>
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <nav aria-label={t("public.navigation.mainMenu")} className="mt-5 space-y-5">
                <div>
                  <p className="px-3 pb-1 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">{t("public.navigation.platform")}</p>
                  <ul className="list-none">
                    {platformItems.map((item) => (
                      <li key={item.to}>
                        <Link to={item.to} onClick={closeMobileDrawer} aria-current={isRouteCurrent(item.to) ? "page" : undefined} className={`block rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-900 hover:bg-[#FFF1F2] hover:text-[#881337] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:text-white dark:hover:bg-[#4C0519]/30 dark:hover:text-[#FBBF24] ${isRouteCurrent(item.to) ? "bg-[#FFF1F2] dark:bg-[#4C0519]/30" : ""}`}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="px-3 pb-1 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">{t("public.navigation.solutions")}</p>
                  <ul className="list-none">
                    {solutionItems.map((item) => (
                      <li key={item.to}>
                        <Link to={item.to} onClick={closeMobileDrawer} aria-current={isRouteCurrent(item.to) ? "page" : undefined} className={`block rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-900 hover:bg-[#FFF1F2] hover:text-[#881337] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:text-white dark:hover:bg-[#4C0519]/30 dark:hover:text-[#FBBF24] ${isRouteCurrent(item.to) ? "bg-[#FFF1F2] dark:bg-[#4C0519]/30" : ""}`}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-stone-200 pt-3 dark:border-white/10">
                  <ul className="list-none space-y-1">
                    <li><Link to="/pricing" onClick={closeMobileDrawer} aria-current={location.pathname === "/pricing" ? "page" : undefined} className={`block rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-stone-100 dark:hover:bg-white/5 ${location.pathname === "/pricing" ? "bg-stone-100 dark:bg-white/10" : ""}`}>{t("public.navigation.pricing")}</Link></li>
                    <li><Link to="/about" onClick={closeMobileDrawer} aria-current={location.pathname === "/about" ? "page" : undefined} className={`block rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-stone-100 dark:hover:bg-white/5 ${location.pathname === "/about" ? "bg-stone-100 dark:bg-white/10" : ""}`}>{t("public.navigation.about")}</Link></li>
                    <li><Link to="/contact" onClick={closeMobileDrawer} aria-current={location.pathname === "/contact" ? "page" : undefined} className={`block rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-stone-100 dark:hover:bg-white/5 ${location.pathname === "/contact" ? "bg-stone-100 dark:bg-white/10" : ""}`}>{t("public.navigation.contact")}</Link></li>
                  </ul>
                </div>
              </nav>
            </div>

            <div className="space-y-2.5 border-t border-stone-200 pt-5 dark:border-white/10">
              <PublicPreferences variant="drawer" />
              <Link to="/login" onClick={closeMobileDrawer} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-900 hover:bg-stone-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                <ShieldCheck className="h-4 w-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />{t("public.navigation.signIn")}
              </Link>
              <Link to="/register" onClick={closeMobileDrawer} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#FBBF24] text-sm font-bold text-[#1C1512] shadow-xs hover:bg-[#F59E0B]">
                {t("public.navigation.getStarted")}<ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
