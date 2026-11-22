import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import notificationService from "../../services/notificationService";
import type { NotificationItem } from "../../services/notificationService";
import { logout as revokeCurrentSession } from "../../services/authService";
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
import { useI18n } from "../../i18n";
import { useToast } from "../ui/Toast";

export interface TopBarProps {
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean;
}

export default function TopBar({ onToggleSidebar, isSidebarOpen = false }: TopBarProps): React.ReactElement {
  const { user, role, logout, updateUser } = useAuthStore();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const currentRole = (user?.role || role || "STUDENT").toUpperCase();
  const isTeacher = currentRole === "TEACHER";
  const isStudent = currentRole === "STUDENT";
  const isDirector = ["PRINCIPAL", "SCHOOL_ADMIN", "ADMIN", "SUPER_ADMIN"].includes(currentRole);
  const isParent = currentRole === "PARENT";
  const teacherSubject = user?.subject || "Mathematics";
  const roleLabel = isDirector
    ? t("appNavigation.roles.schoolAdministrator")
    : isTeacher
    ? t("appNavigation.roles.teacher")
    : isParent
    ? t("appNavigation.roles.parentGuardian")
    : t("appNavigation.roles.student");
  const notificationDestination = "/student/settings";
  const notificationDestinationLabel = "appNavigation.topBar.notificationSettings";

  const profileLink = isDirector
    ? "/school/security"
    : isTeacher
    ? "/teacher/security"
    : isParent
    ? "/parent/settings"
    : "/student/profile";

  const settingsLink = isDirector
    ? "/school/settings"
    : isTeacher
    ? "/teacher/security"
    : isParent
    ? "/parent/settings"
    : "/student/settings";

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [copiedSupportEmail, setCopiedSupportEmail] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"create" | "notifs" | "help" | "profile" | null>(null);
  const [notifTab, setNotifTab] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsFailed, setNotificationsFailed] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [notificationRetryCount, setNotificationRetryCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const notificationsFetchedRef = useRef(false);
  const lastNotificationRetryRef = useRef(0);
  const menuTriggerRefs = useRef<Record<"create" | "notifs" | "help" | "profile", HTMLButtonElement | null>>({
    create: null,
    notifs: null,
    help: null,
    profile: null,
  });
  const helpCloseButtonRef = useRef<HTMLButtonElement>(null);

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
        if (activeMenu) {
          e.preventDefault();
          const trigger = menuTriggerRefs.current[activeMenu];
          setActiveMenu(null);
          window.requestAnimationFrame(() => trigger?.focus());
        } else if (helpModalOpen) {
          e.preventDefault();
          setHelpModalOpen(false);
          window.requestAnimationFrame(() => menuTriggerRefs.current.help?.focus());
        }
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeMenu, helpModalOpen]);

  useEffect(() => {
    if (!helpModalOpen) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    window.requestAnimationFrame(() => helpCloseButtonRef.current?.focus());

    const handleHelpKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const dialog = document.getElementById("support-desk-dialog");
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleHelpKeyDown);
    return () => {
      document.removeEventListener("keydown", handleHelpKeyDown);
      window.requestAnimationFrame(() => previousFocus?.focus());
    };
  }, [helpModalOpen]);

  useEffect(() => {
    let isActive = true;
    if (!isStudent) {
      notificationsFetchedRef.current = false;
      setNotifications([]);
      setUnreadCount(0);
      setNotificationsFailed(false);
      setNotificationsLoading(false);
      setActiveMenu((active) => active === "notifs" ? null : active);
      return () => { isActive = false; };
    }

    const shouldRefreshNotifications = !notificationsFetchedRef.current
      || activeMenu === "notifs"
      || notificationRetryCount !== lastNotificationRetryRef.current;
    if (!shouldRefreshNotifications) return;
    notificationsFetchedRef.current = true;
    lastNotificationRetryRef.current = notificationRetryCount;

    setNotificationsLoading(true);
    notificationService.list()
      .then((response) => {
        if (!isActive) return;
        const list = Array.isArray(response.notifications) ? response.notifications : [];
        setNotifications(list);
        setUnreadCount(typeof response.unread_count === "number"
          ? response.unread_count
          : list.filter((notification) => !notification.is_read).length);
        setNotificationsFailed(false);
      })
      .catch(() => {
        if (!isActive) return;
        setNotifications([]);
        setUnreadCount(0);
        setNotificationsFailed(true);
      })
      .finally(() => {
        if (isActive) setNotificationsLoading(false);
      });

    return () => { isActive = false; };
  }, [isStudent, activeMenu, notificationRetryCount]);

  const toggleMenu = (menu: "create" | "notifs" | "help" | "profile") => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const displayedNotifications = notifTab === "unread"
    ? notifications.filter((notification) => !notification.is_read)
    : notifications;

  const handleMarkAllNotificationsRead = async () => {
    if (markingAllRead || unreadCount === 0) return;
    setMarkingAllRead(true);
    try {
      await notificationService.markAllRead();
      setNotifications((current) => current.map((notification) => ({ ...notification, is_read: true })));
      setUnreadCount(0);
    } catch {
      showToast({
        type: "error",
        title: t("appNavigation.topBar.notificationUpdateFailedTitle"),
        message: t("appNavigation.topBar.notificationUpdateFailedMessage"),
      });
    } finally {
      setMarkingAllRead(false);
    }
  };

  const handleOpenNotification = async (notification: NotificationItem) => {
    if (!notification.is_read) {
      try {
        await notificationService.markRead(notification.id);
        setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, is_read: true } : item));
        setUnreadCount((count) => Math.max(0, count - 1));
      } catch {
        showToast({
          type: "error",
          title: t("appNavigation.topBar.notificationUpdateFailedTitle"),
          message: t("appNavigation.topBar.notificationUpdateFailedMessage"),
        });
        return;
      }
    }

    setActiveMenu(null);
    if (notification.action_url.startsWith("/") && !notification.action_url.startsWith("//")) {
      navigate(notification.action_url);
    }
  };

  return (
    <>
      <header
        ref={containerRef}
        className="h-[56px] bg-white/95 dark:bg-[#1C1512]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-white/10 sticky top-0 z-30 px-3 sm:px-4 flex items-center justify-between gap-3 select-none transition-colors"
      >

        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex items-center justify-center p-2 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/10 min-h-[44px] min-w-[44px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#881337]"
            aria-label={isSidebarOpen ? t("appNavigation.topBar.closeNavigation") : t("appNavigation.topBar.openNavigation")}
            aria-expanded={isSidebarOpen}
            title={t("appNavigation.topBar.toggleSidebar")}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2.5 min-w-0">
            <Breadcrumbs />
            {isTeacher && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF1F2] dark:bg-crimson-950/50 text-[#881337] dark:text-[#FBBF24] border border-[#FECDD3] dark:border-crimson-800/60 shrink-0">
                {teacherSubject}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 max-w-[360px] hidden md:block">
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-stone-200/80 dark:border-white/10 bg-stone-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-stone-300 dark:hover:border-white/20 text-xs text-stone-500 dark:text-stone-400 transition-colors cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#881337] dark:focus:ring-[#FBBF24]"
            aria-label={t("appNavigation.topBar.searchCommand")}
          >
            <div className="flex items-center gap-2 text-stone-400 dark:text-[#A89C90]">
              <Search className="w-4 h-4 text-stone-400 dark:text-stone-500" />
              <span>{t("appNavigation.topBar.searchCommand")}</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded border border-stone-200 dark:border-white/15 bg-white dark:bg-white/10 text-[10px] font-mono text-stone-400 dark:text-stone-400">
              Ctrl+K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">

          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="md:hidden flex items-center justify-center p-2 rounded-[8px] text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/10 min-h-[44px] min-w-[44px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#881337] dark:focus:ring-[#FBBF24]"
            aria-label={t("appNavigation.topBar.search")}
          >
            <Search className="w-4 h-4" />
          </button>

          {!isParent && <div className="relative">
            <button
              ref={(element) => { menuTriggerRefs.current.create = element; }}
              type="button"
              onClick={() => toggleMenu("create")}
              className={`flex items-center justify-center p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:text-[#881337] dark:hover:text-[#FBBF24] hover:bg-[#FFF1F2] dark:hover:bg-white/10 min-h-[44px] min-w-[44px] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#881337] ${
                activeMenu === "create" ? "bg-[#FFF1F2] dark:bg-white/10 text-[#881337] dark:text-[#FBBF24]" : ""
              }`}
              aria-label={t("appNavigation.topBar.quickCreate")}
              aria-expanded={activeMenu === "create"}
              aria-controls="quick-actions-panel"
              title={t("appNavigation.topBar.quickCreate")}
            >
              <Plus className="w-5 h-5" />
            </button>

            {activeMenu === "create" && (
              <div
                id="quick-actions-panel"
                role="group"
                aria-label={t("appNavigation.topBar.quickActions")}
                className="absolute right-0 mt-1 w-56 bg-white dark:bg-[#261E1A] border border-stone-200/90 dark:border-white/10 rounded-xl shadow-xl py-1.5 z-40 text-xs text-stone-900 dark:text-white"
              >
                <div className="px-3 py-1.5 font-bold uppercase tracking-wider text-[10px] text-stone-400 dark:text-[#A89C90]">
                  {t("appNavigation.topBar.quickActions")}
                </div>
                {isDirector ? (
                  <>
                    <Link
                      to="/school/sections"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 hover:text-[#881337] dark:hover:text-[#FBBF24] min-h-[38px]"
                    >
                      <Layers className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
                      <span>{t("appNavigation.topBar.section")}</span>
                    </Link>
                    <Link
                      to="/school/people?tab=teachers"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 hover:text-[#881337] dark:hover:text-[#FBBF24] min-h-[38px]"
                    >
                      <UserPlus className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
                      <span>{t("appNavigation.topBar.inviteTeacher")}</span>
                    </Link>
                    <Link
                      to="/school/people?tab=students"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 hover:text-[#881337] dark:hover:text-[#FBBF24] min-h-[38px]"
                    >
                      <UserPlus className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
                      <span>{t("appNavigation.topBar.inviteStudents")}</span>
                    </Link>
                  </>
                ) : isTeacher ? (
                  <>
                    <Link
                      to="/teacher/ai-tools?tool=exam_generator"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 hover:text-[#881337] dark:hover:text-[#FBBF24] min-h-[38px]"
                    >
                      <FileCheck className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
                      <span>{t("appNavigation.topBar.createExam")}</span>
                    </Link>
                    <Link
                      to="/teacher/tasks"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 hover:text-[#881337] dark:hover:text-[#FBBF24] min-h-[38px]"
                    >
                      <ListChecks className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
                      <span>{t("appNavigation.topBar.createAssignment")}</span>
                    </Link>
                    <Link
                      to="/teacher/ai-tools?tool=notes_generator"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 hover:text-[#881337] dark:hover:text-[#FBBF24] min-h-[38px]"
                    >
                      <BookOpen className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
                      <span>{t("appNavigation.topBar.createNotes")}</span>
                    </Link>
                    <Link
                      to="/teacher/ai-tools?tool=lesson_plan"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 hover:text-[#881337] dark:hover:text-[#FBBF24] min-h-[38px]"
                    >
                      <Layers className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
                      <span>{t("appNavigation.topBar.lessonPlan")}</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/student/exams"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 hover:text-[#881337] dark:hover:text-[#FBBF24] min-h-[38px]"
                    >
                      <FileCheck className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
                      <span>{t("appNavigation.topBar.takeMockTest")}</span>
                    </Link>
                    <Link
                      to="/student/practice"
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2.5 px-3 py-2 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 hover:text-[#881337] dark:hover:text-[#FBBF24] min-h-[38px]"
                    >
                      <Sparkles className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
                      <span>{t("appNavigation.topBar.practiceDrill")}</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>}

          {isStudent && <div className="relative">
            <button
              ref={(element) => { menuTriggerRefs.current.notifs = element; }}
              type="button"
              onClick={() => toggleMenu("notifs")}
              className={`relative flex items-center justify-center p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/10 min-h-[44px] min-w-[44px] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#881337] ${
                activeMenu === "notifs" ? "bg-stone-100 dark:bg-white/10 text-stone-900 dark:text-white" : ""
              }`}
              aria-label={t("appNavigation.topBar.notificationsUnread", { count: unreadCount })}
              aria-expanded={activeMenu === "notifs"}
              aria-controls="notification-center"
              title={t("appNavigation.topBar.notifications")}
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#881337] text-white text-[10px] font-mono tabular-nums font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {activeMenu === "notifs" && (
              <div
                className="absolute right-0 mt-1 w-[min(20rem,calc(100vw-1.5rem))] sm:w-96 bg-white dark:bg-[#261E1A] border border-stone-200/90 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-40 text-xs"
                id="notification-center"
                role="region"
                aria-label={t("appNavigation.topBar.notificationCenter")}
              >
                <div className="p-3 border-b border-stone-200/80 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-900 dark:text-white">{t("appNavigation.topBar.notifications")}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#FFF1F2] dark:bg-crimson-950 text-[#881337] dark:text-[#FBBF24] font-mono tabular-nums text-[10px] font-bold">
                      {t("appNavigation.topBar.newNotifications", { count: unreadCount })}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleMarkAllNotificationsRead()}
                    disabled={markingAllRead || notificationsLoading || unreadCount === 0}
                    className="text-[11px] text-[#881337] dark:text-[#FBBF24] hover:underline font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {markingAllRead ? t("appNavigation.topBar.markingAllRead") : t("appNavigation.topBar.markAllRead")}
                  </button>
                </div>

                <div className="px-3 pt-2 border-b border-[#E7E0D6] dark:border-white/10 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setNotifTab("all")}
                    className={`pb-2 border-b-2 font-medium cursor-pointer ${
                      notifTab === "all" ? "border-[#881337] text-[#881337] dark:text-[#FBBF24] dark:border-[#FBBF24]" : "border-transparent text-stone-500"
                    }`}
                  >
                    {t("appNavigation.topBar.all")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotifTab("unread")}
                    className={`pb-2 border-b-2 font-medium cursor-pointer ${
                      notifTab === "unread" ? "border-[#881337] text-[#881337] dark:text-[#FBBF24] dark:border-[#FBBF24]" : "border-transparent text-stone-500"
                    }`}
                  >
                    {t("appNavigation.topBar.unread", { count: unreadCount })}
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-stone-100">
                  {notificationsLoading ? (
                    <div className="p-8 text-center text-stone-400 dark:text-[#A89C90] text-xs">{t("appNavigation.topBar.loadingNotifications")}</div>
                  ) : notificationsFailed ? (
                    <div role="alert" className="p-8 text-center text-rose-700 dark:text-rose-300 text-xs">
                      <p>{t("appNavigation.topBar.notificationsLoadFailed")}</p>
                      <button type="button" onClick={() => setNotificationRetryCount((count) => count + 1)} className="mt-2 font-semibold underline underline-offset-2">
                        {t("appNavigation.topBar.retryNotifications")}
                      </button>
                    </div>
                  ) : displayedNotifications.length === 0 ? (
                    <div className="p-8 text-center text-stone-400 dark:text-[#A89C90] text-xs">
                      {t(notifTab === "unread" ? "appNavigation.topBar.noUnreadNotifications" : "appNavigation.topBar.noNotifications")}
                    </div>
                  ) : (
                    displayedNotifications.map((notif) => (
                      <button
                        type="button"
                        key={notif.id}
                        onClick={() => void handleOpenNotification(notif)}
                        className={`w-full p-3 text-left hover:bg-stone-50 dark:hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#881337] transition-colors flex items-start gap-2.5 ${
                          !notif.is_read ? "bg-[#FFF1F2]/60 dark:bg-[#4C0519]/30" : ""
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.is_read ? "bg-[#881337]" : "bg-transparent"}`} aria-hidden="true" />
                        <div className="flex-1 space-y-0.5">
                          <p className="text-stone-800 dark:text-stone-100 font-medium">{notif.title}</p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">{notif.body}</p>
                          <p className="text-[10px] text-stone-400 dark:text-[#A89C90]">{notif.created_at || t("appNavigation.topBar.recent")}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-[#FAF8F5] dark:bg-white/5 border-t border-[#E7E0D6] dark:border-white/10 text-center">
                  <Link
                    to={notificationDestination}
                    onClick={() => setActiveMenu(null)}
                    className="text-xs text-[#881337] hover:underline font-semibold"
                  >
                    {t(notificationDestinationLabel)}
                  </Link>
                </div>
              </div>
            )}
          </div>}

          <div className="relative">
            <button
              ref={(element) => { menuTriggerRefs.current.help = element; }}
              type="button"
              onClick={() => toggleMenu("help")}
              className={`flex items-center justify-center p-2 rounded-[8px] text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/10 min-h-[44px] min-w-[44px] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#881337] dark:focus:ring-[#FBBF24] ${
                activeMenu === "help" ? "bg-stone-100 dark:bg-white/10 text-stone-900 dark:text-white" : ""
              }`}
              aria-label={t("appNavigation.topBar.helpDocumentation")}
              aria-expanded={activeMenu === "help"}
              aria-controls="help-actions-panel"
              title={t("appNavigation.topBar.help")}
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>

            {activeMenu === "help" && (
              <div
                id="help-actions-panel"
                role="group"
                aria-label={t("appNavigation.topBar.helpSupportDesk")}
                className="absolute right-0 mt-1 w-64 bg-white dark:bg-[#261E1A] border border-stone-200/90 dark:border-white/10 rounded-xl shadow-xl py-1.5 z-40 text-xs text-stone-900 dark:text-white"
              >
                <div className="px-3 py-1.5 font-bold uppercase tracking-wider text-[10px] text-stone-400 dark:text-[#A89C90]">
                  {t("appNavigation.topBar.helpSupportDesk")}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMenu(null);
                    setHelpModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 min-h-[38px] text-start cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
                  <span>{t("appNavigation.topBar.quickHelpGuides")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMenu(null);
                    window.dispatchEvent(
                      new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true })
                    );
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 min-h-[38px] cursor-pointer"
                >
                  <Keyboard className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
                  <span>{t("appNavigation.topBar.keyboardShortcuts")}</span>
                </button>
                <Link
                  to="/contact"
                  onClick={() => setActiveMenu(null)}
                  className="flex items-center gap-2 px-3 py-2 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 min-h-[38px]"
                >
                  <Headphones className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
                  <span>{t("appNavigation.topBar.contactSupport")}</span>
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => toggleMenu("profile")}
              className={`flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 min-h-[44px] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#881337] ${
                activeMenu === "profile" ? "bg-stone-100 dark:bg-white/10" : ""
              }`}
              aria-label={t("appNavigation.topBar.profilePreferences")}
              aria-expanded={activeMenu === "profile"}
              aria-controls="profile-actions-panel"
            >
              <div className="w-7 h-7 rounded-full bg-stone-900 dark:bg-[#881337] text-white font-bold text-xs flex items-center justify-center">
                {(user?.fullName || user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 dark:text-[#A89C90] hidden sm:block" />
            </button>

            {activeMenu === "profile" && (
              <div
                id="profile-actions-panel"
                role="group"
                aria-label={t("appNavigation.topBar.profilePreferences")}
                className="absolute right-0 mt-1 w-64 bg-white dark:bg-[#261E1A] border border-stone-200/90 dark:border-white/10 rounded-xl shadow-xl py-2 z-40 text-xs text-stone-900 dark:text-white"
              >

                <div className="px-3.5 py-2.5 border-b border-stone-100 dark:border-white/10 space-y-1">
                  <p className="font-bold text-stone-900 dark:text-white truncate">
                    {user?.fullName || user?.name || roleLabel}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-[#FFF1F2] dark:bg-crimson-950/60 text-[#881337] dark:text-[#FBBF24] font-semibold text-[10px] border border-[#FECDD3] dark:border-crimson-800/60">
                      {roleLabel}
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                      {user?.school || "Finkison Academy"}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to={profileLink}
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center gap-2 px-3.5 py-2 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 min-h-[38px]"
                  >
                    <User className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
                    <span>{t(isDirector || isTeacher ? "appNavigation.items.accountSecurity" : "appNavigation.topBar.profileAccount")}</span>
                  </Link>
                  {(isDirector || currentRole === "STUDENT") && (
                    <Link
                      to={settingsLink}
                      onClick={() => setActiveMenu(null)}
                      className="flex items-center gap-2 px-3.5 py-2 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-white/5 min-h-[38px]"
                    >
                      <Settings className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
                      <span>{t("appNavigation.items.settings")}</span>
                    </Link>
                  )}
                </div>

                {import.meta.env.DEV && (
                <div className="py-1 border-t border-stone-100 dark:border-white/10">
                  <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-[#A89C90]">
                    {t("appNavigation.topBar.previewRole")}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      updateUser({ role: "PRINCIPAL" });
                      setActiveMenu(null);
                      navigate("/school");
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer min-h-[38px] ${
                      isDirector ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] font-semibold" : "text-[#261E1A] dark:text-[#FDFBF7]"
                    }`}
                  >
                    <span>{t("appNavigation.roles.schoolAdministrator")}</span>
                    {isDirector && <Check className="w-3.5 h-3.5 text-[#881337]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateUser({ role: "TEACHER", subject: user?.subject || "Biology" });
                      setActiveMenu(null);
                      navigate("/teacher");
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer min-h-[38px] ${
                      isTeacher ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] font-semibold" : "text-[#261E1A] dark:text-[#FDFBF7]"
                    }`}
                  >
                    <span>{t("appNavigation.topBar.teacherRole", { subject: teacherSubject })}</span>
                    {isTeacher && <Check className="w-3.5 h-3.5 text-[#881337]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateUser({ role: "STUDENT" });
                      setActiveMenu(null);
                      navigate("/student");
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer min-h-[38px] ${
                      currentRole === "STUDENT" ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] font-semibold" : "text-[#261E1A] dark:text-[#FDFBF7]"
                    }`}
                  >
                    <span>{t("appNavigation.roles.student")}</span>
                    {currentRole === "STUDENT" && <Check className="w-3.5 h-3.5 text-[#881337]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateUser({ role: "PARENT" });
                      setActiveMenu(null);
                      navigate("/parent");
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer min-h-[38px] ${
                      currentRole === "PARENT" ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] font-semibold" : "text-[#261E1A] dark:text-[#FDFBF7]"
                    }`}
                  >
                    <span>{t("appNavigation.topBar.parentRole")}</span>
                    {currentRole === "PARENT" && <Check className="w-3.5 h-3.5 text-[#881337]" />}
                  </button>
                </div>
                )}

                <div className="pt-1 border-t border-[#E7E0D6] dark:border-white/10">
                  <button
                    type="button"
                    onClick={async () => {
                      setActiveMenu(null);
                      try {
                        await revokeCurrentSession();
                      } catch {
                        // Clear local credentials even if the network is unavailable.
                      }
                      logout();
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 cursor-pointer min-h-[38px]"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span className="font-semibold">{t("appNavigation.topBar.signOut")}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {searchModalOpen && (
        <GlobalSearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />
      )}

      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div id="support-desk-dialog" role="dialog" aria-modal="true" aria-labelledby="support-desk-title" aria-describedby="support-desk-description" className="bg-white dark:bg-[#261E1A] rounded-2xl max-w-lg w-full p-6 space-y-5 border border-[#E7E0D6] dark:border-white/10 shadow-xl animate-fade-in text-start">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#881337]">
                  <HelpCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 id="support-desk-title" className="text-base font-bold text-[#261E1A] dark:text-[#FDFBF7]">{t("appNavigation.topBar.supportDeskTitle")}</h3>
                  <p id="support-desk-description" className="text-[11px] text-[#A89C90]">{t("appNavigation.topBar.supportDeskDescription")}</p>
                </div>
              </div>
              <button
                ref={helpCloseButtonRef}
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="text-stone-400 dark:text-[#A89C90] hover:text-stone-600 text-sm font-semibold p-1 cursor-pointer"
                aria-label={t("appNavigation.topBar.close")}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-[#A89C90]">{t("appNavigation.topBar.quickGuides")}</h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1C1512] border border-stone-200 dark:border-white/10">
                  <p className="font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{t("appNavigation.topBar.passwordControls")}</p>
                  <p className="text-[#A89C90] mt-0.5">
                    {t("appNavigation.topBar.passwordControlsDescription")}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-[#1C1512] border border-stone-200 dark:border-white/10">
                  <p className="font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{t("appNavigation.topBar.progressAutosave")}</p>
                  <p className="text-[#A89C90] mt-0.5">
                    {t("appNavigation.topBar.progressAutosaveDescription")}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 dark:border-white/10 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-[#A89C90]">{t("appNavigation.topBar.supportChannels")}</h4>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] text-xs">
                <div className="space-y-0.5">
                  <p className="font-semibold text-[#881337]">{t("appNavigation.topBar.supportEmail")}</p>
                  <a href="mailto:support@finkison.com" className="font-mono text-stone-700 underline-offset-2 hover:text-[#881337] hover:underline dark:text-[#E7E0D6] dark:hover:text-[#FBBF24]">support@finkison.com</a>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!navigator.clipboard?.writeText) return;
                    try {
                      await navigator.clipboard.writeText("support@finkison.com");
                      setCopiedSupportEmail(true);
                      setTimeout(() => setCopiedSupportEmail(false), 2000);
                    } catch {
                      setCopiedSupportEmail(false);
                    }
                  }}
                  className="px-3 py-1.5 rounded-[6px] bg-white dark:bg-[#261E1A] border border-[#BAE6FD] text-[#881337] font-semibold hover:bg-stone-50 dark:hover:bg-white/5 text-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedSupportEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{t(copiedSupportEmail ? "appNavigation.topBar.copied" : "appNavigation.topBar.copyEmail")}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 dark:bg-[#1C1512] border border-stone-200 dark:border-white/10 text-xs">
                <div>
                  <p className="font-semibold text-stone-800 dark:text-[#FDFBF7]">{t("appNavigation.topBar.supportHotline")}</p>
                  <a href="tel:+251115588080" className="block font-mono text-stone-700 underline-offset-2 hover:text-[#881337] hover:underline dark:text-[#E7E0D6] dark:hover:text-[#FBBF24]">+251 11 558 8080</a>
                  <p className="mt-1 text-stone-600 dark:text-[#E7E0D6]">{t("appNavigation.topBar.supportHours")}</p>
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
                className="text-xs text-stone-500 dark:text-[#A89C90] hover:text-stone-800 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>{t("appNavigation.topBar.keyboardShortcutHint")}</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setHelpModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-[6px] text-xs font-medium text-stone-600 dark:text-[#E7E0D6] hover:bg-stone-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  {t("appNavigation.topBar.close")}
                </button>
                <Link
                  to="/contact"
                  onClick={() => setHelpModalOpen(false)}
                  className="px-4 py-1.5 rounded-[6px] text-xs font-semibold bg-[#881337] hover:bg-[#9F1239] text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>{t("appNavigation.topBar.submitTicket")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
