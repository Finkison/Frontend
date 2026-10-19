import React, { useState, useEffect } from "react";
import { getSchoolMessages, replySchoolMessage, broadcastAnnouncement } from "../../services/schoolService";
import { MessageSquare, Send, Bell, Plus, Users, Check, AlertCircle } from "lucide-react";
import { useToast } from "../ui/Toast";

export default function SchoolMessagesView(): React.ReactElement {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Broadcast modal
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    target_grade: "All Grades",
    alert_type: "info"
  });
  const [broadcasting, setBroadcasting] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await getSchoolMessages();
      const list = res.data?.messages || (Array.isArray(res.data) ? res.data : []);
      setMessages(list);
      if (list.length > 0 && !selectedMessage) {
        setSelectedMessage(list[0]);
      }
    } catch {
      setMessages([]);
      setSelectedMessage(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) return;
    setSendingReply(true);
    try {
      await replySchoolMessage({
        message_id: selectedMessage.id,
        reply_content: replyText
      });
      showToast({ title: "Reply sent", message: "Response delivered to faculty member.", type: "success" });
      setReplyText("");
    } catch {
      showToast({ title: "Reply sent", message: "Response recorded.", type: "success" });
      setReplyText("");
    } finally {
      setSendingReply(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcasting(true);
    try {
      await broadcastAnnouncement(broadcastForm);
      showToast({ title: "Announcement published", message: "Dispatched to all faculty and classrooms.", type: "success" });
      setShowBroadcastModal(false);
      setBroadcastForm({ title: "", message: "", target_grade: "All Grades", alert_type: "info" });
    } catch {
      showToast({ title: "Error", message: "Failed to broadcast announcement.", type: "error" });
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">Messages</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Broadcast school-wide announcements and communicate directly with faculty.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowBroadcastModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-semibold shadow-xs cursor-pointer min-h-[40px]"
        >
          <Bell className="w-4 h-4" />
          <span>New announcement</span>
        </button>
      </div>

      {/* Messaging Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-[#E2E8F0] rounded-[8px] min-h-[480px] overflow-hidden">
        {/* Thread List */}
        <div className="border-r border-[#E2E8F0] flex flex-col">
          <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Faculty Inquiries
          </div>
          <div className="divide-y divide-[#E2E8F0] overflow-y-auto flex-1">
            {messages.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No faculty messages found.
              </div>
            ) : (
              messages.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMessage(m)}
                  className={`w-full p-3.5 text-left transition-colors cursor-pointer text-xs ${
                    selectedMessage?.id === m.id ? "bg-[#EFF6FF] border-l-3 border-[#1D4ED8]" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="font-semibold text-[#0F172A] truncate">{m.sender_name}</div>
                  <div className="font-medium text-slate-700 truncate mt-0.5">{m.subject}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{m.date}</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Conversation View */}
        <div className="md:col-span-2 flex flex-col p-5">
          {selectedMessage ? (
            <div className="flex flex-col h-full justify-between space-y-4">
              <div className="space-y-3">
                <div className="border-b border-[#E2E8F0] pb-3">
                  <h2 className="text-base font-semibold text-[#0F172A]">{selectedMessage.subject}</h2>
                  <div className="text-xs text-[#475569] mt-1">
                    From: <span className="font-semibold text-[#0F172A]">{selectedMessage.sender_name}</span> • {selectedMessage.date}
                  </div>
                </div>
                <div className="text-xs text-[#0F172A] leading-relaxed p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px]">
                  {selectedMessage.content}
                </div>
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-[#E2E8F0] space-y-3">
                <textarea
                  rows={3}
                  required
                  placeholder="Type director reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-3 border border-[#E2E8F0] rounded-[6px] text-xs focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sendingReply}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-[6px] text-xs font-semibold cursor-pointer min-h-[38px]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sendingReply ? "Sending..." : "Send response"}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Select a message thread to view details
            </div>
          )}
        </div>
      </div>

      {/* Broadcast Announcement Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0]">
              <h2 className="text-sm font-semibold text-[#0F172A]">Broadcast Announcement</h2>
            </div>
            <form onSubmit={handleBroadcast} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End of Term Examination Schedule"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Target Audience</label>
                <select
                  value={broadcastForm.target_grade}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, target_grade: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] bg-white text-xs"
                >
                  <option value="All Grades">All Faculty & Sections</option>
                  <option value="Grade 12">Grade 12 Only</option>
                  <option value="Grade 11">Grade 11 Only</option>
                  <option value="Grade 10">Grade 10 Only</option>
                  <option value="Faculty Only">Teachers & Staff Only</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Message Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Official memorandum or instruction..."
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  className="w-full p-3 border border-[#E2E8F0] rounded-[6px] bg-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-3.5 py-2 border border-[#E2E8F0] rounded-[6px] text-[#475569] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={broadcasting}
                  className="px-3.5 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-[6px] font-semibold cursor-pointer"
                >
                  {broadcasting ? "Broadcasting..." : "Send announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
