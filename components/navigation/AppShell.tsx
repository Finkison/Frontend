import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import BottomTabBar from "./BottomTabBar";

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

  // Responsive default: collapsed on viewports <1280px, expanded on 1280px+
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("finkison_sidebar_collapsed");
      if (saved !== null) return saved === "true";
      return window.innerWidth < 1280;
    } catch {
      return false;
    }
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Synchronize responsive breakpoint resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // Below 1024px, drawer is used
      } else if (window.innerWidth < 1280) {
        // 1024-1279px: default to collapsed 64px if user hasn't explicitly set otherwise
        const saved = localStorage.getItem("finkison_sidebar_collapsed");
        if (saved === null) setIsCollapsed(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Flash subtle content transition skeleton indicator on route change
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#0F172A]">
      {/* 1. Skip to Content Link (First focusable element) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#1D4ED8] focus:text-white focus:rounded-[8px] focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D4ED8]"
      >
        Skip to main content
      </a>

      {/* 2. Fixed Top Bar (Height 56px, z-30) */}
      <TopBar
        onToggleSidebar={() => {
          if (window.innerWidth < 1024) {
            setIsMobileOpen((v) => !v);
          } else {
            handleToggleCollapse();
          }
        }}
        isSidebarOpen={!isCollapsed}
      />

      {/* Main Structural Frame: Sidebar + Independent Content Area */}
      <div className="flex-1 flex min-w-0 relative">
        {/* 3. Fixed Left Sidebar (240px expanded / 64px collapsed / 280px drawer) */}
        <Sidebar
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          overrideRole={overrideRole}
        />

        {/* 4. Independently Scrolling Content Area */}
        <main
          id="main-content"
          tabIndex={-1}
          className={`flex-1 min-w-0 transition-all duration-200 focus:outline-none pb-20 lg:pb-8 ${
            isCollapsed ? "lg:ml-[64px]" : "lg:ml-[240px]"
          }`}
        >
          {isTransitioning ? (
            <div className="p-4 sm:p-6 lg:p-8 max-w-[1280px] mx-auto animate-pulse space-y-4">
              <div className="h-6 w-48 bg-slate-200 rounded-[8px]" />
              <div className="h-4 w-96 bg-slate-100 rounded-[8px]" />
              <div className="h-64 bg-white border border-[#E2E8F0] rounded-[8px]" />
            </div>
          ) : (
            <div className="p-4 sm:p-6 lg:p-8 max-w-[1280px] mx-auto min-h-[calc(100vh-56px)]">
              {children}
            </div>
          )}
        </main>
      </div>

      {/* 5. Mobile Bottom Tab Bar (64px, for Student & Parent roles on mobile) */}
      <BottomTabBar overrideRole={overrideRole} />
    </div>
  );
}

export { AppShell as InstitutionalAppShell };
