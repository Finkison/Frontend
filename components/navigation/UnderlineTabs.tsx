import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface UnderlineTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export default function UnderlineTabs({
  tabs,
  activeTab,
  onChange,
  className = "",
}: UnderlineTabsProps): React.ReactElement {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close "More" menu on click outside or Escape
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const MAX_VISIBLE_TABS = 6;
  const visibleTabs = tabs.slice(0, MAX_VISIBLE_TABS);
  const overflowTabs = tabs.slice(MAX_VISIBLE_TABS);
  const isOverflowActive = overflowTabs.some((t) => t.id === activeTab);

  return (
    <div
      role="tablist"
      aria-label="Secondary navigation tabs"
      className={`border-b border-[#E2E8F0] flex items-center gap-1 overflow-x-visible relative select-none ${className}`}
    >
      {visibleTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed ${
              isActive
                ? "border-[#1D4ED8] text-[#1D4ED8]"
                : "border-transparent text-[#475569] hover:text-[#0F172A] hover:border-slate-300"
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={`px-1.5 py-0.5 rounded-[8px] text-[10px] tabular-nums font-mono font-bold ${
                  isActive
                    ? "bg-[#EFF6FF] text-[#1D4ED8]"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}

      {/* Overflow "More" menu for tabs beyond 6 */}
      {overflowTabs.length > 0 && (
        <div ref={moreRef} className="relative">
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={moreOpen}
            className={`min-h-[44px] px-3 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] ${
              isOverflowActive
                ? "border-[#1D4ED8] text-[#1D4ED8]"
                : "border-transparent text-[#475569] hover:text-[#0F172A]"
            }`}
          >
            <span>More</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
          </button>

          {moreOpen && (
            <div
              role="menu"
              className="absolute left-0 top-full mt-1 w-48 bg-white border border-[#E2E8F0] rounded-[8px] shadow-lg py-1 z-50 text-xs"
            >
              {overflowTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      onChange(tab.id);
                      setMoreOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      isActive ? "bg-[#EFF6FF] text-[#1D4ED8] font-bold" : "text-[#0F172A]"
                    }`}
                    role="menuitem"
                  >
                    <span>{tab.label}</span>
                    {typeof tab.count === "number" && (
                      <span className="font-mono tabular-nums text-[10px] text-slate-500">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
