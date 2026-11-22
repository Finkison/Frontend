import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, Clock, MessageSquare, Search, Send, UserRound } from "lucide-react";
import { getSchoolMessages, replySchoolMessage } from "../../services/schoolService";
import { useToast } from "../ui/Toast";
import PortalPage from "../shared/PortalPage";

type ParentInquiry = {
  id: string;
  sender_name?: string;
  recipient_role?: string;
  student_name?: string;
  student_id?: string;
  student_grade?: string;
  student_section?: string;
  subject?: string;
  content?: string;
  created_at?: string;
};

export default function TeacherMessagesView(): React.ReactElement {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ParentInquiry[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [sentMessageId, setSentMessageId] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    getSchoolMessages()
      .then((response) => {
        if (!isCurrent) return;
        const data = Array.isArray(response.data) ? response.data : response.data?.messages || [];
        const inquiries = Array.isArray(data) ? data : [];
        setMessages(inquiries);
        setSelectedMessageId(inquiries[0]?.id || "");
      })
      .catch(() => {
        if (isCurrent) setMessagesError(true);
      })
      .finally(() => {
        if (isCurrent) setMessagesLoading(false);
      });
    return () => { isCurrent = false; };
  }, []);

  const visibleMessages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return messages;
    return messages.filter((message) => [message.sender_name, message.student_name, message.subject, message.content, message.student_section]
      .some((value) => String(value || "").toLowerCase().includes(query)));
  }, [messages, searchQuery]);

  const selectedMessage = visibleMessages.find((message) => String(message.id) === String(selectedMessageId)) || visibleMessages[0] || null;

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;
    setSending(true);
    setSentMessageId(null);
    try {
      const response = await replySchoolMessage({ message_id: String(selectedMessage.id), reply_content: replyText.trim() });
      if (response.data?.success === false) throw new Error(response.data?.error || "The reply could not be sent.");
      setSentMessageId(String(selectedMessage.id));
      setReplyText("");
      showToast({ title: "Reply sent", message: response.data?.message || "The response was delivered to the parent.", type: "success" });
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.response?.data?.message || err?.message || "The reply could not be sent. Try again.";
      showToast({ title: "Reply failed", message, type: "error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <PortalPage className="max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 border-b border-[#E7E0D6] pb-5 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#881337] dark:text-[#FBBF24]"><MessageSquare className="h-4 w-4" aria-hidden="true" />School communication</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-[#FDFBF7]">Parent messages</h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-[#E7E0D6]">Review parent inquiries and send a response.</p>
        </div>
        {!messagesLoading && !messagesError && <p className="text-xs text-stone-500 dark:text-[#A89C90]">{messages.length} recent message{messages.length === 1 ? "" : "s"}</p>}
      </header>

      <div className="flex gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-xs leading-5 text-sky-950 dark:border-sky-900/40 dark:bg-sky-950/20 dark:text-sky-100">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>Replies are delivered to the parent as alerts.</p>
      </div>

      {messagesLoading ? (
        <div role="status" className="rounded-2xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90]">Loading parent messages...</div>
      ) : messagesError ? (
        <section role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
          <p className="text-sm text-rose-800 dark:text-rose-200">Parent messages could not be loaded. Refresh the page and try again.</p>
        </section>
      ) : messages.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center dark:border-white/15 dark:bg-[#261E1A]">
          <UserRound className="mx-auto h-9 w-9 text-stone-300 dark:text-stone-600" aria-hidden="true" />
          <h2 className="mt-3 text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">No parent messages yet</h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-[#A89C90]">New inquiries will appear here when a parent contacts the school.</p>
        </section>
      ) : (
        <section className="grid min-h-[34rem] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs dark:border-white/10 dark:bg-[#261E1A] md:grid-cols-[18rem_minmax(0,1fr)]" aria-label="Parent message inbox">
          <aside className="flex min-h-64 flex-col border-b border-stone-200 dark:border-white/10 md:border-b-0 md:border-r" aria-label="Message list">
            <div className="border-b border-stone-200 bg-[#FAF8F5] p-3 dark:border-white/10 dark:bg-[#1C1512]">
              <label htmlFor="parent-message-search" className="sr-only">Search parent messages</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-[#A89C90]" aria-hidden="true" />
                <input id="parent-message-search" type="search" placeholder="Search messages" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white pl-9 pr-3 text-sm text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#FDFBF7]" />
              </div>
            </div>
            <div className="max-h-80 flex-1 divide-y divide-stone-100 overflow-y-auto dark:divide-white/10 md:max-h-none">
              {visibleMessages.length === 0 ? <p className="p-5 text-sm text-stone-500 dark:text-[#A89C90]">No messages match your search.</p> : visibleMessages.map((message) => {
                const active = String(message.id) === String(selectedMessage?.id);
                return (
                  <button key={message.id} type="button" onClick={() => { setSelectedMessageId(String(message.id)); setSentMessageId(null); }} aria-current={active ? "true" : undefined} className={`w-full p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#881337] ${active ? "bg-[#FFF1F2] dark:bg-[#4C0519]/40" : "hover:bg-[#FAF8F5] dark:hover:bg-white/5"}`}>
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{message.sender_name || "Parent"}</span>
                      {message.created_at && <span className="shrink-0 text-[10px] text-stone-500 dark:text-[#A89C90]">{message.created_at}</span>}
                    </span>
                    <span className="mt-1 block truncate text-xs font-medium text-[#881337] dark:text-[#FBBF24]">{message.subject || "No subject"}</span>
                    <span className="mt-1 block truncate text-xs text-stone-600 dark:text-[#A89C90]">{message.student_name || "Linked student"}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {selectedMessage ? (
            <article className="flex min-w-0 flex-col p-5 sm:p-6" aria-labelledby="selected-message-subject">
              <header className="border-b border-stone-200 pb-4 dark:border-white/10">
                <h2 id="selected-message-subject" className="text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{selectedMessage.subject || "Parent inquiry"}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-[#A89C90]">
                  <span>From {selectedMessage.sender_name || "Parent"}</span>
                  {selectedMessage.student_name && <span>Student: {selectedMessage.student_name}</span>}
                  {(selectedMessage.student_grade || selectedMessage.student_section) && <span>{[selectedMessage.student_grade, selectedMessage.student_section ? `Section ${selectedMessage.student_section}` : ""].filter(Boolean).join(" · ")}</span>}
                  {selectedMessage.created_at && <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{selectedMessage.created_at}</span>}
                </div>
              </header>

              <div className="flex-1 py-6">
                <p className="whitespace-pre-wrap text-sm leading-7 text-stone-800 dark:text-[#E7E0D6]">{selectedMessage.content || "No message content was provided."}</p>
                {sentMessageId === String(selectedMessage.id) && <p role="status" className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-100">Your response was sent to the parent.</p>}
              </div>

              <form onSubmit={handleSend} className="space-y-3 border-t border-stone-200 pt-4 dark:border-white/10">
                <label htmlFor="parent-message-reply" className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Reply to parent</label>
                <textarea id="parent-message-reply" value={replyText} onChange={(event) => setReplyText(event.target.value)} rows={4} maxLength={4000} required placeholder="Write a clear, helpful response..." className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/10 dark:bg-[#1C1512] dark:text-[#FDFBF7]" />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-stone-500 dark:text-[#A89C90]">{replyText.length}/4000</span>
                  <button type="submit" disabled={sending || !replyText.trim()} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#9F1239] focus:outline-none focus:ring-2 focus:ring-[#881337] disabled:cursor-wait disabled:opacity-60"><Send className="h-4 w-4" aria-hidden="true" />{sending ? "Sending..." : "Send reply"}</button>
                </div>
              </form>
            </article>
          ) : (
            <div className="flex items-center justify-center p-8 text-sm text-stone-500 dark:text-[#A89C90]">Select a message to read it.</div>
          )}
        </section>
      )}
    </PortalPage>
  );
}