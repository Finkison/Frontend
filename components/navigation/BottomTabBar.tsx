import React from "react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { getNavigationForRole, type NavItem } from "./navigationConfig";

export interface BottomTabBarProps {
  overrideRole?: string;
  className?: string;
}

export default function BottomTabBar({ overrideRole, className = "" }: BottomTabBarProps): React.ReactElement | null {
  const { user } = useAuthStore();
  const effectiveRole = overrideRole || user?.role || "STUDENT";
  const navConfig = getNavigationForRole(effectiveRole);

  // Bottom tab bar applies to Students and Parents on mobile viewports (<1024px)
  const tabs = navConfig.mobileBottomTabs;
  if (!tabs || tabs.length === 0) return null;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className={`lg:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-[#FFFFFF] border-t border-[#E2E8F0] z-30 px-2 flex items-center justify-around select-none shadow-xs ${className}`}
    >
      {tabs.slice(0, 5).map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.id}
            to={tab.to}
            end={tab.to === "/student" || tab.to === "/parent"}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center flex-1 h-full min-h-[44px] min-w-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] rounded-[8px] ${
                isActive
                  ? "text-[#1D4ED8] font-bold"
                  : "text-[#475569] hover:text-[#0F172A] font-medium"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? "scale-110 text-[#1D4ED8]" : "text-[#475569]"
                    }`}
                    aria-hidden="true"
                  />
                  {tab.badge !== undefined && (
                    <span
                      className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-[#1D4ED8] text-white text-[9px] font-mono tabular-nums font-bold"
                      aria-label={`${tab.badge} unread items`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] leading-3 mt-1 truncate max-w-[64px]">
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-6 h-0.5 bg-[#1D4ED8] rounded-full" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
