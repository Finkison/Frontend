import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Send, UserPlus } from "lucide-react";
import { getChildren, getParentMessages, messageTeacher } from "../../services/parentService";
import { getApiErrorMessage } from "../../services/api";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import { useI18n } from "../../i18n";

interface LinkedStudent {
  id: string;
  name?: string;
  full_name?: string;
  user__full_name?: string;
}

interface ParentInquiry {
  id: string;
  subject: string;
  content: string;
  student_id: string;
  student_name: string;
  created_at: string;
}

const topicKeys: Record<string, string> = {
  "Academic progress": "academicProgress",
  Attendance: "attendance",
  Assessment: "assessment",
  Other: "other",
};

function toRecords(value: unknown): ParentInquiry[] {
  if (Array.isArray(value)) return value as ParentInquiry[];
  if (value && typeof value === "object") {
    const payload = value as { messages?: unknown; results?: unknown; data?: unknown };
    if (Array.isArray(payload.messages)) return payload.messages as ParentInquiry[];
    if (Array.isArray(payload.results)) return payload.results as ParentInquiry[];
    if (Array.isArray(payload.data)) return payload.data as ParentInquiry[];
  }
  return [];
}

function formatMessageTime(value: string, language: string): string {
  const parsed = new Date(value.replace(" • ", " "));
  const locale = language === "am" ? "am-ET" : language === "om" ? "om-ET" : "en-ET";
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });
}

