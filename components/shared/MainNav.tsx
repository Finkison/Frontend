import React, { useState, useEffect, useRef, useMemo } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useScope } from "../../hooks/useScope";
import {
  GraduationCap,
  Target,
  BookOpen,
  FlaskConical,
  Scale,
  FileText,
  Network,
  Sparkles,
  Bot,
  Swords,
  Brain,
  FileCheck2,
  TrendingUp,
  Calendar,
  Award,
  Building2,
  School,
  HeartHandshake,
  LayoutDashboard,
  Search,
  Flame,
  Zap,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Users,
  Layers,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import GlobalSearchModal from "./GlobalSearchModal";

export default function MainNav(): React.ReactElement {
  const { user, isAuthenticated, logout } = useAuthStore();
  const scope = useScope();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [clickLockedDropdown, setClickLockedDropdown] = useState<string | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);

  const navContainerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle on click: Locks the dropdown open until clicked again, clicked outside, or escaped
  const toggleDropdown = (name: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (activeDropdown === name) {
      setActiveDropdown(null);
      setClickLockedDropdown(null);
    } else {
      setActiveDropdown(name);
      setClickLockedDropdown(name);
    }
  };

  // Hover-intent engine: Instant swap if already open; 80ms buffer if opening fresh
  const handleMouseEnter = (name: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (clickLockedDropdown) {
      // Swapping tabs while locked keeps the active state
      setActiveDropdown(name);
      setClickLockedDropdown(name);
    } else if (activeDropdown) {
      // Instant switch between adjacent tabs on hover
      setActiveDropdown(name);
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setActiveDropdown(name);
      }, 80);
    }
  };

  // Mouse-leave: Do not close if opened via click lock; otherwise grace period 220ms
  const handleMouseLeave = () => {
    if (clickLockedDropdown) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 220);
  };

  const closeAllMenus = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveDropdown(null);
    setClickLockedDropdown(null);
    setMobileOpen(false);
  };

  useEffect(() => {
    closeAllMenus();
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open to prevent background jank
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Logical International Route Categorization
  const isCurriculumActive = useMemo(
    () =>
      location.pathname.startsWith("/academics") ||
      location.pathname.startsWith("/student/knowledge-map"),
    [location.pathname]
  );

  const isStudyActive = useMemo(
    () =>
      location.pathname.startsWith("/student/lessons") ||
      location.pathname.startsWith("/student/notes") ||
      location.pathname.startsWith("/student/spaced-review") ||
      location.pathname.startsWith("/student/study-plan"),
    [location.pathname]
  );

  const isPracticeActive = useMemo(
    () =>
      location.pathname.startsWith("/student/practice") ||
      location.pathname.startsWith("/student/ai-tutor") ||
      location.pathname.startsWith("/student/battle"),
    [location.pathname]
  );

  const isExamsActive = useMemo(
    () =>
      location.pathname.startsWith("/student/exams") ||
      location.pathname.startsWith("/student/past-papers") ||
      location.pathname.startsWith("/student/exam-history") ||
      location.pathname.startsWith("/student/session"),
    [location.pathname]
  );

  const isAnalyticsActive = useMemo(
    () =>
      location.pathname.startsWith("/student/score") ||
      location.pathname.startsWith("/student/weak-areas") ||
      location.pathname.startsWith("/student/departments") ||
      location.pathname.startsWith("/student/leaderboard") ||
      location.pathname.startsWith("/student/achievements"),
    [location.pathname]
  );

  const isInstitutionsActive = useMemo(
    () =>
      location.pathname.startsWith("/school") ||
      location.pathname.startsWith("/parent"),
    [location.pathname]
  );

  // Auto-expand active navigation domain when mobile drawer opens
  useEffect(() => {
    if (mobileOpen && !mobileExpandedSection) {
      if (isCurriculumActive) setMobileExpandedSection("curriculum");
      else if (isStudyActive) setMobileExpandedSection("study");
      else if (isPracticeActive) setMobileExpandedSection("practice");
      else if (isExamsActive) setMobileExpandedSection("exams");
      else if (isAnalyticsActive) setMobileExpandedSection("analytics");
      else if (isInstitutionsActive) setMobileExpandedSection("institutions");
    }
  }, [
    mobileOpen,
    isCurriculumActive,
    isStudyActive,
    isPracticeActive,
    isExamsActive,
    isAnalyticsActive,
    isInstitutionsActive,
    mobileExpandedSection,
  ]);

  // Global Outside Click & Escape & Shortcut Listeners
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setClickLockedDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchModalOpen((prev) => !prev);
      } else if (event.key === "Escape") {
        setActiveDropdown(null);
        setClickLockedDropdown(null);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    closeAllMenus();
  };

  const candidateName = useMemo(
    () => user?.fullName || user?.name || "Candidate",
    [user]
  );

  const userRole = user?.role || "STUDENT";
  const isSchoolUser = userRole === "TEACHER" || userRole === "PRINCIPAL";
  const isParentUser = userRole === "PARENT";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-xs transition-all">
      <div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4"
        ref={navContainerRef}
      >
        {/* ================= LEFT: Brand Identity ================= */}
        <div className="flex items-center shrink-0">
          <Link
            to={isAuthenticated ? scope.homeRoute : "/"}
            className="flex items-center gap-2.5 group shrink-0"
            onClick={closeAllMenus}
            title={isAuthenticated ? "Go to your dashboard" : "Finkison Home"}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 border border-slate-700/60 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all">
              <GraduationCap className="w-5 h-5 text-amber-400 group-hover:rotate-6 transition-transform" />
            </div>
            <span className="font-serif font-black text-lg tracking-tight text-slate-950 group-hover:text-slate-800 transition-colors">
              FINKISON
            </span>
          </Link>
        </div>

        {/* ================= CENTER: Internationally Standard Navigation ================= */}
        <nav
          className="hidden md:flex items-center gap-0.5 xl:gap-1.5"
          aria-label="Primary Navigation"
        >
          {isSchoolUser ? (
            /* School & Faculty Primary Navigation */
            <>
              <NavLink
                to="/school"
                end
                className={({ isActive }) =>
                  `px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/school/class"
                className={({ isActive }) =>
                  `px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`
                }
              >
                Classes
              </NavLink>
              <NavLink
                to="/school/students"
                className={({ isActive }) =>
                  `px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`
                }
              >
                Students
              </NavLink>
              <NavLink
                to="/school/teachers"
                className={({ isActive }) =>
                  `px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`
                }
              >
                Faculty
              </NavLink>
              <NavLink
                to="/school/reports"
                className={({ isActive }) =>
                  `px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`
                }
              >
                Reports
              </NavLink>

              {/* School Curriculum Explorer Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("curriculumExplorer")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => toggleDropdown("curriculumExplorer")}
                  className={`inline-flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer select-none ${
                    activeDropdown === "curriculumExplorer"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                  aria-expanded={activeDropdown === "curriculumExplorer"}
                  aria-haspopup="menu"
                >
                  <span>Courses</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === "curriculumExplorer" ? "rotate-180 text-white" : "text-slate-400"
                    }`}
                  />
                </button>
                {activeDropdown === "curriculumExplorer" && (
                  <div
                    onMouseEnter={() => {
                      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                    }}
                    onMouseLeave={handleMouseLeave}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[420px] max-w-[calc(100vw-2rem)] select-none"
                    role="menu"
                  >
                    <div className="nav-dropdown space-y-2">
                      <div className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Course Repository
                        </span>
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          MoE Aligned
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <Link
                          to="/academics?stream=natural"
                          onClick={closeAllMenus}
                          className="p-2.5 rounded-xl hover:bg-sky-50 border border-slate-100 transition-colors"
                        >
                          <FlaskConical className="w-4 h-4 text-sky-600 mb-1" />
                          <span className="block font-bold text-xs text-slate-900">Natural Sciences</span>
                          <span className="text-[10px] text-slate-500">STEM Track</span>
                        </Link>
                        <Link
                          to="/academics?stream=social"
                          onClick={closeAllMenus}
                          className="p-2.5 rounded-xl hover:bg-indigo-50 border border-slate-100 transition-colors"
                        >
                          <Scale className="w-4 h-4 text-indigo-600 mb-1" />
                          <span className="block font-bold text-xs text-slate-900">Social Sciences</span>
                          <span className="text-[10px] text-slate-500">Humanities Track</span>
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 my-1" />
                      <div className="grid grid-cols-3 gap-1 text-center">
                        <Link
                          to="/student/lessons"
                          onClick={closeAllMenus}
                          className="p-1.5 rounded-lg hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-blue-500 mx-auto mb-0.5" />
                          <span>Lessons</span>
                        </Link>
                        <Link
                          to="/student/practice"
                          onClick={closeAllMenus}
                          className="p-1.5 rounded-lg hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 mx-auto mb-0.5" />
                          <span>Question Bank</span>
                        </Link>
                        <Link
                          to="/student/exams"
                          onClick={closeAllMenus}
                          className="p-1.5 rounded-lg hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
                        >
                          <FileCheck2 className="w-3.5 h-3.5 text-emerald-500 mx-auto mb-0.5" />
                          <span>Mock Exams</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : isParentUser ? (
            /* Guardian Primary Navigation */
            <>
              <NavLink
                to="/parent"
                end
                className={({ isActive }) =>
                  `px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`
                }
              >
                Progress
              </NavLink>
              <NavLink
                to="/parent/alerts"
                className={({ isActive }) =>
                  `px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`
                }
              >
                Alerts
              </NavLink>
              <NavLink
                to="/parent/messages"
                className={({ isActive }) =>
                  `px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`
                }
              >
                Teacher Messages
              </NavLink>
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("parentCurriculum")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => toggleDropdown("parentCurriculum")}
                  className={`inline-flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer select-none ${
                    activeDropdown === "parentCurriculum"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                  aria-expanded={activeDropdown === "parentCurriculum"}
                  aria-haspopup="menu"
                >
                  <span>Courses</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === "parentCurriculum" ? "rotate-180 text-white" : "text-slate-400"
                    }`}
                  />
                </button>
                {activeDropdown === "parentCurriculum" && (
                  <div
                    onMouseEnter={() => {
                      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                    }}
                    onMouseLeave={handleMouseLeave}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[360px] max-w-[calc(100vw-2rem)] select-none"
                    role="menu"
                  >
                    <div className="nav-dropdown space-y-2">
                      <Link
                        to="/academics"
                        onClick={closeAllMenus}
                        className="block p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100"
                      >
                        <h4 className="font-bold text-xs text-slate-900">National Syllabus (Grades 9–12)</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">Browse syllabi, topics & benchmarks</p>
                      </Link>
                      <Link
                        to="/student/departments"
                        onClick={closeAllMenus}
                        className="block p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100"
                      >
                        <h4 className="font-bold text-xs text-slate-900">University Pathways</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">University admission requirements</p>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Student & Guest Primary Navigation: 5-6 Logical International Domains */
            <>
              {isAuthenticated && !isSchoolUser && !isParentUser && (
                <NavLink
                  to="/student"
                  end
                  className={({ isActive }) =>
                    `px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
                      isActive
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              )}

              {/* 1. CURRICULUM (Tracks & Syllabi) */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("curriculum")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => toggleDropdown("curriculum")}
                  className={`inline-flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer select-none ${
                    activeDropdown === "curriculum"
                      ? "bg-slate-900 text-white shadow-xs"
                      : isCurriculumActive
                      ? "bg-blue-50 text-blue-700 font-bold border border-blue-200/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                  aria-expanded={activeDropdown === "curriculum"}
                  aria-haspopup="menu"
                >
                  <span>Courses</span>
                  {isCurriculumActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === "curriculum" ? "rotate-180 text-white" : "text-slate-400"
                    }`}
                  />
                </button>

                {activeDropdown === "curriculum" && (
                  <div
                    onMouseEnter={() => {
                      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                    }}
                    onMouseLeave={handleMouseLeave}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[540px] max-w-[calc(100vw-2rem)] select-none"
                    role="menu"
                  >
                    <div className="nav-dropdown space-y-2.5">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100/90 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Course Catalog
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200/60">
                          National Standards
                        </span>
                      </div>

                      {/* 2 Academic Tracks */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/academics?stream=natural"
                          onClick={closeAllMenus}
                          className="p-3 rounded-xl hover:bg-sky-50/70 border border-slate-100 hover:border-sky-200 transition-all group flex flex-col justify-between"
                        >
                          <div>
                            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                              <FlaskConical className="w-4 h-4" />
                            </div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-xs text-slate-900 group-hover:text-sky-950">Natural Sciences</h4>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">STEM</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Physics, Chemistry, Biology, Math & Technical Drawing
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-sky-600 mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            Explore Track &rarr;
                          </span>
                        </Link>

                        <Link
                          to="/academics?stream=social"
                          onClick={closeAllMenus}
                          className="p-3 rounded-xl hover:bg-indigo-50/70 border border-slate-100 hover:border-indigo-200 transition-all group flex flex-col justify-between"
                        >
                          <div>
                            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                              <Scale className="w-4 h-4" />
                            </div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-950">Social Sciences</h4>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">Humanities</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">
                              History, Geography, Economics, Civics & Aptitude
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-indigo-600 mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            Explore Track &rarr;
                          </span>
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 my-1" />

                      {/* Syllabi and Concept Map */}
                      <div className="grid grid-cols-2 gap-1.5">
                        <Link
                          to="/academics"
                          onClick={closeAllMenus}
                          className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"
                        >
                          <GraduationCap className="w-4 h-4 text-amber-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-slate-900 truncate">Grades 9–12 Syllabi</p>
                            <p className="text-[10px] text-slate-500">Grade-level standards</p>
                          </div>
                        </Link>
                        <Link
                          to="/student/knowledge-map"
                          onClick={closeAllMenus}
                          className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"
                        >
                          <Network className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-slate-900 truncate">Learning Pathway</p>
                            <p className="text-[10px] text-slate-500">Interactive prerequisite map</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. STUDY (Lessons, Notes, Spaced Review, Planner) */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("study")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => toggleDropdown("study")}
                  className={`inline-flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer select-none ${
                    activeDropdown === "study"
                      ? "bg-slate-900 text-white shadow-xs"
                      : isStudyActive
                      ? "bg-blue-50 text-blue-700 font-bold border border-blue-200/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                  aria-expanded={activeDropdown === "study"}
                  aria-haspopup="menu"
                >
                  <span>Learn</span>
                  {isStudyActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === "study" ? "rotate-180 text-white" : "text-slate-400"
                    }`}
                  />
                </button>

                {activeDropdown === "study" && (
                  <div
                    onMouseEnter={() => {
                      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                    }}
                    onMouseLeave={handleMouseLeave}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[480px] max-w-[calc(100vw-2rem)] select-none"
                    role="menu"
                  >
                    <div className="nav-dropdown space-y-2">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100/90 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Learning Resources
                        </span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                          Active Learning
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <Link
                          to="/student/lessons"
                          onClick={closeAllMenus}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                              Course Materials
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">Structured lessons & readings</p>
                          </div>
                        </Link>

                        <Link
                          to="/student/notes"
                          onClick={closeAllMenus}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 group-hover:text-purple-600 transition-colors">
                              Smart Notes
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">AI-generated summaries</p>
                          </div>
                        </Link>

                        <Link
                          to="/student/spaced-review"
                          onClick={closeAllMenus}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Brain className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                              Spaced Repetition
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">Flashcard retention system</p>
                          </div>
                        </Link>

                        <Link
                          to="/student/study-plan"
                          onClick={closeAllMenus}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-600 transition-colors">
                              Study Planner
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">Adaptive daily schedule</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. PRACTICE (Question Bank, AI Tutor, Battles) */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("practice")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => toggleDropdown("practice")}
                  className={`inline-flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer select-none ${
                    activeDropdown === "practice"
                      ? "bg-slate-900 text-white shadow-xs"
                      : isPracticeActive
                      ? "bg-amber-50 text-amber-800 font-bold border border-amber-200/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                  aria-expanded={activeDropdown === "practice"}
                  aria-haspopup="menu"
                >
                  <span>Practice</span>
                  {isPracticeActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === "practice" ? "rotate-180 text-white" : "text-slate-400"
                    }`}
                  />
                </button>

                {activeDropdown === "practice" && (
                  <div
                    onMouseEnter={() => {
                      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                    }}
                    onMouseLeave={handleMouseLeave}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[440px] max-w-[calc(100vw-2rem)] select-none"
                    role="menu"
                  >
                    <div className="nav-dropdown space-y-2">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100/90 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Practice Lab
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200/60">
                          Interactive
                        </span>
                      </div>

                      <div className="space-y-1">
                        <Link
                          to="/student/practice"
                          onClick={closeAllMenus}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50/60 border border-transparent hover:border-amber-100 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-950">
                                Question Bank
                              </h4>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                            <p className="text-[11px] text-slate-500">Adaptive topic-based drills</p>
                          </div>
                        </Link>

                        <Link
                          to="/student/ai-tutor"
                          onClick={closeAllMenus}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-teal-50/60 border border-transparent hover:border-teal-100 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-xs text-slate-900 group-hover:text-teal-950">
                                AI Tutor
                              </h4>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                            <p className="text-[11px] text-slate-500">Guided step-by-step solutions</p>
                          </div>
                        </Link>

                        <Link
                          to="/student/battle"
                          onClick={closeAllMenus}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-rose-50/60 border border-transparent hover:border-rose-100 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                            <Swords className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-xs text-slate-900 group-hover:text-rose-950">
                                Quiz Arena
                              </h4>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                            <p className="text-[11px] text-slate-500">Real-time competitive quizzes</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. EXAMS (Mock Exams, Past Papers, History, Hall) */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("exams")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => toggleDropdown("exams")}
                  className={`inline-flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer select-none ${
                    activeDropdown === "exams"
                      ? "bg-slate-900 text-white shadow-xs"
                      : isExamsActive
                      ? "bg-purple-50 text-purple-800 font-bold border border-purple-200/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                  aria-expanded={activeDropdown === "exams"}
                  aria-haspopup="menu"
                >
                  <span>Assessments</span>
                  {isExamsActive && <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === "exams" ? "rotate-180 text-white" : "text-slate-400"
                    }`}
                  />
                </button>

                {activeDropdown === "exams" && (
                  <div
                    onMouseEnter={() => {
                      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                    }}
                    onMouseLeave={handleMouseLeave}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[480px] max-w-[calc(100vw-2rem)] select-none"
                    role="menu"
                  >
                    <div className="nav-dropdown space-y-2">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100/90 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Assessment Center
                        </span>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-md border border-purple-200/60">
                          Standardized
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <Link
                          to="/student/exams"
                          onClick={closeAllMenus}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                            <FileCheck2 className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                              Mock Tests
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">Full-length timed simulations</p>
                          </div>
                        </Link>

                        <Link
                          to="/student/past-papers"
                          onClick={closeAllMenus}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                            <GraduationCap className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-600 transition-colors">
                              Past Papers
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">Official archives with solutions</p>
                          </div>
                        </Link>

                        <Link
                          to="/student/exam-history"
                          onClick={closeAllMenus}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-600 transition-colors">
                              Score Analysis
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">Performance trends & history</p>
                          </div>
                        </Link>

                        <Link
                          to="/student/session"
                          onClick={closeAllMenus}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                            <FileCheck2 className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 group-hover:text-purple-600 transition-colors">
                              Test Environment
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">Secure proctored testing</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. ANALYTICS & GOALS (Score Predictor, Weak Areas, University Pathways, Leaderboard) */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("analytics")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => toggleDropdown("analytics")}
                  className={`inline-flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer select-none ${
                    activeDropdown === "analytics"
                      ? "bg-slate-900 text-white shadow-xs"
                      : isAnalyticsActive
                      ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                  aria-expanded={activeDropdown === "analytics"}
                  aria-haspopup="menu"
                >
                  <span>Progress</span>
                  {isAnalyticsActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === "analytics" ? "rotate-180 text-white" : "text-slate-400"
                    }`}
                  />
                </button>

                {activeDropdown === "analytics" && (
                  <div
                    onMouseEnter={() => {
                      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                    }}
                    onMouseLeave={handleMouseLeave}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[480px] max-w-[calc(100vw-2rem)] select-none"
                    role="menu"
                  >
                    <div className="nav-dropdown space-y-2">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100/90 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Performance Dashboard
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          Predictive
                        </span>
                      </div>

                      <div className="space-y-1">
                        <Link
                          to="/student/score"
                          onClick={closeAllMenus}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50/60 border border-transparent hover:border-emerald-100 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-950">
                                Score Predictor
                              </h4>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                            <p className="text-[11px] text-slate-500">AI-powered admission forecast</p>
                          </div>
                        </Link>

                        <Link
                          to="/student/weak-areas"
                          onClick={closeAllMenus}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-rose-50/60 border border-transparent hover:border-rose-100 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                            <Target className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-xs text-slate-900 group-hover:text-rose-950">
                                Knowledge Gaps
                              </h4>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                            <p className="text-[11px] text-slate-500">Targeted weakness analysis</p>
                          </div>
                        </Link>

                        <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-100 text-center">
                          <Link
                            to="/student/departments"
                            onClick={closeAllMenus}
                            className="p-2 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <Building2 className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                            <span className="block text-[11px] font-bold text-slate-800">University Pathways</span>
                            <span className="text-[9px] text-slate-400">Admission criteria</span>
                          </Link>
                          <Link
                            to="/student/leaderboard"
                            onClick={closeAllMenus}
                            className="p-2 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <Flame className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                            <span className="block text-[11px] font-bold text-slate-800">Leaderboard</span>
                            <span className="text-[9px] text-slate-400">XP & rankings</span>
                          </Link>
                          <Link
                            to="/student/achievements"
                            onClick={closeAllMenus}
                            className="p-2 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <Award className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                            <span className="block text-[11px] font-bold text-slate-800">Achievements</span>
                            <span className="text-[9px] text-slate-400">Milestone rewards</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. INSTITUTIONS (School B2B & Family Portals - Prospective Guests & Admins) */}
              {(!isAuthenticated || userRole === "ADMIN") && (
                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter("institutions")}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => toggleDropdown("institutions")}
                    className={`inline-flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer select-none ${
                      activeDropdown === "institutions"
                        ? "bg-slate-900 text-white shadow-xs"
                        : isInstitutionsActive
                        ? "bg-purple-50 text-purple-800 font-bold border border-purple-200/80"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`}
                    aria-expanded={activeDropdown === "institutions"}
                    aria-haspopup="menu"
                  >
                    <span>Campus</span>
                    {isInstitutionsActive && <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === "institutions" ? "rotate-180 text-white" : "text-slate-400"
                      }`}
                    />
                  </button>

                  {activeDropdown === "institutions" && (
                    <div
                      onMouseEnter={() => {
                        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                      }}
                      onMouseLeave={handleMouseLeave}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[440px] max-w-[calc(100vw-2rem)] select-none"
                      role="menu"
                    >
                      <div className="nav-dropdown space-y-2">
                        {/* School Section */}
                        <div className="space-y-1.5">
                          <div className="px-3 py-1 rounded-lg bg-purple-50/60 border border-purple-100/70 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-purple-800">
                              School Admin
                            </span>
                            <span className="text-[9px] font-bold text-purple-600">Enterprise</span>
                          </div>

                          <Link
                            to="/school"
                            onClick={closeAllMenus}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-purple-50/70 transition-colors text-slate-700 group border border-transparent hover:border-purple-100"
                          >
                            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                              <School className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-xs text-slate-900 group-hover:text-purple-950 flex items-center justify-between">
                                <span>School Dashboard</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                              </p>
                              <p className="text-[10px] text-slate-500">Institutional analytics & benchmarks</p>
                            </div>
                          </Link>

                          <div className="grid grid-cols-2 gap-1 px-1">
                            <Link
                              to="/school/class"
                              onClick={closeAllMenus}
                              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
                            >
                              <Layers className="w-3.5 h-3.5 text-purple-600" />
                              <span>Classroom Management</span>
                            </Link>
                            <Link
                              to="/school/students"
                              onClick={closeAllMenus}
                              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
                            >
                              <Users className="w-3.5 h-3.5 text-blue-600" />
                              <span>Student Directory</span>
                            </Link>
                            <Link
                              to="/school/teachers"
                              onClick={closeAllMenus}
                              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
                            >
                              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Faculty Directory</span>
                            </Link>
                            <Link
                              to="/school/reports"
                              onClick={closeAllMenus}
                              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
                            >
                              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Reports & Insights</span>
                            </Link>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 my-1" />

                        {/* Parent Section */}
                        <div className="space-y-1.5">
                          <div className="px-3 py-1 rounded-lg bg-emerald-50/60 border border-emerald-100/70 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                              Family Portal
                            </span>
                            <span className="text-[9px] font-bold text-emerald-600">Engagement</span>
                          </div>

                          <Link
                            to="/parent"
                            onClick={closeAllMenus}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50/70 transition-colors text-slate-700 group border border-transparent hover:border-emerald-100"
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                              <HeartHandshake className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-xs text-slate-900 group-hover:text-emerald-950 flex items-center justify-between">
                                <span>Child's Progress</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                              </p>
                              <p className="text-[10px] text-slate-500">Real-time academic tracking</p>
                            </div>
                          </Link>

                          <div className="grid grid-cols-2 gap-1 px-1">
                            <Link
                              to="/parent/alerts"
                              onClick={closeAllMenus}
                              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                              <span>Performance Alerts</span>
                            </Link>
                            <Link
                              to="/parent/messages"
                              onClick={closeAllMenus}
                              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                              <span>Teacher Messages</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </nav>

        {/* ================= RIGHT: Action Dock & Profile ================= */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Spotlight Search Button */}
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-slate-100/90 hover:border-slate-300 text-slate-500 text-xs transition-colors cursor-pointer group"
            title="Press Ctrl+K to search courses"
            aria-label="Open spotlight search"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span className="hidden lg:inline text-[11px] font-medium text-slate-400 group-hover:text-slate-600">
              Search courses...
            </span>
            <kbd className="hidden xl:inline-flex items-center text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-400 shadow-2xs">
              Ctrl K
            </kbd>
          </button>

          {isAuthenticated ? (
            <>
              {/* Telemetry Capsule (Streak & XP) */}
              {!isSchoolUser && !isParentUser && (
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100/80 border border-slate-200/80 text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1 text-amber-700" title="Daily study streak">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{user?.streakDays || 14}d</span>
                  </span>
                  <span className="w-px h-3 bg-slate-300" />
                  <span className="flex items-center gap-1 text-purple-700" title="Earned XP points">
                    <Zap className="w-3.5 h-3.5 text-purple-500 fill-purple-500" />
                    <span>{user?.xpPoints || 1840}</span>
                  </span>
                </div>
              )}

              {/* Notification Center */}
              <NotificationCenter />

              {/* User Avatar Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("profile")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => toggleDropdown("profile")}
                  className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border transition-all cursor-pointer ${
                    activeDropdown === "profile"
                      ? "border-slate-400 bg-slate-100 shadow-2xs ring-2 ring-slate-900/10"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                  aria-expanded={activeDropdown === "profile"}
                  aria-label="User Account Menu"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-amber-400 font-bold flex items-center justify-center text-[11px] shadow-2xs ring-1 ring-white">
                    {candidateName[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden md:inline font-bold text-xs text-slate-800 max-w-[100px] truncate">
                    {candidateName.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                      activeDropdown === "profile" ? "rotate-180 text-slate-700" : ""
                    }`}
                  />
                </button>

                {activeDropdown === "profile" && (
                  <div
                    onMouseEnter={() => {
                      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                    }}
                    onMouseLeave={handleMouseLeave}
                    className="absolute top-full right-0 pt-2 z-50 w-[300px] select-none"
                    role="menu"
                  >
                    <div className="nav-dropdown">
                      {/* Identity Card */}
                      <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-100 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-amber-400 font-bold flex items-center justify-center text-sm shadow-xs ring-2 ring-white shrink-0">
                            {candidateName[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-xs text-slate-900 truncate">{candidateName}</p>
                            {isSchoolUser ? (
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                                {userRole === "PRINCIPAL" ? "Principal" : "Faculty"} • {user?.school || "School"}
                              </span>
                            ) : isParentUser ? (
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Parent / Guardian
                              </span>
                            ) : (
                              <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                {scope.gradeDisplay} • {scope.streamShort}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Primary Navigation Shortcuts */}
                      <div className="space-y-0.5 text-xs font-semibold text-slate-700">
                        <Link
                          to={scope.homeRoute}
                          onClick={closeAllMenus}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-900 group"
                        >
                          <span className="flex items-center gap-2.5">
                            <LayoutDashboard className="w-4 h-4 text-amber-500" />
                            <span>Dashboard</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                        {!isSchoolUser && !isParentUser && (
                          <Link
                            to="/student/profile"
                            onClick={closeAllMenus}
                            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
                          >
                            <span className="flex items-center gap-2.5">
                              <User className="w-4 h-4 text-slate-500" />
                              <span>My Profile</span>
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                          </Link>
                        )}
                        <Link
                          to={isSchoolUser ? "/school/settings" : isParentUser ? "/parent" : "/student/settings"}
                          onClick={closeAllMenus}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <span className="flex items-center gap-2.5">
                            <Settings className="w-4 h-4 text-slate-500" />
                            <span>Settings</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 my-1.5" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="w-4 h-4 text-rose-500 group-hover:-translate-x-0.5 transition-transform" />
                          <span>Sign Out</span>
                        </div>
                        <span className="text-[10px] text-rose-400 font-normal">End Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Guest Buttons */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-900 text-white shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Get Started</span>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Drawer Trigger (Visible below md:) */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE SLIDING DRAWER WITH ACCORDIONS ================= */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-slate-950/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl overflow-y-auto flex flex-col justify-between border-r border-slate-200 animate-in slide-in-from-left duration-200">
            <div className="p-4 space-y-3">
              {/* Mobile Spotlight Search Trigger */}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setSearchModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500 font-medium"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Search courses...</span>
                </div>
                <kbd className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  Ctrl K
                </kbd>
              </button>

              {/* Candidate Info Card if Logged In */}
              {isAuthenticated && (
                <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold flex items-center justify-center text-sm">
                      {candidateName[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-white truncate">{candidateName}</p>
                      <p className="text-[11px] text-slate-300 truncate">
                        {isSchoolUser
                          ? user?.school || "Faculty"
                          : isParentUser
                          ? "Family Portal"
                          : `${scope.gradeDisplay} • ${scope.streamShort}`}
                      </p>
                    </div>
                  </div>
                  {!isSchoolUser && !isParentUser && (
                    <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-white/10 text-[10px] font-bold">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Flame className="w-3 h-3" /> {user?.streakDays || 14}d streak
                      </span>
                      <span className="text-white/20">•</span>
                      <span className="flex items-center gap-1 text-purple-300">
                        <Zap className="w-3 h-3" /> {user?.xpPoints || 1840} XP
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Primary Dashboard Link */}
              {isAuthenticated && (
                <Link
                  to={scope.homeRoute}
                  onClick={closeAllMenus}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white shadow-xs"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  <span>My Dashboard</span>
                </Link>
              )}

              {/* Mobile Accordions */}
              {/* 1. CURRICULUM ACCORDION */}
              <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() =>
                    setMobileExpandedSection((prev) => (prev === "curriculum" ? null : "curriculum"))
                  }
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                    isCurriculumActive ? "text-blue-700 bg-blue-50/70" : "text-slate-800 hover:bg-slate-50"
                  }`}
                  aria-expanded={mobileExpandedSection === "curriculum"}
                >
                  <div className="flex items-center gap-2.5">
                    <FlaskConical className={`w-4 h-4 ${isCurriculumActive ? "text-blue-600" : "text-slate-500"}`} />
                    <span>Courses & Tracks</span>
                    {isCurriculumActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      mobileExpandedSection === "curriculum" ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {mobileExpandedSection === "curriculum" && (
                  <div className="p-2 space-y-0.5 bg-slate-50/50 border-t border-slate-100">
                    <Link
                      to="/academics?stream=natural"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <FlaskConical className="w-4 h-4 text-sky-600" />
                      <span>Natural Sciences (STEM)</span>
                    </Link>
                    <Link
                      to="/academics?stream=social"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Scale className="w-4 h-4 text-indigo-600" />
                      <span>Social Sciences (Humanities)</span>
                    </Link>
                    <Link
                      to="/academics"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <GraduationCap className="w-4 h-4 text-amber-600" />
                      <span>Grades 9–12 National Syllabus</span>
                    </Link>
                    <Link
                      to="/student/knowledge-map"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Network className="w-4 h-4 text-emerald-600" />
                      <span>Learning Pathway Map</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* 2. STUDY ACCORDION */}
              <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setMobileExpandedSection((prev) => (prev === "study" ? null : "study"))}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                    isStudyActive ? "text-blue-700 bg-blue-50/70" : "text-slate-800 hover:bg-slate-50"
                  }`}
                  aria-expanded={mobileExpandedSection === "study"}
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className={`w-4 h-4 ${isStudyActive ? "text-blue-600" : "text-slate-500"}`} />
                    <span>Learn & Resources</span>
                    {isStudyActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      mobileExpandedSection === "study" ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {mobileExpandedSection === "study" && (
                  <div className="p-2 space-y-0.5 bg-slate-50/50 border-t border-slate-100">
                    <Link
                      to="/student/lessons"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span>Course Materials</span>
                    </Link>
                    <Link
                      to="/student/notes"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span>Smart Notes</span>
                    </Link>
                    <Link
                      to="/student/spaced-review"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Brain className="w-4 h-4 text-indigo-600" />
                      <span>Spaced Repetition</span>
                    </Link>
                    <Link
                      to="/student/study-plan"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>Study Planner</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* 3. PRACTICE ACCORDION */}
              <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setMobileExpandedSection((prev) => (prev === "practice" ? null : "practice"))}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                    isPracticeActive ? "text-amber-800 bg-amber-50/70" : "text-slate-800 hover:bg-slate-50"
                  }`}
                  aria-expanded={mobileExpandedSection === "practice"}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className={`w-4 h-4 ${isPracticeActive ? "text-amber-600" : "text-slate-500"}`} />
                    <span>Practice Lab</span>
                    {isPracticeActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      mobileExpandedSection === "practice" ? "rotate-180 text-amber-600" : ""
                    }`}
                  />
                </button>
                {mobileExpandedSection === "practice" && (
                  <div className="p-2 space-y-0.5 bg-slate-50/50 border-t border-slate-100">
                    <Link
                      to="/student/practice"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Question Bank</span>
                    </Link>
                    <Link
                      to="/student/ai-tutor"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Bot className="w-4 h-4 text-teal-600" />
                      <span>AI Tutor</span>
                    </Link>
                    <Link
                      to="/student/battle"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Swords className="w-4 h-4 text-rose-500" />
                      <span>Quiz Arena</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* 4. EXAMS ACCORDION */}
              <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setMobileExpandedSection((prev) => (prev === "exams" ? null : "exams"))}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                    isExamsActive ? "text-purple-800 bg-purple-50/70" : "text-slate-800 hover:bg-slate-50"
                  }`}
                  aria-expanded={mobileExpandedSection === "exams"}
                >
                  <div className="flex items-center gap-2.5">
                    <FileCheck2 className={`w-4 h-4 ${isExamsActive ? "text-purple-600" : "text-slate-500"}`} />
                    <span>Assessments</span>
                    {isExamsActive && <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      mobileExpandedSection === "exams" ? "rotate-180 text-purple-600" : ""
                    }`}
                  />
                </button>
                {mobileExpandedSection === "exams" && (
                  <div className="p-2 space-y-0.5 bg-slate-50/50 border-t border-slate-100">
                    <Link
                      to="/student/exams"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <FileCheck2 className="w-4 h-4 text-blue-600" />
                      <span>Mock Tests</span>
                    </Link>
                    <Link
                      to="/student/past-papers"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <GraduationCap className="w-4 h-4 text-amber-600" />
                      <span>Past Papers Archive</span>
                    </Link>
                    <Link
                      to="/student/exam-history"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Score Analysis & History</span>
                    </Link>
                    <Link
                      to="/student/session"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <FileCheck2 className="w-4 h-4 text-purple-600" />
                      <span>Test Environment</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* 5. ANALYTICS ACCORDION */}
              <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setMobileExpandedSection((prev) => (prev === "analytics" ? null : "analytics"))}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                    isAnalyticsActive ? "text-emerald-800 bg-emerald-50/70" : "text-slate-800 hover:bg-slate-50"
                  }`}
                  aria-expanded={mobileExpandedSection === "analytics"}
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className={`w-4 h-4 ${isAnalyticsActive ? "text-emerald-600" : "text-slate-500"}`} />
                    <span>Progress & Goals</span>
                    {isAnalyticsActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      mobileExpandedSection === "analytics" ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>
                {mobileExpandedSection === "analytics" && (
                  <div className="p-2 space-y-0.5 bg-slate-50/50 border-t border-slate-100">
                    <Link
                      to="/student/score"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Score Predictor</span>
                    </Link>
                    <Link
                      to="/student/weak-areas"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Target className="w-4 h-4 text-rose-500" />
                      <span>Knowledge Gaps</span>
                    </Link>
                    <Link
                      to="/student/departments"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Building2 className="w-4 h-4 text-blue-500" />
                      <span>University Pathways</span>
                    </Link>
                    <Link
                      to="/student/leaderboard"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span>Leaderboard</span>
                    </Link>
                    <Link
                      to="/student/achievements"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <Award className="w-4 h-4 text-purple-500" />
                      <span>Achievements</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* 6. INSTITUTIONS ACCORDION (Guests & Admins only) */}
              {(!isAuthenticated || userRole === "ADMIN") && (
                <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={() => setMobileExpandedSection((prev) => (prev === "institutions" ? null : "institutions"))}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                      isInstitutionsActive ? "text-purple-800 bg-purple-50/70" : "text-slate-800 hover:bg-slate-50"
                    }`}
                    aria-expanded={mobileExpandedSection === "institutions"}
                  >
                    <div className="flex items-center gap-2.5">
                      <School className={`w-4 h-4 ${isInstitutionsActive ? "text-purple-600" : "text-slate-500"}`} />
                      <span>Campus & Family</span>
                      {isInstitutionsActive && <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        mobileExpandedSection === "institutions" ? "rotate-180 text-purple-600" : ""
                      }`}
                    />
                  </button>
                  {mobileExpandedSection === "institutions" && (
                    <div className="p-2 space-y-0.5 bg-slate-50/50 border-t border-slate-100">
                      <Link
                        to="/school"
                        onClick={closeAllMenus}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                      >
                        <School className="w-4 h-4 text-purple-600" />
                        <span>School Dashboard</span>
                      </Link>
                      <Link
                        to="/school/class"
                        onClick={closeAllMenus}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                      >
                        <Layers className="w-4 h-4 text-purple-500" />
                        <span>Classroom Management</span>
                      </Link>
                      <Link
                        to="/school/students"
                        onClick={closeAllMenus}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                      >
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>Student Directory</span>
                      </Link>
                      <Link
                        to="/school/teachers"
                        onClick={closeAllMenus}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                      >
                        <GraduationCap className="w-4 h-4 text-indigo-500" />
                        <span>Faculty Directory</span>
                      </Link>
                      <Link
                        to="/school/reports"
                        onClick={closeAllMenus}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                      >
                        <FileCheck2 className="w-4 h-4 text-emerald-500" />
                        <span>Reports & Insights</span>
                      </Link>
                      <Link
                        to="/parent"
                        onClick={closeAllMenus}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                      >
                        <HeartHandshake className="w-4 h-4 text-emerald-600" />
                        <span>Family Progress</span>
                      </Link>
                      <Link
                        to="/parent/alerts"
                        onClick={closeAllMenus}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                        <span>Performance Alerts</span>
                      </Link>
                      <Link
                        to="/parent/messages"
                        onClick={closeAllMenus}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-xs transition-all"
                      >
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <span>Teacher Messages</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Footer Actions */}
            <div className="p-4 border-t border-slate-200">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 font-bold text-xs hover:bg-rose-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={closeAllMenus}
                    className="py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-center text-slate-700 hover:bg-slate-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeAllMenus}
                    className="py-2.5 rounded-xl bg-slate-900 font-bold text-xs text-center text-white hover:bg-slate-800"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1" onClick={closeAllMenus} />
        </div>
      )}

      {/* Global Spotlight Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </header>
  );
}
