import React, { useEffect, useState } from "react";
import { AlertCircle, Bell, MessageSquare, Send, Users } from "lucide-react";
import { broadcastAnnouncement, getSchoolMessages, replySchoolMessage } from "../../services/schoolService";
import { useToast } from "../ui/Toast";
import { Modal } from "../ui/Modal";
import PageHeader from "../shared/PageHeader";
import { useI18n } from "../../i18n";
import PortalPage from "../shared/PortalPage";

interface SchoolMessage {
  id: string | number;
  sender_name?: string;
  student_name?: string | null;
  student_grade?: string | null;
  subject?: string;
  content?: string;
  created_at?: string;
  date?: string;
}

interface BroadcastForm {
  title: string;
  message: string;
  target_grade: string;
  alert_type: string;
}

const emptyBroadcast: BroadcastForm = {
  title: "",
  message: "",
  target_grade: "all",
  alert_type: "announcement",
};

export default function SchoolMessagesView(): React.ReactElement {
  const { showToast } = useToast();
  const { t, language } = useI18n();
  const [messages, setMessages] = useState<SchoolMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<SchoolMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState<BroadcastForm>(emptyBroadcast);
  const [broadcasting, setBroadcasting] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await getSchoolMessages();
      const list = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.messages)
          ? response.data.messages
          : [];
      setMessages(list);
      setSelectedMessage((current) => {
        if (current) return list.find((message: SchoolMessage) => String(message.id) === String(current.id)) || list[0] || null;
        return list[0] || null;
      });
    } catch {
      setMessages([]);
      setSelectedMessage(null);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMessages();
  }, []);

  const formatMessageDate = (message: SchoolMessage) => {
    const rawDate = message.created_at || message.date;
    if (!rawDate) return t("schoolMessages.dateUnavailable");
    const parsedDate = new Date(rawDate);
    if (Number.isNaN(parsedDate.getTime())) return rawDate;
    const locale = language === "am" ? "am-ET" : language === "om" ? "om-ET" : "en-ET";
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(parsedDate);
  };

  const handleSendReply = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!replyText.trim() || !selectedMessage || sendingReply) return;
    setSendingReply(true);
    try {
      await replySchoolMessage({
        message_id: String(selectedMessage.id),
        reply_content: replyText.trim(),
      });
      showToast({
        title: t("schoolMessages.replySentTitle"),
        message: t("schoolMessages.replySentMessage"),
        type: "success",
      });
      setReplyText("");
    } catch {
      showToast({
        title: t("schoolMessages.replyErrorTitle"),
        message: t("schoolMessages.replyErrorMessage"),
        type: "error",
      });
    } finally {
      setSendingReply(false);
    }
  };

  const handleBroadcast = async (event: React.FormEvent) => {
    event.preventDefault();
    if (broadcasting) return;
    setBroadcasting(true);
    try {
      const response = await broadcastAnnouncement({
        ...broadcastForm,
        title: broadcastForm.title.trim(),
        message: broadcastForm.message.trim(),
      });
      const recipientsCount = Number(response.data?.recipients_count ?? 0);
      if (recipientsCount < 1) {
        showToast({
          title: t("schoolMessages.noRecipientsTitle"),
          message: t("schoolMessages.noRecipientsMessage"),
          type: "warning",
        });
        return;
      }
      showToast({
        title: t("schoolMessages.announcementSentTitle"),
        message: t("schoolMessages.announcementSentMessage", { count: recipientsCount }),
        type: "success",
      });
      setShowBroadcastModal(false);
      setBroadcastForm(emptyBroadcast);
    } catch {
      showToast({
        title: t("schoolMessages.announcementErrorTitle"),
        message: t("schoolMessages.announcementErrorMessage"),
        type: "error",
      });
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <PortalPage className="max-w-6xl space-y-6">
      <PageHeader
        title={t("schoolMessages.title")}
        description={t("schoolMessages.description")}
        primaryAction={{
          label: t("schoolMessages.newAnnouncement"),
          onClick: () => setShowBroadcastModal(true),
          icon: Bell,
        }}
      />

      {loadError ? (
        <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-100 sm:flex-row sm:items-center">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="flex-1">{t("schoolMessages.loadError")}</p>
          <button type="button" onClick={() => void fetchMessages()} className="min-h-10 rounded-lg border border-current px-3 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337]">
            {t("schoolMessages.retry")}
          </button>
        </div>
      ) : loading ? (
        <div role="status" className="rounded-xl border border-[#E7E0D6] bg-white p-10 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90]">
          {t("schoolMessages.loading")}
        </div>
      ) : messages.length === 0 ? (
        <section className="rounded-xl border border-dashed border-[#D5CBC0] bg-white p-10 text-center dark:border-white/15 dark:bg-[#261E1A]">
          <MessageSquare className="mx-auto h-8 w-8 text-stone-400" aria-hidden="true" />
          <h2 className="mt-3 text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("schoolMessages.emptyTitle")}</h2>
          <p className="mx-auto mt-1 max-w-lg text-sm leading-6 text-stone-600 dark:text-[#A89C90]">{t("schoolMessages.emptyDescription")}</p>
        </section>
      ) : (
        <section aria-label={t("schoolMessages.inboxLabel")} className="grid min-h-[520px] grid-cols-1 overflow-hidden rounded-2xl border border-[#E7E0D6] bg-white dark:border-white/10 dark:bg-[#261E1A] md:grid-cols-3">
          <div className="flex min-h-60 flex-col border-b border-[#E7E0D6] dark:border-white/10 md:border-b-0 md:border-r">
            <h2 className="border-b border-[#E7E0D6] bg-[#FAF8F5] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-stone-600 dark:border-white/10 dark:bg-[#1C1512] dark:text-[#A89C90]">
              {t("schoolMessages.familyInquiries", { count: messages.length })}
            </h2>
            <div className="flex-1 divide-y divide-[#E7E0D6] overflow-y-auto dark:divide-white/10">
              {messages.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  aria-pressed={String(selectedMessage?.id) === String(message.id)}
                  onClick={() => setSelectedMessage(message)}
                  className={`w-full p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#881337] dark:focus-visible:ring-[#FBBF24] ${
                    String(selectedMessage?.id) === String(message.id)
                      ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40"
                      : "hover:bg-stone-50 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="block truncate text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{message.sender_name || t("schoolMessages.parentFallback")}</span>
                  <span className="mt-1 block truncate text-sm text-stone-700 dark:text-[#E7E0D6]">{message.subject || t("schoolMessages.noSubject")}</span>
                  {message.student_name && <span className="mt-1 block truncate text-xs text-stone-500 dark:text-[#A89C90]">{t("schoolMessages.aboutStudent", { name: message.student_name })}{message.student_grade ? ` · ${message.student_grade}` : ""}</span>}
                  <time className="mt-2 block text-xs text-stone-500 dark:text-[#A89C90]">{formatMessageDate(message)}</time>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col p-4 sm:p-6 md:col-span-2">
            {selectedMessage ? (
              <>
                <div className="border-b border-[#E7E0D6] pb-4 dark:border-white/10">
                  <h2 className="text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{selectedMessage.subject || t("schoolMessages.noSubject")}</h2>
                  <p className="mt-1 text-sm text-stone-600 dark:text-[#A89C90]">
                    {t("schoolMessages.fromParent", { name: selectedMessage.sender_name || t("schoolMessages.parentFallback") })}
                    {selectedMessage.student_name ? ` · ${t("schoolMessages.studentContext", { name: selectedMessage.student_name })}` : ""}
                  </p>
                  <time className="mt-1 block text-xs text-stone-500 dark:text-[#A89C90]">{formatMessageDate(selectedMessage)}</time>
                </div>

                <div className="mt-4 flex-1 rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] p-4 text-sm leading-6 text-stone-800 dark:border-white/10 dark:bg-[#1C1512] dark:text-[#FDFBF7]">
                  {selectedMessage.content || t("schoolMessages.emptyMessage")}
                </div>

                <form onSubmit={(event) => void handleSendReply(event)} className="mt-5 space-y-3 border-t border-[#E7E0D6] pt-4 dark:border-white/10">
                  <label htmlFor="school-message-reply" className="block text-sm font-semibold text-stone-800 dark:text-[#FDFBF7]">{t("schoolMessages.replyLabel")}</label>
                  <textarea
                    id="school-message-reply"
                    rows={3}
                    required
                    maxLength={1000}
                    placeholder={t("schoolMessages.replyPlaceholder")}
                    value={replyText}
                    onChange={(event) => setReplyText(event.target.value)}
                    aria-describedby="school-message-reply-hint"
                    className="w-full resize-y rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]"
                  />
                  <p id="school-message-reply-hint" className="text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t("schoolMessages.replyDeliveryHint")}</p>
                  <div className="flex justify-end">
                    <button type="submit" disabled={!replyText.trim() || sendingReply} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#9F1239] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#FBBF24] dark:text-[#1C1512]">
                      <Send className="h-4 w-4" aria-hidden="true" />
                      {sendingReply ? t("schoolMessages.sendingReply") : t("schoolMessages.sendReply")}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center text-sm text-stone-500 dark:text-[#A89C90]">
                <Users className="h-8 w-8 text-stone-300 dark:text-stone-600" aria-hidden="true" />
                <p className="mt-3">{t("schoolMessages.selectThread")}</p>
              </div>
            )}
          </div>
        </section>
      )}

      <Modal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        title={t("schoolMessages.broadcastTitle")}
        description={t("schoolMessages.broadcastDescription")}
        maxWidth="md"
        footer={(
          <>
            <button type="button" onClick={() => setShowBroadcastModal(false)} className="min-h-10 rounded-lg border border-stone-300 px-4 text-sm font-semibold text-stone-700 dark:border-white/15 dark:text-[#E7E0D6]">
              {t("schoolMessages.cancel")}
            </button>
            <button type="submit" form="school-announcement-form" disabled={broadcasting} className="min-h-10 rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white hover:bg-[#9F1239] disabled:opacity-50 dark:bg-[#FBBF24] dark:text-[#1C1512]">
              {broadcasting ? t("schoolMessages.broadcasting") : t("schoolMessages.sendAnnouncement")}
            </button>
          </>
        )}
      >
        <form id="school-announcement-form" onSubmit={(event) => void handleBroadcast(event)} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-stone-800 dark:text-[#FDFBF7]">{t("schoolMessages.announcementTitleLabel")}</span>
            <input required maxLength={120} value={broadcastForm.title} onChange={(event) => setBroadcastForm((current) => ({ ...current, title: event.target.value }))} placeholder={t("schoolMessages.titlePlaceholder")} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-stone-800 dark:text-[#FDFBF7]">{t("schoolMessages.audienceLabel")}</span>
            <select value={broadcastForm.target_grade} onChange={(event) => setBroadcastForm((current) => ({ ...current, target_grade: event.target.value }))} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]">
              <option value="all">{t("schoolMessages.allEnrolledStudents")}</option>
              {[9, 10, 11, 12].map((grade) => <option key={grade} value={`Grade ${grade}`}>{t("schoolMessages.gradeStudents", { grade })}</option>)}
            </select>
            <span className="block text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t("schoolMessages.audienceHint")}</span>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-stone-800 dark:text-[#FDFBF7]">{t("schoolMessages.messageLabel")}</span>
            <textarea required maxLength={2000} rows={5} value={broadcastForm.message} onChange={(event) => setBroadcastForm((current) => ({ ...current, message: event.target.value }))} placeholder={t("schoolMessages.messagePlaceholder")} className="w-full resize-y rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" />
          </label>
        </form>
      </Modal>
    </PortalPage>
  );
}
