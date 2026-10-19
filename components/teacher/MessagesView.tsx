import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
import { MessageSquare, Send, User, ChevronRight, Search, CheckCheck, Clock, Sparkles } from "lucide-react";
import { useToast } from "../ui/Toast";

interface ChatMessage {
  sender: "Teacher" | "Parent" | "Student";
  text: string;
  time: string;
}

interface MessageThread {
  id: string;
  recipient: string;
  role: "Parent" | "Student";
  studentName?: string;
  section: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: ChatMessage[];
}

export default function TeacherMessagesView(): React.ReactElement {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const teacherSubject = (user as any)?.subject || "Biology";

  const [activeTab, setActiveTab] = useState<"all" | "parents" | "students">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [threads, setThreads] = useState<MessageThread[]>([
    {
      id: "th-1",
      recipient: "Almaz Kebede",
      role: "Parent",
      studentName: "Natnael Girma",
      section: "Section 12-A",
      lastMessage: "Thank you Dr. Aster, we reviewed the genetic cross problem set at home.",
      time: "10:30 AM",
      unread: false,
      messages: [
        { sender: "Teacher", text: "Hello Mrs. Almaz, Natnael showed strong understanding in ecology, but needs review on Mendelian genetics.", time: "Yesterday, 4:15 PM" },
        { sender: "Parent", text: "Thank you Dr. Aster, we reviewed the genetic cross problem set at home.", time: "10:30 AM" }
      ]
    },
    {
      id: "th-2",
      recipient: "Bethlehem Alemu",
      role: "Student",
      section: "Section 12-A",
      lastMessage: "Dr. Aster, will the Unit 4 practical include microscope slide calibration?",
      time: "Yesterday",
      unread: false,
      messages: [
        { sender: "Student", text: "Dr. Aster, will the Unit 4 practical include microscope slide calibration?", time: "Yesterday, 5:20 PM" },
        { sender: "Teacher", text: "Yes Bethlehem, ensure you review the magnification calculations from laboratory handout 2.", time: "Yesterday, 6:00 PM" }
      ]
    },
    {
      id: "th-3",
      recipient: "Tadesse Woldemariam",
      role: "Parent",
      studentName: "Bethlehem Alemu",
      section: "Section 12-A",
      lastMessage: "We received the academic recognition letter. Thank you for your guidance.",
      time: "Oct 14",
      unread: false,
      messages: [
        { sender: "Teacher", text: "Good afternoon Mr. Tadesse, Bethlehem achieved 98% in the practical assessment.", time: "Oct 14, 2:10 PM" },
        { sender: "Parent", text: "We received the academic recognition letter. Thank you for your guidance.", time: "Oct 14, 4:45 PM" }
      ]
    }
  ]);

  const [selectedThread, setSelectedThread] = useState<MessageThread>(threads[0]);
  const [replyText, setReplyText] = useState("");

  const quickTemplates = [
    "Thank you for the update. We will follow up during office hours.",
    "Please review the practice problem set uploaded under Unit 4.",
    "Candidate showed excellent improvement in recent formative checks."
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const updated: MessageThread = {
      ...selectedThread,
      lastMessage: replyText.trim(),
      time: "Just now",
      messages: [...selectedThread.messages, { sender: "Teacher", text: replyText.trim(), time: "Just now" }]
    };
    setSelectedThread(updated);
    setThreads(threads.map((t) => (t.id === updated.id ? updated : t)));
    setReplyText("");
    showToast({ title: "Message sent", message: "Response delivered to recipient.", type: "success" });
  };

  const filteredThreads = threads.filter((t) => {
    if (activeTab === "parents" && t.role !== "Parent") return false;
    if (activeTab === "students" && t.role !== "Student") return false;
    if (searchQuery.trim()) {
      const matchRecipient = t.recipient.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSection = t.section.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchRecipient && !matchSection) return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">Messages</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
              {teacherSubject}
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Direct messaging with parents and students in your assigned sections.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 bg-white border border-[#E2E8F0] rounded-[8px] min-h-[520px] overflow-hidden shadow-xs">
        {/* Threads sidebar */}
        <div className="border-r border-[#E2E8F0] flex flex-col">
          {/* Filter and search */}
          <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-[#E2E8F0] rounded-[6px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"
              />
            </div>
            <div className="flex gap-1">
              {(["all", "parents", "students"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1 rounded text-[11px] font-semibold cursor-pointer capitalize transition-colors ${
                    activeTab === tab
                      ? "bg-[#1D4ED8] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#E2E8F0] overflow-y-auto flex-1">
            {filteredThreads.map((t) => {
              const isSelected = selectedThread.id === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedThread(t)}
                  className={`w-full p-3.5 text-left transition-colors cursor-pointer text-xs ${
                    isSelected ? "bg-[#EFF6FF] border-l-3 border-[#1D4ED8]" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#0F172A] truncate">{t.recipient}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{t.time}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {t.role === "Parent" ? `Parent of ${t.studentName}` : "Student"} • {t.section}
                  </div>
                  <div className="text-slate-600 truncate mt-1 text-[11px]">{t.lastMessage}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation details */}
        <div className="md:col-span-2 flex flex-col p-5">
          <div className="border-b border-[#E2E8F0] pb-3 mb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-[#0F172A]">{selectedThread.recipient}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                  {selectedThread.role}
                </span>
              </div>
              <div className="text-[11px] text-[#475569] mt-0.5">
                {selectedThread.section} • {teacherSubject} Department
              </div>
            </div>
          </div>

          {/* Messages scroll pane */}
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[320px] mb-4 pr-2">
            {selectedThread.messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-[8px] max-w-md text-xs space-y-1 ${
                  m.sender === "Teacher"
                    ? "bg-[#EFF6FF] border border-[#BFDBFE] text-[#0F172A] ml-auto"
                    : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] mr-auto"
                }`}
              >
                <div className="text-[10px] text-slate-400 flex items-center justify-between gap-3">
                  <span>{m.sender}</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-2.5 h-2.5" />
                    {m.time}
                  </span>
                </div>
                <div className="leading-relaxed">{m.text}</div>
              </div>
            ))}
          </div>

          {/* Quick template responses */}
          <div className="mb-3 pt-2 border-t border-[#E2E8F0]">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 font-semibold">
              Quick responses
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickTemplates.map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setReplyText(template)}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] rounded cursor-pointer transition-colors"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Type message..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-3 py-2 border border-[#E2E8F0] rounded-[6px] text-xs focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-[6px] text-xs font-semibold cursor-pointer min-h-[38px] flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
