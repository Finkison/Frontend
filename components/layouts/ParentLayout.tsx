import React from "react";
import SideNav from "../shared/SideNav";
import useAuthStore from "../../store/authStore";
import { Search, HeartHandshake } from "lucide-react";

export default function ParentLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  const { user } = useAuthStore();

  const links = [
    { to: "/parent", label: "Progress Overview" },
    { to: "/parent/alerts", label: "Performance Alerts" },
    { to: "/parent/messages", label: "Teacher Messages" },
  ];

  const sections = [
    {
      title: "Family Portal",
      links: [
        { to: "/parent", label: "Progress Overview" },
      ],
    },
    {
      title: "Communications & Alerts",
      links: [
        { to: "/parent/alerts", label: "Performance Alerts" },
        { to: "/parent/messages", label: "Teacher Messages" },
      ],
    },
  ];

  return (
    <div className="flex w-full min-h-[calc(100vh-64px)] bg-slate-50">
      <SideNav links={links} sections={sections} />
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold tracking-wide">
              <HeartHandshake className="w-3 h-3 text-emerald-400" />
              <span>{user?.fullName || user?.name || "Guardian"}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
              Parent / Guardian
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true })
                );
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 text-[10px] font-semibold transition-colors cursor-pointer shadow-2xs"
              title="Quick search across national curriculum (Ctrl+K)"
            >
              <Search className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-200">
                Ctrl+K
              </kbd>
            </button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
