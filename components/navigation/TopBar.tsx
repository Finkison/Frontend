import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import notificationService from "../../services/notificationService";
import {
  Menu,
  Search,
  Plus,
  Bell,
  HelpCircle,
  Globe,
  User,
  LogOut,
  ChevronDown,
  Layers,
  UserPlus,
  ListChecks,
  MessageSquare,
  BookOpen,
  Keyboard,
  Headphones,
  Check,
  CheckCheck,
  X,
  ExternalLink,
  Sparkles,
  FileCheck,
  Settings,
  Copy,
} from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";
import GlobalSearchModal from "../shared/GlobalSearchModal";

export interface TopBarProps {
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean;
}

export default function TopBar({ onToggleSidebar }: TopBarProps): React.ReactElement {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const currentRole = (user?.role || "STUDENT").toUpperCase();
  const isTeacher = currentRole === "TEACHER";
  const isDirector = ["PRINCIPAL", "SCHOOL_ADMIN", "ADMIN", "SUPER_ADMIN"].includes(currentRole);
  const isParent = currentRole === "PARENT";
  const teacherSubject = (user as any)?.subject || "Mathematics";

  const profileLink = isDirector
    ? "/school/security"
    : isTeacher
    ? "/teacher/security"
    : isParent
    ? "/parent"
    : "/student/profile";

  const settingsLink = isDirector
    ? "/school/settings"
    : isTeacher
    ? "/teacher/security"
    : isParent
    ? "/parent"
    : "/student/settings";

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [copiedSupportEmail, setCopiedSupportEmail] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"create" | "notifs" | "help" | "profile" | null>(null);
  const [notifTab, setNotifTab] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click or Escape
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      } else if (e.key === "Escape") {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    notificationService.list()
      .then((res) => {
        const list = Array.isArray(res?.notifications) ? res.notifications : (Array.isArray(res) ? res : []);
        setNotifications(list);
        setUnreadCount(list.filter((n: any) => !n.is_read && !n.read).length);
      })
      .catch(() => {
        setNotifications([]);
        setUnreadCount(0);
      });
  }, []);

  const toggleMenu = (menu: "create" | "notifs" | "help" | "profile") => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const displayedNotifications = notifTab === "unread"
    ? notifications.filter((n) => !n.is_read && !n.read)
    : notifications;

  return (
    <>
      <header
        ref={containerRef}
        className="h-[56px] bg-white/95 dark:bg-[#0B1B3A]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 sticky top-0 z-30 px-3 sm:px-4 flex items-center justify-between gap-3 select-none transition-colors"
      >
        {/* Left: Sidebar Toggle + Breadcrumbs + Fixed Subject Label (Teacher) */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 min-h-[44px] min-w-[44px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0369A1]"
            aria-label="Toggle navigation menu"
            title="Toggle sidebar (Ctrl+B)"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2.5 min-w-0">
            <Breadcrumbs />
            {isTeacher && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] dark:bg-sky-950/50 text-[#1D4ED8] dark:text-[#87CEFA] border border-[#BFDBFE] dark:border-sky-800/60 shrink-0">
                {teacherSubject}
              </span>
            )}
          </div>
        </div>

        {/* Center / Left-aligned: Global Search (360px on desktop) */}
        <div className="flex-1 max-w-[360px] hidden md:block">
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 text-xs text-slate-500 dark:text-slate-400 transition-colors cursor-pointer min-h-[38px] focus:outline-none focus:ring-2 focus:ring-[#0369A1]"
            aria-label="Search or type a command (Ctrl+K)"
          >
            <div className="flex items-center gap-2 text-slate-400">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>Search or type a command...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/15 bg-white dark:bg-white/10 text-[10px] font-mono text-slate-400 dark:text-slate-400">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Fixed Order: Quick Create (+), AI Credits, Notifications, Help, Language, Profile */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Mobile search icon button */}
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="md:hidden flex items-center justify-center p-2 rounded-[8px] text-slate-500 hover:text-slate-900 hover:bg-slate-100 min-h-[44px] min-w-[44px] cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* AI Credits Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#87CEFA]" />
            <span>{isTeacher ? "100 credits" : "450 credits"}</span>
          </div>

          {/* 1. Quick create (+) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu("create")}
              className={`flex items-center justify-center p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#1D4ED8] dark:hover:text-[#87CEFA] hover:bg-[#EFF6FF] dark:hover:bg-white/10 min-h-[44px] min-w-[44px] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0369A1] ${
                activeMenu === "create" ? "bg-[#EFF6FF] dark:bg-white/10 text-[#1D4ED8] dark:text-[#87CEFA]" : ""
              }`}
              aria-label="Quick create"
              aria-expanded={activeMenu === "create"}
              title="Quick create"
            >
              <Plus className="w-5 h-5" />
            </button>

            {activeMenu === "create" && (
              <div
                role="menu"
                className="absolute right-0 mt-1 w-56 bg-white dark:bg-[#0E2046] border border-slate-200/90 dark:border-white/10 rounded-xl shadow-xl py-1.5 z-40 text-xs text-slate-900 dark:text-white"
              >
                <div className="px-3 py-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">
                  Quick Actions
                </div>
                {isDirector ? (
                  <>
                    <Link
                      to="/school/sections"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#1D4ED8] dark:hover:text-[#87CEFA] min-h-[38px]"
                      role="menuitem"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span>Section</span>
                    </Link>
                    <Link
                      to="/school/people?tab=teachers"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#1D4ED8] dark:hover:text-[#87CEFA] min-h-[38px]"
                      role="menuitem"
                    >
                      <UserPlus className="w-4 h-4 text-slate-400" />
                      <span>Invite teacher</span>
                    </Link>
                    <Link
                      to="/school/people?tab=students"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#1D4ED8] dark:hover:text-[#87CEFA] min-h-[38px]"
                      role="menuitem"
                    >
                      <UserPlus className="w-4 h-4 text-slate-400" />
                      <span>Invite students</span>
                    </Link>
                  </>
                ) : isTeacher ? (
                  <>
                    <Link
                      to="/teacher/ai-assistant?tool=exam_generator"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#1D4ED8] dark:hover:text-[#87CEFA] min-h-[38px]"
                      role="menuitem"
                    >
                      <FileCheck className="w-4 h-4 text-slate-400" />
                      <span>Exam</span>
                    </Link>
                    <Link
                      to="/teacher/tasks"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#1D4ED8] dark:hover:text-[#87CEFA] min-h-[38px]"
                      role="menuitem"
                    >
                      <ListChecks className="w-4 h-4 text-slate-400" />
                      <span>Task</span>
                    </Link>
                    <Link
                      to="/teacher/ai-assistant?tool=notes"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#1D4ED8] dark:hover:text-[#87CEFA] min-h-[38px]"
                      role="menuitem"
                    >
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span>Notes</span>
                    </Link>
                    <Link
                      to="/teacher/ai-assistant?tool=lesson_plan"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#1D4ED8] dark:hover:text-[#87CEFA] min-h-[38px]"
                      role="menuitem"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span>Lesson plan</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/student/exams"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#1D4ED8] dark:hover:text-[#87CEFA] min-h-[38px]"
                      role="menuitem"
                    >
                      <FileCheck className="w-4 h-4 text-slate-400" />
                      <span>Take mock test</span>
                    </Link>
                    <Link
                      to="/student/practice"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#1D4ED8] dark:hover:text-[#87CEFA] min-h-[38px]"
                      role="menuitem"
                    >
                      <Sparkles className="w-4 h-4 text-slate-400" />
                      <span>Practice drill</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 2. Notifications (capped at 9+) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu("notifs")}
              className={`relative flex items-center justify-center p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 min-h-[44px] min-w-[44px] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0369A1] ${
                activeMenu === "notifs" ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white" : ""
              }`}
              aria-label={`Notifications, ${unreadCount} unread`}
              aria-expanded={activeMenu === "notifs"}
              title="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#0369A1] text-white text-[10px] font-mono tabular-nums font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {activeMenu === "notifs" && (
              <div
                className="absolute right-0 mt-1 w-80 sm:w-96 bg-white dark:bg-[#0E2046] border border-slate-200/90 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-40 text-xs"
                role="dialog"
                aria-label="Notification center"
              >
                <div className="p-3 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">Notifications</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#EFF6FF] dark:bg-sky-950 text-[#1D4ED8] dark:text-[#87CEFA] font-mono tabular-nums text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUnreadCount(0)}
                    className="text-[11px] text-[#1D4ED8] dark:text-[#87CEFA] hover:underline font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>

                {/* Tabs: All / Unread */}
                <div className="px-3 pt-2 border-b border-[#E2E8F0] flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setNotifTab("all")}
                    className={`pb-2 border-b-2 font-medium cursor-pointer ${
                      notifTab === "all" ? "border-[#1D4ED8] text-[#1D4ED8]" : "border-transparent text-slate-500"
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotifTab("unread")}
                    className={`pb-2 border-b-2 font-medium cursor-pointer ${
                      notifTab === "unread" ? "border-[#1D4ED8] text-[#1D4ED8]" : "border-transparent text-slate-500"
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>

                {/* Notification Items */}
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {displayedNotifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No {notifTab === "unread" ? "unread " : ""}notifications.
                    </div>
                  ) : (
                    displayedNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 hover:bg-slate-50 transition-colors flex items-start gap-2.5 cursor-pointer ${
                          (!notif.is_read && !notif.read) ? "bg-[#EFF6FF]/40" : ""
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${(!notif.is_read && !notif.read) ? "bg-[#1D4ED8]" : "bg-transparent"}`} />
                        <div className="flex-1 space-y-0.5">
                          <p className="text-slate-800 font-medium">{notif.title}</p>
                          <p className="text-[11px] text-slate-400">{notif.time || notif.created_at || "Recent"}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] text-center">
                  <Link
                    to="/parent/alerts"
                    onClick={() => setActiveMenu(null)}
                    className="text-xs text-[#1D4ED8] hover:underline font-semibold"
                  >
                    View notification center
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 3. Help */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu("help")}
              className={`flex items-center justify-center p-2 rounded-[8px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 min-h-[44px] min-w-[44px] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#15803D] ${
                activeMenu === "help" ? "bg-slate-100 text-slate-900" : ""
              }`}
              aria-label="Help and documentation"
              aria-expanded={activeMenu === "help"}
              title="Help"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>

            {activeMenu === "help" && (
              <div
                role="menu"
                className="absolute right-0 mt-1 w-64 bg-white dark:bg-[#0E2046] border border-slate-200/90 dark:border-white/10 rounded-xl shadow-xl py-1.5 z-40 text-xs text-slate-900 dark:text-white"
              >
                <div className="px-3 py-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">
                  Help & Support Desk
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMenu(null);
                    setHelpModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 min-h-[38px] text-start cursor-pointer"
                  role="menuitem"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>Quick Help & Guides</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMenu(null);
                    window.dispatchEvent(
                      new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true })
                    );
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 min-h-[38px] cursor-pointer"
                  role="menuitem"
                >
                  <Keyboard className="w-4 h-4 text-slate-400" />
                  <span>Keyboard shortcuts</span>
                </button>
                <Link
                  to="/contact"
                  onClick={() => setActiveMenu(null)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 min-h-[38px]"
                  role="menuitem"
                >
                  <Headphones className="w-4 h-4 text-slate-400" />
                  <span>Contact IT support</span>
                </Link>
              </div>
            )}
          </div>

          {/* 5. Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu("profile")}
              className={`flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 min-h-[44px] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0369A1] ${
                activeMenu === "profile" ? "bg-slate-100 dark:bg-white/10" : ""
              }`}
              aria-label="Profile and user preferences"
              aria-expanded={activeMenu === "profile"}
            >
              <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-[#0369A1] text-white font-bold text-xs flex items-center justify-center">
                {(user?.fullName || user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {activeMenu === "profile" && (
              <div
                role="menu"
                className="absolute right-0 mt-1 w-64 bg-white dark:bg-[#0E2046] border border-slate-200/90 dark:border-white/10 rounded-xl shadow-xl py-2 z-40 text-xs text-slate-900 dark:text-white"
              >
                {/* User Identity Block: Name, Role, School */}
                <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-white/10 space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    {user?.fullName || user?.name || "School Administrator"}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-[#EFF6FF] dark:bg-sky-950/60 text-[#1D4ED8] dark:text-[#87CEFA] font-semibold text-[10px] border border-[#BFDBFE] dark:border-sky-800/60">
                      {user?.role || "SCHOOL_ADMIN"}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user?.school || "Finkison Academy"}
                    </span>
                  </div>
                </div>

                {/* Profile menu links: Profile, Preferences, Switch role, Sign out */}
                <div className="py-1">
                  <Link
                    to={profileLink}
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center gap-2 px-3.5 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 min-h-[38px]"
                    role="menuitem"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Profile & Account</span>
                  </Link>
                  <Link
                    to={settingsLink}
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center gap-2 px-3.5 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 min-h-[38px]"
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Preferences & Security</span>
                  </Link>
                </div>

                {/* Switch Role Options */}
                <div className="py-1 border-t border-slate-100 dark:border-white/10">
                  <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Role
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      updateUser({ role: "PRINCIPAL" });
                      setActiveMenu(null);
                      navigate("/school");
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-slate-50 cursor-pointer min-h-[38px] ${
                      isDirector ? "bg-[#EFF6FF] text-[#1D4ED8] font-semibold" : "text-[#0F172A]"
                    }`}
                  >
                    <span>School Director</span>
                    {isDirector && <Check className="w-3.5 h-3.5 text-[#1D4ED8]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateUser({ role: "TEACHER", subject: (user as any)?.subject || "Biology" });
                      setActiveMenu(null);
                      navigate("/teacher");
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-slate-50 cursor-pointer min-h-[38px] ${
                      isTeacher ? "bg-[#EFF6FF] text-[#1D4ED8] font-semibold" : "text-[#0F172A]"
                    }`}
                  >
                    <span>Teacher ({teacherSubject || "Biology"})</span>
                    {isTeacher && <Check className="w-3.5 h-3.5 text-[#1D4ED8]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateUser({ role: "STUDENT" });
                      setActiveMenu(null);
                      navigate("/student");
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-slate-50 cursor-pointer min-h-[38px] ${
                      currentRole === "STUDENT" ? "bg-[#EFF6FF] text-[#1D4ED8] font-semibold" : "text-[#0F172A]"
                    }`}
                  >
                    <span>Student</span>
                    {currentRole === "STUDENT" && <Check className="w-3.5 h-3.5 text-[#1D4ED8]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateUser({ role: "PARENT" });
                      setActiveMenu(null);
                      navigate("/parent");
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-slate-50 cursor-pointer min-h-[38px] ${
                      currentRole === "PARENT" ? "bg-[#EFF6FF] text-[#1D4ED8] font-semibold" : "text-[#0F172A]"
                    }`}
                  >
                    <span>Parent</span>
                    {currentRole === "PARENT" && <Check className="w-3.5 h-3.5 text-[#1D4ED8]" />}
                  </button>
                </div>

                <div className="pt-1 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenu(null);
                      logout();
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 cursor-pointer min-h-[38px]"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span className="font-semibold">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Command Palette Modal */}
      {searchModalOpen && (
        <GlobalSearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />
      )}

      {/* Interactive In-App Help & Support Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-[#E2E8F0] shadow-xl animate-fade-in text-start">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0369A1]">
                  <HelpCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Finkison Support Desk</h3>
                  <p className="text-[11px] text-[#64748B]">Operational assistance and technical support</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1 cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Guides</h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-[#0F172A]">Password and session controls</p>
                  <p className="text-[#64748B] mt-0.5">
                    Navigate to Account Security from the sidebar or profile menu to change passwords, enable 2FA, and sign out other devices.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-[#0F172A]">Progress and session auto-save</p>
                  <p className="text-[#64748B] mt-0.5">
                    Practice sets and exam drafts auto-save continuously to protect study progress across active sessions.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Direct Support Channels</h4>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] text-xs">
                <div className="space-y-0.5">
                  <p className="font-semibold text-[#0369A1]">Technical Support Email</p>
                  <p className="font-mono text-slate-700">support@finkison.com</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("support@finkison.com");
                    setCopiedSupportEmail(true);
                    setTimeout(() => setCopiedSupportEmail(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-[6px] bg-white border border-[#BAE6FD] text-[#0369A1] font-semibold hover:bg-slate-50 text-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedSupportEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSupportEmail ? "Copied" : "Copy email"}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <p className="font-semibold text-slate-800">Support desk hotline • Addis Ababa</p>
                  <p className="text-slate-600 font-mono">+251 11 123 4567 • Mon–Fri, 8:30 AM–5:30 PM EAT</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setHelpModalOpen(false);
                  window.dispatchEvent(
                    new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true })
                  );
                }}
                className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Keyboard shortcuts • Ctrl+K</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setHelpModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-[6px] text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                <Link
                  to="/contact"
                  onClick={() => setHelpModalOpen(false)}
                  className="px-4 py-1.5 rounded-[6px] text-xs font-semibold bg-[#0369A1] hover:bg-[#075985] text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
