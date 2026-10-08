import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import notificationService from "../../services/notificationService";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  GraduationCap, 
  Flame, 
  Brain,
  FileCheck2,
  Settings,
  ChevronRight,
  X,
  ExternalLink 
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  notif_type?: string;
  action_url?: string;
  icon?: string;
  is_read?: boolean;
  created_at?: string;
}

export default function NotificationCenter(): React.ReactElement {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.list();
      const list = res?.notifications || [
        {
          id: "n-1",
          title: "National Mock Exam Ready",
          body: "2026 EUEE Model Exam #4 is now calibrated for your stream.",
          notif_type: "exam",
          action_url: "/student/exams",
          is_read: false,
          created_at: "10 mins ago"
        },
        {
          id: "n-2",
          title: "Chemistry Concept Due for Review",
          body: "Spaced repetition drill for Electrochemistry is due today.",
          notif_type: "review",
          action_url: "/student/spaced-review",
          is_read: false,
          created_at: "2 hours ago"
        },
        {
          id: "n-3",
          title: "14-Day Streak Milestone Achieved!",
          body: "You earned 150 bonus XP points for your study consistency.",
          notif_type: "streak",
          action_url: "/student/achievements",
          is_read: true,
          created_at: "1 day ago"
        }
      ];
      setNotifications(list);
      setUnreadCount(list.filter((n: any) => !n.is_read).length);
    } catch {
      setNotifications([
        {
          id: "n-1",
          title: "National Mock Exam Ready",
          body: "2026 EUEE Model Exam #4 is now ready for your stream.",
          notif_type: "exam",
          action_url: "/student/exams",
          is_read: false,
          created_at: "Just now"
        }
      ]);
      setUnreadCount(1);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.markRead(id);
    } catch {
      // ignore
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
    } catch {
      // ignore
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleClickItem = (n: NotificationItem) => {
    if (!n.is_read) {
      handleMarkAsRead(n.id, { stopPropagation: () => {} } as any);
    }
    setIsOpen(false);
    if (n.action_url) {
      navigate(n.action_url);
    }
  };

  const renderNotifBadge = (type?: string) => {
    switch (type) {
      case "exam":
        return (
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
            <GraduationCap className="w-4 h-4" />
          </div>
        );
      case "review":
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <Brain className="w-4 h-4" />
          </div>
        );
      case "streak":
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <Flame className="w-4 h-4" />
          </div>
        );
      case "alert":
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all cursor-pointer ${
          isOpen
            ? "bg-slate-100 text-slate-900 shadow-2xs ring-2 ring-slate-900/10"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }`}
        aria-label="View Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-slate-950 shadow-2xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2.5 w-[360px] sm:w-[400px] rounded-2xl bg-white/98 backdrop-blur-2xl border border-slate-200/90 shadow-[0_24px_50px_-12px_rgba(15,23,42,0.18),0_4px_16px_rgba(15,23,42,0.06)] p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          role="menu"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900">Notifications</span>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200/60">
                  {unreadCount} unread
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                  Up to date
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-[340px] overflow-y-auto space-y-1.5 py-2">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleClickItem(n)}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-start gap-3 group border ${
                    n.is_read
                      ? "bg-white hover:bg-slate-50 border-transparent hover:border-slate-100"
                      : "bg-amber-50/50 border-amber-200/70 hover:bg-amber-50/80"
                  }`}
                >
                  {renderNotifBadge(n.notif_type)}

                  <div className="flex-1 min-w-0 text-xs">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-amber-950">
                        {n.title}
                      </h4>
                      {!n.is_read && (
                        <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">
                      {n.body}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{n.created_at || "Recent"}</span>
                      </span>
                      {!n.is_read && (
                        <button
                          type="button"
                          onClick={(e) => handleMarkAsRead(n.id, e)}
                          className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer transition-colors"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Bar */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate("/student/settings");
              }}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Channel Preferences</span>
            </button>
            <span className="text-[10px] text-slate-400 font-medium">Real-time sync</span>
          </div>
        </div>
      )}
    </div>
  );
}
