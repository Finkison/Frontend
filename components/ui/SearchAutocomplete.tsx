import React, { useState, useEffect, useRef, useId } from "react";
import { Search, BookOpen, FileText, ArrowRight, X, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSubjects } from "../../services/curriculumService";

export interface SearchResultItem {
  id: string;
  category: "Preparatory Courses" | "National Exam Papers" | "Curriculum Standards";
  title: string;
  description: string;
  link: string;
}

const VERIFIED_CURRICULUM_CATALOG: SearchResultItem[] = [
  {
    id: "euee-math",
    category: "Preparatory Courses",
    title: "Grade 12 Mathematics (Calculus & Vectors)",
    description: "Standardized university entrance prep for natural science candidates.",
    link: "/academics",
  },
  {
    id: "euee-physics",
    category: "Preparatory Courses",
    title: "Grade 11-12 Physics & Thermodynamics",
    description: "In-depth problem solving calibrated against historical university cutoffs.",
    link: "/academics",
  },
  {
    id: "euee-chem",
    category: "Preparatory Courses",
    title: "Grade 12 Chemistry (Organic & Physical)",
    description: "Reaction kinetics and laboratory calculations mapped to national curriculum.",
    link: "/academics",
  },
  {
    id: "euee-history",
    category: "Preparatory Courses",
    title: "Grade 12 History & Civics",
    description: "Essential social science mastery units with source document analysis.",
    link: "/academics",
  },
  {
    id: "paper-2023",
    category: "National Exam Papers",
    title: "2023 National University Entrance Exam - Paper A",
    description: "Official timed simulation with detailed step-by-step video solutions.",
    link: "/academics",
  },
  {
    id: "paper-2022",
    category: "National Exam Papers",
    title: "2022 National University Entrance Exam - Paper B",
    description: "Complete answer explanations and common misconception flags.",
    link: "/academics",
  },
  {
    id: "std-stem",
    category: "Curriculum Standards",
    title: "Natural Science National Curriculum Matrix",
    description: "Learning objectives and prerequisite tree across Grades 9 through 12.",
    link: "/ai-features",
  },
];

export interface EnterpriseSearchAutocompleteProps {
  placeholder?: string;
  onSelect?: (item: SearchResultItem) => void;
  className?: string;
}

export type SearchAutocompleteProps = EnterpriseSearchAutocompleteProps;

export const SearchAutocomplete = EnterpriseSearchAutocomplete;

