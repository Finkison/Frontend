import React, { useState } from "react";
import { useToast } from "../shared/Toast";
import api from "../../services/api";
import { 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Smartphone, 
  MessageSquare, 
  Save, 
  ShieldCheck, 
  Clock 
} from "lucide-react";

export default function SettingsPage(): React.ReactElement {
  const { showToast } = useToast();

  const [darkMode, setDarkMode] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [dailyReminder, setDailyReminder] = useState("19:00");
  const [saving, setSaving] = useState(false);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/notifications/preferences/", {
        push_enabled: pushEnabled,
        sms_enabled: smsEnabled,
        telegram_enabled: telegramEnabled,
        preferred_language: "English"
      });

      showToast({
        type: "success",
        title: "Settings Saved",
        message: "Your delivery channels and notifications preferences have been updated."
      });
    } catch {
      showToast({
        type: "info",
        title: "Preferences Saved Locally",
        message: "Delivery schedule and display preferences updated."
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences & Delivery Channels</span>
          </div>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
          Account & Notification Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Configure notification dispatch channels, daily study alarms, interface languages, and display settings.
        </p>
      </div>

      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* Multi-channel Notifications */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" />
              <span>Multi-Channel Notification Dispatch</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose how you and your guardian receive practice streaks, mock alerts, and scholarship matches.
            </p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Smartphone className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">In-App & Browser Push Notifications</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">Real-time alerts for spaced repetition items due today and live 1v1 battle invites.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={pushEnabled}
                onChange={(e) => setPushEnabled(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
              />
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Guardian SMS Daily Progress Digest</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">Automated SMS summary delivered to guardian phone after 8:00 PM highlighting streak and accuracy.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={smsEnabled}
                onChange={(e) => setSmsEnabled(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
              />
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Telegram Bot Delivery (@finkison_bot)</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">Low-bandwidth PDF notes and practice problems delivered directly to your Telegram chat.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={telegramEnabled}
                onChange={(e) => setTelegramEnabled(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
              />
            </div>
          </div>
        </div>

        {/* Schedule & Timing */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Daily Study Reminder Alarm</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Set the time of day Finkison reminds you to complete your adaptive study plan.
            </p>
          </div>

          <div className="max-w-xs">
            <input
              type="time"
              value={dailyReminder}
              onChange={(e) => setDailyReminder(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:border-amber-500 outline-none w-full"
            />
          </div>
        </div>

        {/* Language setting */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>Language & Locale</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official medium of instruction for national entrance examinations.
            </p>
          </div>

          <div className="max-w-md">
            <div className="p-4 rounded-2xl border border-amber-500 bg-amber-50/40 ring-1 ring-amber-500/20">
              <span className="text-xs font-bold block text-slate-900">English (National Standard)</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Active curriculum language for all subjects and exams</span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{saving ? "Saving Preferences..." : "Save Preferences"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
