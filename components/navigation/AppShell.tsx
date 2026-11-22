import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import BottomTabBar from "./BottomTabBar";
import { useI18n } from "../../i18n";

export interface AppShellProps {
  children: React.ReactNode;
  overrideRole?: string;
}

export type InstitutionalAppShellProps = AppShellProps;

export default function AppShell({
  children,
  overrideRole,
}: AppShellProps): React.ReactElement {
  const location = useLocation();
  const { t } = useI18n();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("finkison_sidebar_collapsed");
      if (saved !== null) return saved === "true";
      return window.innerWidth < 1280;
    } catch {
      return window.innerWidth < 1280;
    }
  });

  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() => window.innerWidth < 1024);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      const mobileViewport = viewportWidth < 1024;
      setIsMobileViewport(mobileViewport);
      if (mobileViewport) return;

      setIsMobileOpen(false);
      try {
        const saved = localStorage.getItem("finkison_sidebar_collapsed");
        if (saved === null) setIsCollapsed(viewportWidth < 1280);
      } catch {
        setIsCollapsed(viewportWidth < 1280);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 80);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("finkison_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#1C1512] flex flex-col font-sans text-[#261E1A] dark:text-[#FDFBF7] transition-colors">

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#881337] focus:text-white focus:rounded-[8px] focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#881337]"
      >
        {t("appNavigation.skipToMain")}
      </a>

      <TopBar
        onToggleSidebar={() => {
          if (isMobileViewport) {
            setIsMobileOpen((v) => !v);
          } else {
            handleToggleCollapse();
          }
        }}
        isSidebarOpen={isMobileViewport ? isMobileOpen : !isCollapsed}
      />

      <div className="flex-1 flex min-w-0 relative">

        <Sidebar
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          overrideRole={overrideRole}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className={`flex-1 min-w-0 transition-all duration-200 focus:outline-none pb-20 lg:pb-8 ${
            isCollapsed ? "lg:ml-[64px]" : "lg:ml-[240px]"
          }`}
        >
          {isTransitioning ? (
            <div role="status" aria-live="polite" className="p-4 sm:p-6 lg:p-8 max-w-[1280px] mx-auto animate-pulse space-y-4">
              <div className="h-6 w-48 bg-[#E7E0D6] dark:bg-white/10 rounded-[8px]" />
              <div className="h-4 w-96 max-w-full bg-[#F4EFEA] dark:bg-white/5 rounded-[8px]" />
              <div className="h-64 bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 rounded-xl" />
              <span className="sr-only">Loading page</span>
            </div>
          ) : (
            <div className="p-4 sm:p-6 lg:p-8 max-w-[1280px] mx-auto min-h-[calc(100vh-56px)]">
              {children}
            </div>
          )}
        </main>
      </div>

      <BottomTabBar overrideRole={overrideRole} />
    </div>
  );
}

export { AppShell as InstitutionalAppShell };
