import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import {
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Building2,
  X,
  type LucideIcon,
} from "lucide-react";
import { getNavigationForRole, type NavItem } from "./navigationConfig";

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
  const { user } = useAuthStore();
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [schoolMenuOpen, setSchoolMenuOpen] = useState(false);
  const currentSchool = user?.school || "Finkison Academy";
  const [selectedSchool, setSelectedSchool] = useState(currentSchool);

  const effectiveRole = overrideRole || user?.role || "SCHOOL_ADMIN";
  const navConfig = getNavigationForRole(effectiveRole, (user as any)?.grade);

  const availableSchools = (user as any)?.schools?.length
    ? (user as any).schools
    : [currentSchool];

  // Close mobile drawer on route change
  useEffect(() => {
    if (isMobileOpen) {
      onCloseMobile();
    }
  }, [location.pathname]);

  // Trap focus & Escape listener for mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        onCloseMobile();
      }
    };
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileOpen, onCloseMobile]);

  const renderNavItem = (item: NavItem, isBottom = false) => {
    // Phase 3 & 7: Unavailable items are hidden, not disabled
    if (item.disabled) return null;
    const Icon = item.icon;

    return (
      <NavLink
        key={item.id}
        to={item.to}
        end={item.to === "/school" || item.to === "/teacher" || item.to === "/student" || item.to === "/parent"}
        tabIndex={0}
        title={isCollapsed ? item.label : undefined}
        className={({ isActive }) =>
          `group relative flex items-center h-[40px] px-3 rounded-[8px] transition-colors select-none focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2 ${
            isCollapsed ? "justify-center" : "gap-2"
          } ${
            isActive
              ? "bg-[#EFF6FF] text-[#1D4ED8] border-l-[3px] border-[#1D4ED8] font-semibold"
              : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] font-medium"
          }`
        }
      >
        {({ isActive }) => {
          const active = isActive;
          return (
            <>
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  active ? "text-[#1D4ED8]" : "text-[#475569] group-hover:text-[#0F172A]"
                }`}
                aria-hidden="true"
              />

              {!isCollapsed && (
                <span className="flex-1 truncate text-sm leading-5">
                  {item.label}
                </span>
              )}

              {/* Trailing Badge */}
              {!isCollapsed && item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-[8px] text-[10px] font-mono tabular-nums font-bold shrink-0 ${
                    active ? "bg-[#1D4ED8] text-white" : "bg-slate-100 text-slate-600"
                  }`}
                  aria-label={`${item.badge} pending items`}
                >
                  {item.badge}
                </span>
              )}

              {/* Hover Tooltip in Collapsed Mode */}
              {isCollapsed && (
                <div
                  role="tooltip"
                  className="absolute left-full ml-2 px-2.5 py-1 rounded-[8px] bg-slate-900 text-white text-xs font-medium whitespace-nowrap shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity z-50"
                >
                  {item.label}
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
        {/* 1. Organization Block */}
        <div className="p-3 border-b border-[#E2E8F0]">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (!isCollapsed && availableSchools.length > 1) {
                  setSchoolMenuOpen((v) => !v);
                }
              }}
              className={`w-full flex items-center ${
                isCollapsed ? "justify-center" : "justify-between gap-2.5"
              } p-1 rounded-[8px] ${
                availableSchools.length > 1 ? "hover:bg-slate-50 cursor-pointer" : "cursor-default"
              } transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]`}
              aria-label={availableSchools.length > 1 ? "Switch organization" : "Current organization"}
              aria-expanded={availableSchools.length > 1 ? schoolMenuOpen : undefined}
              title={selectedSchool}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* 32px Logo */}
                <div className="w-8 h-8 rounded-[8px] bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0F172A] truncate">
                      {selectedSchool}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium truncate">
                      {navConfig.roleName}
                    </p>
                  </div>
                )}
              </div>

              {!isCollapsed && availableSchools.length > 1 && (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </button>

            {/* School Switcher Dropdown */}
            {schoolMenuOpen && !isCollapsed && availableSchools.length > 1 && (
              <div
                className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-[8px] shadow-lg py-1 z-50 text-xs"
                role="menu"
              >
                <div className="px-3 py-1 font-bold uppercase tracking-wider text-[10px] text-slate-400">
                  Switch School
                </div>
                {availableSchools.map((s: string) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSelectedSchool(s);
                      setSchoolMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 truncate cursor-pointer ${
                      selectedSchool === s ? "bg-[#EFF6FF] text-[#1D4ED8] font-bold" : "text-[#0F172A]"
                    }`}
                    role="menuitem"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. Primary Navigation (max 7 items) */}
        <div className="p-3 space-y-1">
          {navConfig.primaryNav.slice(0, 7).map((item) => renderNavItem(item))}
        </div>

        {/* 3. Secondary Navigation (grouped, max 5 items) */}
        <div className="px-3 pb-3">
          {isCollapsed ? (
            <div className="h-px bg-slate-200 my-2" aria-hidden="true" />
          ) : (
            navConfig.secondaryNav.groupTitle && (
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {navConfig.secondaryNav.groupTitle}
              </div>
            )
          )}
          <div className="space-y-1">
            {navConfig.secondaryNav.items.slice(0, 5).map((item) => renderNavItem(item))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Help, Settings, Collapse Toggle */}
      <div className="p-3 border-t border-[#E2E8F0] space-y-1 bg-white">
        {navConfig.bottomItems.map((item) => renderNavItem(item, true))}

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`w-full hidden lg:flex items-center ${
            isCollapsed ? "justify-center" : "gap-2"
          } h-[40px] px-3 rounded-[8px] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]`}
          aria-label={isCollapsed ? "Expand sidebar to 240px" : "Collapse sidebar to 64px"}
          title={isCollapsed ? "Expand sidebar (240px)" : "Collapse sidebar (64px)"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 shrink-0 text-[#475569]" />
          ) : (
            <>
              <PanelLeftClose className="w-5 h-5 shrink-0 text-[#475569]" />
              <span className="truncate">Collapse sidebar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Laptop Persistent Sidebar */}
      <nav
        aria-label="Main"
        className={`hidden lg:flex flex-col bg-[#FFFFFF] border-r border-[#E2E8F0] shrink-0 fixed top-[56px] left-0 bottom-0 z-20 transition-all duration-200 select-none overflow-y-auto ${
          isCollapsed ? "w-[64px]" : "w-[240px]"
        }`}
      >
        {sidebarContent}
      </nav>

      {/* Tablet Portrait & Mobile Slide-Over Drawer (280px) */}
      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* 280px Drawer */}
          <div
            ref={drawerRef}
            className="relative w-[280px] max-w-[85vw] h-full bg-[#FFFFFF] shadow-xl flex flex-col justify-between overflow-y-auto z-10"
          >
            {/* Drawer Header Close Button */}
            <div className="absolute top-3 right-3 z-20">
              <button
                type="button"
                onClick={onCloseMobile}
                className="flex items-center justify-center p-2 rounded-[8px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 min-h-[44px] min-w-[44px] cursor-pointer"
                aria-label="Close navigation drawer"
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
