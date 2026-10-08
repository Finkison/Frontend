import React from "react";
import SideNav from "../shared/SideNav";
import useAuthStore from "../../store/authStore";
import { Search, Building2 } from "lucide-react";

export default function SchoolLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  const { user } = useAuthStore();

  const links = [
    { to: "/school", label: "Dashboard" },
    { to: "/school/class", label: "Classes" },
    { to: "/school/students", label: "Students" },
    { to: "/school/proctor", label: "Live Proctoring" },
    { to: "/school/teachers", label: "Faculty" },
    { to: "/school/reports", label: "Reports" },
    { to: "/school/settings", label: "School Settings" },
  ];

  const sections = [
    {
      title: "Operations",
      links: [
        { to: "/school", label: "Dashboard" },
        { to: "/school/class", label: "Classes" },
        { to: "/school/students", label: "Students" },
        { to: "/school/proctor", label: "Live Proctoring" },
      ],
    },
    {
      title: "Academic Staff & Reports",
      links: [
        { to: "/school/teachers", label: "Faculty" },
        { to: "/school/reports", label: "Reports" },
      ],
    },
    {
      title: "Administration",
      links: [
        { to: "/school/settings", label: "School Settings" },
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
              <Building2 className="w-3 h-3 text-amber-400" />
              <span>{user?.school || "Institutional School Portal"}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold">
              {user?.role === "PRINCIPAL" ? "Principal Administrator" : "Academic Faculty"}
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
