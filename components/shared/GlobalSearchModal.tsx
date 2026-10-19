import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { globalSearch } from "../../services/studentService";
import useAuthStore from "../../store/authStore";
import { useScope } from "../../hooks/useScope";
import { isRouteAllowedForRole } from "../../constants/navigationManifest";
import { 
  Search, 
  X, 
  BookOpen, 
  GraduationCap, 
  Building2, 
  Cpu, 
  Award, 
  ArrowRight, 
  Sparkles,
  Layers,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  HeartHandshake,
  Bell,
  MessageSquare,
  LayoutDashboard,
  Calendar,
  Brain,
  FileText,
  TrendingUp,
  FileCheck2,
  Command
} from "lucide-react";

interface SearchResult {
  title: string;
  category: "Curriculum" | "Past Papers" | "Departments" | "Technology" | "Scholarships" | "Operations" | "Communications" | string;
  url: string;
  desc: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  "Curriculum": BookOpen,
  "Past Papers": GraduationCap,
  "Departments": Building2,
  "Technology": Cpu,
  "Scholarships": Award,
  "Operations": Layers,
  "Communications": MessageSquare,
};

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps): React.ReactElement | null {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const scope = useScope();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const userRole = (user?.role || "STUDENT").toUpperCase();
  const isSchoolUser = userRole === "TEACHER" || userRole === "PRINCIPAL";
  const isParentUser = userRole === "PARENT";

  const quickSuggestions = useMemo(() => {
    if (isSchoolUser) {
      return [
        { label: "Dashboard", url: "/school", icon: LayoutDashboard },
        { label: "Classes", url: "/school/class", icon: Layers },
        { label: "Students", url: "/school/students", icon: Users },
        { label: "Live Proctor", url: "/school/proctor", icon: ShieldCheck },
        { label: "Faculty", url: "/school/teachers", icon: GraduationCap },
        { label: "Reports", url: "/school/reports", icon: FileSpreadsheet },
      ];
    }
    if (isParentUser) {
      return [
        { label: "Overview", url: "/parent", icon: HeartHandshake },
        { label: "Alerts", url: "/parent/alerts", icon: Bell },
        { label: "Messages", url: "/parent/messages", icon: MessageSquare },
        { label: "Curriculum", url: "/academics", icon: BookOpen },
      ];
    }
    // Student & Guest default
    return [
      { label: "Practice", url: "/student/practice", icon: Sparkles },
      { label: "Mock Exams", url: "/student/exams", icon: FileCheck2 },
      { label: "Past Papers", url: "/student/past-papers", icon: GraduationCap },
      { label: "Score Predictor", url: "/student/score", icon: TrendingUp },
      { label: "Study Plan", url: "/student/study-plan", icon: Calendar },
      { label: "University Cutoffs", url: "/student/departments", icon: Building2 },
    ];
  }, [isSchoolUser, isParentUser]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await globalSearch(query);
        const rawResults: SearchResult[] = res.data?.results || [];
        setResults(rawResults.filter((item) => isRouteAllowedForRole(userRole, item.url)));
      } catch {
        let fallbackList: SearchResult[] = [];
        if (isSchoolUser) {
          fallbackList = [
            { title: "Student Roster & Marks", category: "Operations", url: "/school/students", desc: "Manage continuous assessment marks & rosters" },
            { title: "Class Sections & Cohorts", category: "Operations", url: "/school/class", desc: "Section distribution & classroom benchmarks" },
            { title: "Live Exam Proctor Console", category: "Operations", url: "/school/proctor", desc: "Real-time candidate testing room telemetry" },
            { title: "National Syllabus Standards", category: "Curriculum", url: "/academics", desc: "Ethiopian national secondary syllabus & competency milestones" },
          ];
        } else if (isParentUser) {
          fallbackList = [
            { title: "Child Progress Overview", category: "Curriculum", url: "/parent", desc: "Continuous assessment scores & attendance" },
            { title: "Academic Alerts & Milestones", category: "Communications", url: "/parent/alerts", desc: "Recent student alerts and notifications" },
            { title: "Teacher Advisory Channel", category: "Communications", url: "/parent/messages", desc: "Direct messages with faculty educators" },
            { title: "National Syllabus Overview", category: "Curriculum", url: "/academics", desc: "Grades 9–12 syllabus topics & outcomes" },
          ];
        } else {
          fallbackList = [
            { title: "Calculus & Limits", category: "Curriculum", url: "/student/practice", desc: "Adaptive drills for Grade 12 Math" },
            { title: "National Entrance Exam Past Papers", category: "Past Papers", url: "/student/past-papers", desc: "Past exam simulation" },
            { title: "Software Engineering & AI", category: "Departments", url: "/student/departments", desc: "Department cutoffs and career map" },
          ];
        }
        setResults(fallbackList.filter(i => i.title.toLowerCase().includes(query.toLowerCase()) || i.desc.toLowerCase().includes(query.toLowerCase())));
      } finally {
        setLoading(false);
        setSelectedIndex(0);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectResult = (url: string) => {
    onClose();
    navigate(url);
  };

  const handleKeyDownNav = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelectResult(results[selectedIndex].url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDownNav}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-slate-100 flex items-center px-4">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search subjects, topics, past papers, exams..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-4 px-3 text-sm text-slate-900 placeholder-slate-400 outline-none font-medium bg-transparent"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
              ESC
            </span>
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Searching...
            </div>
          ) : !query.trim() ? (
            <div className="p-4 text-xs text-slate-500 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Quick Links
              </span>
              <div className="grid grid-cols-2 gap-2">
                {quickSuggestions.map((item) => {
                  const IconComp = item.icon || BookOpen;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleSelectResult(item.url)}
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-200 text-left text-xs font-semibold text-slate-700 transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <IconComp className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No results found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item, idx) => {
                const IconComponent = CATEGORY_ICONS[item.category] || BookOpen;
                const isSelected = idx === selectedIndex;

                return (
                  <button
                    key={`${item.title}-${idx}`}
                    onClick={() => handleSelectResult(item.url)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-slate-900 text-white shadow-sm"
                        : "hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-white/10 text-amber-400"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs truncate">{item.title}</p>
                        <p
                          className={`text-[11px] truncate mt-0.5 ${
                            isSelected ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-white/10 text-slate-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.category}
                      </span>
                      <ArrowRight
                        className={`w-3.5 h-3.5 ${
                          isSelected ? "text-amber-400" : "text-slate-400"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>&uarr;&darr; to navigate</span>
            <span>&crarr; to select</span>
            <span>ESC to dismiss</span>
          </div>
          <span className="font-semibold text-slate-500">Finkison Search</span>
        </div>
      </div>
    </div>
  );
}