export default function EnterpriseSearchAutocomplete({
  placeholder = "Search subjects, exams, or curriculum units...",
  onSelect,
  className = "",
}: EnterpriseSearchAutocompleteProps): React.ReactElement {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [catalogItems, setCatalogItems] = useState<SearchResultItem[]>(VERIFIED_CURRICULUM_CATALOG);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Grade 12 Mathematics",
    "Physics Thermodynamics",
    "National Exam Paper",
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  const comboboxId = useId();
  const listboxId = `${comboboxId}-listbox`;

  // Fetch live backend curriculum subjects and merge into search catalog
  useEffect(() => {
    let isMounted = true;
    getSubjects()
      .then((res) => {
        if (!isMounted || !Array.isArray(res.data)) return;
        const liveItems: SearchResultItem[] = res.data.map((subj: any) => ({
          id: String(subj.id),
          category: "Preparatory Courses",
          title: subj.name,
          description: `${subj.stream === "NATURAL_SCIENCE" ? "Natural Science" : "Social Science"} • ${subj.unitsCount || 6} Units • ${subj.totalQuestions || 200}+ Exam Questions`,
          link: "/academics",
        }));
        setCatalogItems([...liveItems, ...VERIFIED_CURRICULUM_CATALOG]);
      })
      .catch(() => {
        // Fallback to verified static catalog if backend is unavailable
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // 300ms debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const lower = query.toLowerCase();
      const filtered = catalogItems.filter(
        (item) =>
          item.title.toLowerCase().includes(lower) ||
          item.description.toLowerCase().includes(lower) ||
          item.category.toLowerCase().includes(lower)
      );
      setResults(filtered);
      setActiveIndex(-1);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, catalogItems]);

  const handleSelect = (item: SearchResultItem) => {
    // Add to recents
    setRecentSearches((prev) => [item.title, ...prev.filter((s) => s !== item.title)].slice(0, 5));
    setIsOpen(false);
    setQuery("");
    if (onSelect) {
      onSelect(item);
    } else {
      navigate(item.link);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const max = results.length > 0 ? results.length - 1 : recentSearches.length - 1;
      setActiveIndex((prev) => (prev < max ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const max = results.length > 0 ? results.length - 1 : recentSearches.length - 1;
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : max));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results.length > 0 && activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex]);
      } else if (results.length === 0 && activeIndex >= 0 && activeIndex < recentSearches.length) {
        setQuery(recentSearches[activeIndex]);
      }
    }
  };

  // Grouped results map
  const groupedResults = results.reduce<Record<string, SearchResultItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className={`relative w-full ${className}`}>
      {/* Combobox Input Field: 48px height, 16px font to prevent mobile zoom */}
      <div className="relative flex items-center">
        <Search
          size={18}
          className="absolute left-3.5 text-slate-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-item-${activeIndex}` : undefined
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-12 pl-10 pr-10 text-base text-slate-900 bg-white border border-slate-300 rounded-[6px] focus:outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 shadow-xs transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
            aria-label="Clear search input"
            className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Floating Dropdown Results Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-dropdown"
            style={{ zIndex: "var(--z-dropdown, 200)" }}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[12px] border border-slate-200 shadow-xl overflow-hidden max-h-[380px] overflow-y-auto z-dropdown animate-fade-in"
            style={{ zIndex: "calc(var(--z-dropdown, 200) + 1)" }}
          >
            {/* When Query is Empty: Show Recent Searches */}
            {!query.trim() && recentSearches.length > 0 && (
              <div className="p-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                  <Clock size={12} aria-hidden="true" />
                  <span>Recent Searches</span>
                </p>
                <ul className="mt-1 space-y-1" role="listbox" id={listboxId}>
                  {recentSearches.map((search, idx) => (
                    <li
                      key={search}
                      id={`${listboxId}-item-${idx}`}
                      role="option"
                      aria-selected={activeIndex === idx}
                      onClick={() => {
                        setQuery(search);
                        inputRef.current?.focus();
                      }}
                      className={`px-3 py-2 text-sm rounded-[6px] cursor-pointer flex items-center justify-between text-slate-700 transition-colors ${
                        activeIndex === idx ? "bg-slate-100 text-[#881337] font-medium" : "hover:bg-slate-50"
                      }`}
                    >
                      <span>{search}</span>
                      <ArrowRight size={14} className="text-slate-400" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* When Results Found: Grouped View */}
            {query.trim() && results.length > 0 && (
              <div className="p-3 space-y-4" role="listbox" id={listboxId}>
                {Object.entries(groupedResults).map(([cat, items]) => (
                  <div key={cat} className="space-y-1">
                    <p className="text-xs font-semibold text-[#881337] uppercase tracking-wider px-2 py-1">
                      {cat}
                    </p>
                    {items.map((item, idx) => {
                      const itemIndex = results.indexOf(item);
                      const isSelected = activeIndex === itemIndex;
                      return (
                        <div
                          key={item.id}
                          id={`${listboxId}-item-${itemIndex}`}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelect(item)}
                          className={`p-2.5 rounded-[6px] cursor-pointer text-start transition-colors ${
                            isSelected ? "bg-slate-100 border-l-2 border-[#881337]" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-900">
                              {item.title}
                            </span>
                            <ArrowRight size={14} className="text-slate-400" aria-hidden="true" />
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* When Query Has No Matches: Empty State */}
            {query.trim() && results.length === 0 && (
              <div className="p-6 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-800">
                  No matching academic modules found
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Try searching for "Grade 12", "Calculus", "Physics", or "National Exam".
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
