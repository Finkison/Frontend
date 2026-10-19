import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight, ShieldCheck } from "lucide-react";
import FinkisonLogo from "../shared/FinkisonLogo";
import { SITE_CONTENT } from "../../content/siteContent";

export default function PublicNavbar(): React.ReactElement {
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const solutionsRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Scroll listener for 1px #E2E8F0 bottom border fade (200ms)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape key and touch/click outside listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSolutionsOpen(false);
        setMobileDrawerOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(e.target as Node)) {
        setSolutionsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  // Close menus on route change
  useEffect(() => {
    setSolutionsOpen(false);
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  const isSolutionsActive =
    location.pathname.startsWith("/for-school") ||
    location.pathname.startsWith("/for-teacher") ||
    location.pathname.startsWith("/for-student") ||
    location.pathname.startsWith("/solutions");

  return (
    <header
      className={`h-[64px] lg:h-[72px] sticky top-0 select-none transition-all duration-200 ${
        scrolled
          ? "bg-white/90 dark:bg-[#1C1512]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 shadow-xs"
          : "bg-white/70 dark:bg-[#1C1512]/70 backdrop-blur-xs border-b border-transparent"
      }`}
      style={{ zIndex: "var(--z-sticky, 100)" }}
    >
      {/* Full-width responsive container anchored near device margins across all screen sizes */}
      <div className="w-full h-full flex items-center justify-between gap-2.5 sm:gap-4 px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Left: Logo (Positioned right near the left margin of the screen on all devices) */}
        <div className="flex items-center gap-3 shrink-0">
          <FinkisonLogo variant="horizontal" size="md" to="/" />
        </div>

        {/* Center: Public Links */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-sm font-medium">
          {/* 1. Solutions Dropdown */}
          <div className="relative" ref={solutionsRef}>
            <button
              type="button"
              onClick={() => setSolutionsOpen((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSolutionsOpen(true);
                }
              }}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
                isSolutionsActive || solutionsOpen
                  ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24] font-semibold shadow-2xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5"
              }`}
              aria-expanded={solutionsOpen}
              aria-haspopup="menu"
            >
              <span>{SITE_CONTENT.navigation.solutions}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  solutionsOpen ? "rotate-180 text-[#881337] dark:text-[#FBBF24]" : "text-slate-400"
                }`}
                aria-hidden="true"
              />
            </button>

            {solutionsOpen && (
              <div
                role="menu"
                aria-orientation="vertical"
                className="absolute top-[calc(100%+8px)] left-0 w-80 bg-white/95 dark:bg-[#261E1A]/95 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 rounded-2xl shadow-xl py-2 z-50 text-left animate-fade-in"
              >
                <div className="p-1.5 space-y-1">
                  {SITE_CONTENT.navigation.solutionsMenu.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                      <Link
                        key={item.name}
                        to={item.to}
                        onClick={() => setSolutionsOpen(false)}
                        className={`block px-3.5 py-2.5 rounded-xl transition-all duration-150 group ${
                          isActive
                            ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24]"
                            : "hover:bg-slate-50 dark:hover:bg-white/5"
                        }`}
                        role="menuitem"
                      >
                        <div
                          className={`text-sm font-semibold flex items-center justify-between ${
                            isActive
                              ? "text-[#881337] dark:text-[#FBBF24]"
                              : "text-slate-900 dark:text-white group-hover:text-[#881337] dark:group-hover:text-[#FBBF24]"
                          }`}
                        >
                          <span>{item.name}</span>
                          <ArrowRight
                            className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#881337] dark:group-hover:text-[#FBBF24] transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {item.description}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Academics */}
          <Link
            to="/academics"
            className={`px-3 py-2 rounded-lg transition-all duration-150 ${
              location.pathname === "/academics" || location.pathname === "/subjects"
                ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24] font-semibold shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5"
            }`}
            aria-current={location.pathname === "/academics" || location.pathname === "/subjects" ? "page" : undefined}
          >
            {SITE_CONTENT.navigation.academics}
          </Link>

          {/* 3. AI Features */}
          <Link
            to="/ai-features"
            className={`px-3 py-2 rounded-lg transition-all duration-150 ${
              location.pathname === "/ai-features"
                ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24] font-semibold shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5"
            }`}
            aria-current={location.pathname === "/ai-features" ? "page" : undefined}
          >
            {SITE_CONTENT.navigation.aiFeatures}
          </Link>

          {/* 4. Pricing */}
          <Link
            to="/pricing"
            className={`px-3 py-2 rounded-lg transition-all duration-150 ${
              location.pathname === "/pricing"
                ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24] font-semibold shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5"
            }`}
            aria-current={location.pathname === "/pricing" ? "page" : undefined}
          >
            {SITE_CONTENT.navigation.pricing}
          </Link>

          {/* 5. About */}
          <Link
            to="/about"
            className={`px-3 py-2 rounded-lg transition-all duration-150 ${
              location.pathname === "/about"
                ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24] font-semibold shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5"
            }`}
            aria-current={location.pathname === "/about" ? "page" : undefined}
          >
            {SITE_CONTENT.navigation.about}
          </Link>

        </nav>

        {/* Right: Focused Action Dock (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {/* Sign in Link */}
          <Link
            to="/login"
            className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors"
          >
            {SITE_CONTENT.navigation.signIn}
          </Link>

          {/* Contact us (Primary Brand Action) */}
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FBBF24] hover:bg-[#F59E0B] active:bg-[#D97706] text-[#1C1512] text-xs font-semibold transition-all duration-150 active:scale-[0.98] shadow-xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#881337]"
          >
            <span>{SITE_CONTENT.navigation.contactUs}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#1C1512]" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile / Tablet Controls (< 1024px) - Clean & uncluttered, zero collision on <400px devices */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          {/* Sign in - Visible on tablets (sm: 640px+), hidden on extra-small mobile to prevent collision */}
          <Link
            to="/login"
            className="hidden sm:inline-flex text-xs font-semibold px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
          >
            {SITE_CONTENT.navigation.signIn}
          </Link>

          {/* Contact us - Primary Compact CTA */}
          <Link
            to="/contact"
            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-xs font-semibold shadow-xs shrink-0"
          >
            <span>{SITE_CONTENT.navigation.contactUs}</span>
          </Link>

          {/* Hamburger Drawer Button */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] p-2 rounded-xl text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#881337]"
            aria-label="Open mobile navigation drawer"
            aria-expanded={mobileDrawerOpen}
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Full-Height Mobile Drawer */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 flex justify-start bg-slate-900/60 backdrop-blur-xs transition-opacity"
          style={{ zIndex: "var(--z-drawer, 300)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Backdrop Click */}
          <div
            className="fixed inset-0"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div
            ref={drawerRef}
            className="relative w-full max-w-sm h-full bg-white dark:bg-[#1C1512] text-slate-900 dark:text-white shadow-2xl flex flex-col justify-between p-6 z-10 animate-fade-in overflow-y-auto border-r border-slate-200 dark:border-white/10"
          >
            {/* Top Bar inside Drawer */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                <div onClick={() => setMobileDrawerOpen(false)} className="cursor-pointer">
                  <FinkisonLogo variant="horizontal" size="sm" to="/" />
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#881337]"
                  aria-label="Close navigation drawer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Stacked Links with Active Route Indicators */}
              <nav className="mt-6 space-y-1">
                <Link
                  to="/"
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    location.pathname === "/"
                      ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24]"
                      : "text-slate-900 dark:text-white hover:bg-[#FFF1F2] dark:hover:bg-[#4C0519]/30 hover:text-[#881337] dark:hover:text-[#FBBF24]"
                  }`}
                >
                  {SITE_CONTENT.navigation.home}
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    location.pathname === "/about"
                      ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24]"
                      : "text-slate-900 dark:text-white hover:bg-[#FFF1F2] dark:hover:bg-[#4C0519]/30 hover:text-[#881337] dark:hover:text-[#FBBF24]"
                  }`}
                >
                  {SITE_CONTENT.navigation.about}
                </Link>

                <div className="py-2">
                  <span className="block text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider px-3 mb-1">
                    {SITE_CONTENT.navigation.solutions}
                  </span>
                  {SITE_CONTENT.navigation.solutionsMenu.map((s) => {
                    const isItemActive = location.pathname === s.to;
                    return (
                      <Link
                        key={s.name}
                        to={s.to}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                          isItemActive
                            ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24]"
                            : "text-slate-900 dark:text-white hover:bg-[#FFF1F2] dark:hover:bg-[#4C0519]/30"
                        }`}
                      >
                        <span>{s.name}</span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400 font-normal">{s.description}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-0.5">
                  <Link
                    to="/academics"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      location.pathname === "/academics" || location.pathname === "/subjects"
                        ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24]"
                        : "text-slate-900 dark:text-white hover:bg-[#FFF1F2] dark:hover:bg-[#4C0519]/30 hover:text-[#881337] dark:hover:text-[#FBBF24]"
                    }`}
                  >
                    {SITE_CONTENT.navigation.academics}
                  </Link>
                  <Link
                    to="/ai-features"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      location.pathname === "/ai-features"
                        ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24]"
                        : "text-slate-900 dark:text-white hover:bg-[#FFF1F2] dark:hover:bg-[#4C0519]/30 hover:text-[#881337] dark:hover:text-[#FBBF24]"
                    }`}
                  >
                    {SITE_CONTENT.navigation.aiFeatures}
                  </Link>
                  <Link
                    to="/pricing"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      location.pathname === "/pricing"
                        ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24]"
                        : "text-slate-900 dark:text-white hover:bg-[#FFF1F2] dark:hover:bg-[#4C0519]/30 hover:text-[#881337] dark:hover:text-[#FBBF24]"
                    }`}
                  >
                    {SITE_CONTENT.navigation.pricing}
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      location.pathname === "/contact"
                        ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24]"
                        : "text-slate-900 dark:text-white hover:bg-[#FFF1F2] dark:hover:bg-[#4C0519]/30 hover:text-[#881337] dark:hover:text-[#FBBF24]"
                    }`}
                  >
                    {SITE_CONTENT.navigation.contactUs}
                  </Link>
                </div>
              </nav>
            </div>

            {/* Bottom Actions inside Drawer */}
            <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-2.5">
              <Link
                to="/login"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 text-slate-900 dark:text-white text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
                <span>{SITE_CONTENT.navigation.signIn}</span>
              </Link>

              <Link
                to="/contact"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-sm font-semibold transition-all shadow-xs"
              >
                <span>Get started</span>
                <ArrowRight className="w-4 h-4 text-[#1C1512]" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