export default function TeacherMessaging(): React.ReactElement {
  const { t, language } = useI18n();
  const [students, setStudents] = useState<LinkedStudent[]>([]);
  const [inquiries, setInquiries] = useState<ParentInquiry[]>([]);
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("Academic progress");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const loadMessaging = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [childrenResponse, messagesResponse] = await Promise.all([getChildren(), getParentMessages()]);
      const linked = Array.isArray(childrenResponse.data)
        ? childrenResponse.data.map((child) => ({ ...child, id: String(child.id) }))
        : [];
      setStudents(linked);
      setStudentId((current) => linked.some((student: LinkedStudent) => student.id === current) ? current : linked[0]?.id || "");
      setInquiries(toRecords(messagesResponse.data));
    } catch {
      setLoadError(t("parentMessaging.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { void loadMessaging(); }, [loadMessaging]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!studentId || !message.trim() || sending) return;

    setSending(true);
    setError("");
    setSent(false);
    try {
      const response = await messageTeacher({
        child_id: studentId,
        teacherRole: "School",
        subject,
        message: message.trim(),
      });
      if (response.data?.success === false) {
        throw new Error(t("parentMessaging.sendError"));
      }

      setMessage("");
      setSent(true);
      try {
        const updated = await getParentMessages();
        setInquiries(toRecords(updated.data));
      } catch {
        // The sent confirmation remains valid if refreshing the message list fails.
      }
    } catch (err: any) {
      setError(getApiErrorMessage(err) || t("parentMessaging.sendError"));
    } finally {
      setSending(false);
    }
  };

  const visibleInquiries = inquiries.filter((inquiry) => inquiry.student_id === studentId);

  return (
    <PortalPage className="max-w-3xl space-y-6">
      <PageHeader
        eyebrow={t("parentMessaging.eyebrow")}
        title={t("parentMessaging.title")}
        description={t("parentMessaging.description")}
        secondaryActions={[{ label: t("parentMessaging.backToDashboard"), href: "/parent", icon: ArrowLeft }]}
      />

      <section className="space-y-5 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#261E1A] p-6 shadow-xs sm:p-8">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-[#FDFBF7]">{t("parentMessaging.contactSchool")}</h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-[#E7E0D6]">{t("parentMessaging.contactDescription")}</p>
        </div>

        {loading ? (
          <p role="status" className="py-6 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("parentMessaging.loadingStudents")}</p>
        ) : loadError ? (
          <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-5 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
            <AlertCircle className="mx-auto h-5 w-5 text-red-700 dark:text-rose-200" aria-hidden="true" />
            <p role="alert" className="text-sm text-red-800 dark:text-rose-200">{loadError}</p>
            <button type="button" onClick={() => void loadMessaging()} className="min-h-[44px] rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-900 hover:bg-red-100 dark:border-rose-800 dark:text-rose-100 dark:hover:bg-rose-950/40">{t("parentMessaging.tryAgain")}</button>
          </div>
        ) : students.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 dark:border-white/20 bg-stone-50 dark:bg-[#1C1512] p-6 text-center">
            <UserPlus className="mx-auto h-8 w-8 text-stone-400 dark:text-[#A89C90]" aria-hidden="true" />
            <h2 className="mt-3 text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("parentMessaging.linkStudentFirst")}</h2>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-stone-600 dark:text-[#E7E0D6]">
              {t("parentMessaging.linkStudentDescription")}
            </p>
            <Link to="/parent" className="mt-4 inline-flex min-h-[44px] items-center rounded-lg bg-[#881337] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9F1239]">
              {t("parentMessaging.goToDashboard")}
            </Link>
          </div>
        ) : (
          <>
            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">{error}</p>}
            {sent && <p role="status" aria-live="polite" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200">{t("parentMessaging.sentConfirmation")}</p>}

            <form onSubmit={handleSend} aria-busy={sending} className="space-y-4">
              <div>
                <label htmlFor="message-student" className="mb-1.5 block text-xs font-semibold text-stone-800 dark:text-[#FDFBF7]">{t("parentMessaging.student")}</label>
                <select id="message-student" required value={studentId} onChange={(event) => setStudentId(event.target.value)} disabled={students.length === 1} className="min-h-[44px] w-full rounded-lg border border-stone-300 dark:border-white/20 bg-white dark:bg-[#261E1A] px-3 text-sm text-stone-900 dark:text-[#FDFBF7] focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 disabled:bg-stone-50">
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>{student.user__full_name || student.full_name || student.name || t("parentMessaging.studentFallback")}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message-subject" className="mb-1.5 block text-xs font-semibold text-stone-800 dark:text-[#FDFBF7]">{t("parentMessaging.topic")}</label>
                <select id="message-subject" value={subject} onChange={(event) => setSubject(event.target.value)} className="min-h-[44px] w-full rounded-lg border border-stone-300 dark:border-white/20 bg-white dark:bg-[#261E1A] px-3 text-sm text-stone-900 dark:text-[#FDFBF7] focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20">
                  <option value="Academic progress">{t("parentMessaging.topics.academicProgress")}</option>
                  <option value="Attendance">{t("parentMessaging.topics.attendance")}</option>
                  <option value="Assessment">{t("parentMessaging.topics.assessment")}</option>
                  <option value="Other">{t("parentMessaging.topics.other")}</option>
                </select>
              </div>

              <div>
                <label htmlFor="school-message" className="mb-1.5 block text-xs font-semibold text-stone-800 dark:text-[#FDFBF7]">{t("parentMessaging.message")}</label>
                <textarea id="school-message" required maxLength={1000} rows={5} value={message} onChange={(event) => setMessage(event.target.value)} aria-describedby="school-message-count" placeholder={t("parentMessaging.messagePlaceholder")} className="w-full resize-y rounded-lg border border-stone-300 dark:border-white/20 px-3 py-2.5 text-sm text-stone-900 dark:text-[#FDFBF7] focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20" />
                <p id="school-message-count" className="mt-1 text-right text-xs tabular-nums text-stone-500 dark:text-[#A89C90]">{t("parentMessaging.characterCount", { count: message.length, max: 1000 })}</p>
              </div>

              <button type="submit" disabled={sending || !message.trim()} className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#881337] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9F1239] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                <span>{sending ? t("parentMessaging.sending") : t("parentMessaging.sendToSchool")}</span>
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </>
        )}
      </section>

      {visibleInquiries.length > 0 && (
        <section className="space-y-4 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#261E1A] p-6 shadow-xs sm:p-8">
          <div>
            <h2 className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("parentMessaging.sentMessages")}</h2>
            <p className="mt-1 text-xs text-stone-600 dark:text-[#E7E0D6]">{t("parentMessaging.repliesDelivered")} <Link to="/parent/alerts" className="font-semibold text-[#881337] underline-offset-2 hover:underline dark:text-[#FBBF24]">{t("parentMessaging.openAlerts")}</Link></p>
          </div>
          <ul className="space-y-3">
            {visibleInquiries.map((inquiry) => (
              <li key={inquiry.id} className="rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1C1512] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{topicKeys[inquiry.subject] ? t(`parentMessaging.topics.${topicKeys[inquiry.subject]}`) : inquiry.subject}</h3>
                  <time dateTime={inquiry.created_at} className="text-xs text-stone-500 dark:text-[#A89C90]">{formatMessageTime(inquiry.created_at, language)}</time>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-700 dark:text-[#E7E0D6]">{inquiry.content}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PortalPage>
  );
}
