import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { globalSearch } from "../../services/studentService";
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
  Command
} from "lucide-react";

interface SearchResult {
  title: string;
  category: "Curriculum" | "Past Papers" | "Departments" | "Technology" | "Scholarships" | string;
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
};

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps): React.ReactElement | null {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
        setResults(res.data?.results || []);
      } catch {
        setResults([
          { title: "Calculus & Limits", category: "Curriculum", url: "/student/practice", desc: "Adaptive drills for Grade 12 Math" },
          { title: "2016 E.C. National Entrance Exam", category: "Past Papers", url: "/student/past-papers", desc: "Past exam simulation" },
          { title: "Software Engineering & AI", category: "Departments", url: "/student/departments", desc: "Department cutoffs and career map" }
        ].filter(i => i.title.toLowerCase().includes(query.toLowerCase())));
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
            placeholder="Search subjects, lessons, past papers, mock exams, majors..."
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
              Searching national knowledge graph...
            </div>
          ) : !query.trim() ? (
            <div className="p-4 text-xs text-slate-500 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Quick Navigation Suggestions
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Question Bank", url: "/student/practice" },
                  { label: "Past Papers", url: "/student/past-papers" },
                  { label: "Score Predictor", url: "/student/score" },
                  { label: "Study Planner", url: "/student/study-plan" },
                  { label: "University Pathways", url: "/student/departments" },
                  { label: "Spaced Repetition", url: "/student/spaced-review" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSelectResult(item.url)}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-200 text-left text-xs font-semibold text-slate-700 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
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
