import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { globalSearch } from "../../services/studentService";
import useAuthStore from "../../store/authStore";
import { isRouteAllowedForRole } from "../../constants/navigationManifest";
import { getNavigationForRole } from "../navigation/navigationConfig";
import { useI18n } from "../../i18n";
import { 
  Search, 
  X, 
  BookOpen, 
  GraduationCap, 
  ArrowRight, 
  Layers,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

interface SearchResult {
  title: string;
  category: string;
  url: string;
  desc: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Curriculum": BookOpen,
  "Past Papers": GraduationCap,
  "Operations": Layers,
  "Communications": MessageSquare,
};

const CATEGORY_TRANSLATION_KEYS: Record<string, string> = {
  Curriculum: "appNavigation.globalSearch.categories.curriculum",
  "Past Papers": "appNavigation.globalSearch.categories.pastPapers",
  Operations: "appNavigation.globalSearch.categories.operations",
  Communications: "appNavigation.globalSearch.categories.communications",
};

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps): React.ReactElement | null {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const userRole = (user?.role || "STUDENT").toUpperCase();
  const quickSuggestions = useMemo(() => {
    const navigation = getNavigationForRole(userRole, user?.grade);
    return [...navigation.primaryNav, ...navigation.secondaryNav.items]
      .filter((item) => isRouteAllowedForRole(userRole, item.to))
      .slice(0, 6)
      .map((item) => ({
        labelKey: `appNavigation.items.${item.labelKey}`,
        url: item.to,
        icon: item.icon,
      }));
  }, [userRole, user?.grade]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);
    setQuery("");
    setResults([]);
    setSearchError(false);
    setSelectedIndex(0);

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'input:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleTab);
      window.requestAnimationFrame(() => previousFocusRef.current?.focus());
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    if (!query.trim()) {
      setResults([]);
      setSearchError(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let isCurrentRequest = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setSearchError(false);
      try {
        const res = await globalSearch(query, controller.signal);
        if (!isCurrentRequest) return;
        const rawResults: SearchResult[] = res.data?.results || [];
        setResults(rawResults.filter((item) => isRouteAllowedForRole(userRole, item.url)));
        setSearchError(false);
      } catch {
        if (!isCurrentRequest || controller.signal.aborted) return;
        setResults([]);
        setSearchError(true);
      } finally {
        if (isCurrentRequest) {
          setLoading(false);
          setSelectedIndex(0);
        }
      }
    }, 200);

    return () => {
      isCurrentRequest = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [isOpen, query, userRole]);

  const handleSelectResult = (url: string) => {
    onClose();
    navigate(url);
  };

  const handleKeyDownNav = (e: React.KeyboardEvent) => {
    if (e.target !== inputRef.current) return;
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
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("appNavigation.globalSearch.title")}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div 
        ref={dialogRef}
        className="bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200 dark:border-white/10 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDownNav}
      >

        <div className="relative border-b border-stone-100 dark:border-white/10 flex items-center px-4">
          <Search className="w-5 h-5 text-stone-400 dark:text-[#A89C90] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            aria-label={t("appNavigation.globalSearch.placeholder")}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={results.length > 0}
            aria-controls="global-search-results"
            aria-activedescendant={results.length > 0 ? `global-search-result-${selectedIndex}` : undefined}
            placeholder={t("appNavigation.globalSearch.placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-4 px-3 text-sm text-stone-900 dark:text-[#FDFBF7] placeholder-stone-400 outline-none font-medium bg-transparent"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t("appNavigation.globalSearch.clearSearch")}
              className="p-1 rounded-lg text-stone-400 dark:text-[#A89C90] hover:text-stone-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              aria-label={t("appNavigation.globalSearch.close")}
              className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:text-stone-300 dark:hover:bg-white/10"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2">
          {loading ? (
            <div className="py-8 text-center text-xs text-stone-400 dark:text-[#A89C90]">
              {t("appNavigation.globalSearch.searching")}
            </div>
          ) : !query.trim() ? (
            <div className="p-4 text-xs text-stone-500 dark:text-[#A89C90] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-[#A89C90] block">
                {t("appNavigation.globalSearch.quickLinks")}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {quickSuggestions.map((item) => {
                  const IconComp = item.icon || BookOpen;
                  return (
                    <button
                      key={item.labelKey}
                      onClick={() => handleSelectResult(item.url)}
                      className="p-2.5 rounded-xl border border-stone-100 dark:border-white/10 bg-stone-50/50 hover:bg-stone-100 dark:hover:bg-white/10 hover:border-stone-200 text-left text-xs font-semibold text-stone-700 dark:text-[#E7E0D6] transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <IconComp className="w-3.5 h-3.5 text-stone-400 dark:text-[#A89C90] group-hover:text-stone-700 transition-colors shrink-0" />
                        <span className="truncate">{t(item.labelKey)}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-stone-400 dark:text-[#A89C90] group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : searchError ? (
            <div role="alert" className="py-10 text-center text-xs text-stone-500 dark:text-[#A89C90]">
              {t("appNavigation.globalSearch.unavailable")}
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-xs text-stone-400 dark:text-[#A89C90]">
              {t("appNavigation.globalSearch.noResults", { query })}
            </div>
          ) : (
            <div className="space-y-1" id="global-search-results" role="listbox" aria-label={t("appNavigation.globalSearch.title")}>
              {results.map((item, idx) => {
                const IconComponent = CATEGORY_ICONS[item.category] || BookOpen;
                const isSelected = idx === selectedIndex;

                return (
                  <button
                    key={`${item.title}-${idx}`}
                    id={`global-search-result-${idx}`}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={-1}
                    onClick={() => handleSelectResult(item.url)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-stone-900 text-white shadow-sm"
                        : "hover:bg-stone-50 dark:hover:bg-white/5 text-stone-800 dark:text-[#FDFBF7]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-white/10 text-amber-400"
                            : "bg-stone-100 dark:bg-[#201815] text-stone-600 dark:text-[#E7E0D6]"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs truncate">{item.title}</p>
                        <p
                          className={`text-[11px] truncate mt-0.5 ${
                            isSelected ? "text-stone-300" : "text-stone-500 dark:text-[#A89C90]"
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
                            ? "bg-white/10 text-stone-200"
                            : "bg-stone-100 dark:bg-[#201815] text-stone-600 dark:text-[#E7E0D6]"
                        }`}
                      >
                        {CATEGORY_TRANSLATION_KEYS[item.category] ? t(CATEGORY_TRANSLATION_KEYS[item.category]) : item.category}
                      </span>
                      <ArrowRight
                        className={`w-3.5 h-3.5 ${
                          isSelected ? "text-amber-400" : "text-stone-400 dark:text-[#A89C90]"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-stone-50 dark:bg-[#1C1512] border-t border-stone-100 dark:border-white/10 flex items-center justify-between text-[11px] text-stone-400 dark:text-[#A89C90]">
          <div className="flex items-center gap-3">
            <span>↑↓ {t("appNavigation.globalSearch.move")}</span>
            <span>↵ {t("appNavigation.globalSearch.select")}</span>
            <span>Esc {t("appNavigation.globalSearch.dismiss")}</span>
          </div>
          <span className="font-semibold text-stone-500 dark:text-[#A89C90]">{t("appNavigation.globalSearch.title")}</span>
        </div>
      </div>
    </div>
  );
}
