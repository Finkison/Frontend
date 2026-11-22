import React from "react";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className = "",
}: TabsProps): React.ReactElement {
  return (
    <div
      role="tablist"
      aria-label="Content Tabs"
      className={`border-b border-[#E7E0D6] dark:border-white/10 flex items-center gap-1 overflow-x-auto ${className}`}
    >
      {tabs.map((tab) => {
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
            className={`min-h-[44px] px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer select-none whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#881337]/30 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed ${
              isActive
                ? "border-[#881337] text-[#881337]"
                : "border-transparent text-[#5C5046] dark:text-[#E7E0D6] hover:text-[#261E1A] dark:hover:text-[#FDFBF7] hover:border-stone-300"
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={`px-1.5 py-0.5 rounded-[8px] text-[10px] tabular-nums font-mono ${
                  isActive
                    ? "bg-rose-50 text-[#881337]"
                    : "bg-stone-100 dark:bg-[#201815] text-stone-600 dark:text-[#E7E0D6]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
