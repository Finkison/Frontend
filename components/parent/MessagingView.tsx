import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { messageTeacher, getParentMessages } from "../../services/parentService";
import { 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  User, 
  GraduationCap 
} from "lucide-react";

import { useToast } from "../ui/Toast";

interface ChatMessage {
  id?: string;
  sender: "parent" | "teacher";
  text: string;
  time?: string;
}

export default function TeacherMessaging(): React.ReactElement {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTeacher, setActiveTeacher] = useState<string>("homeroom");
  const [typedMessage, setTypedMessage] = useState("");
  const [chatLogs, setChatLogs] = useState<Record<string, ChatMessage[]>>({
    homeroom: [],
    physics: [],
    mathematics: []
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getParentMessages()
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          const grouped: Record<string, ChatMessage[]> = {
            homeroom: [],
            physics: [],
            mathematics: []
          };
          res.data.forEach((msg: any) => {
            const thread = msg.teacher_id || msg.department?.toLowerCase() || "homeroom";
            if (!grouped[thread]) grouped[thread] = [];
            grouped[thread].push({
              id: msg.id,
              sender: msg.sender_role === "PARENT" || msg.is_parent ? "parent" : "teacher",
              text: msg.message || msg.text || "",
              time: msg.created_at || "Recent"
            });
          });
          setChatLogs((prev) => ({ ...prev, ...grouped }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || sending) return;

    const currentTeacher = activeTeacher;
    const newMessage: ChatMessage = { sender: "parent", text: typedMessage.trim(), time: "Just now" };

    setChatLogs((prev) => ({
      ...prev,
      [currentTeacher]: [...(prev[currentTeacher] || []), newMessage]
    }));

    const textToSend = typedMessage.trim();
    setTypedMessage("");
    setSending(true);

    try {
      await messageTeacher({ teacher: currentTeacher, message: textToSend });
      showToast({
        type: "success",
        title: "Message Sent",
        message: "Your message has been delivered to the faculty advisor."
      });
    } catch (err: any) {
      console.error("Failed to send message:", err);
      showToast({
        type: "error",
        title: "Message Failed",
        message: err?.message || "Could not deliver message to the educator."
      });
    } finally {
      setSending(false);
    }
  };

  const currentMessages = chatLogs[activeTeacher] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/parent")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to dashboard</span>
        </button>
        <span className="text-xs font-semibold text-slate-500">
          Teacher messages
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs grid md:grid-cols-12 min-h-[500px]">
        {/* Contact Roster */}
        <div className="md:col-span-4 border-r border-slate-100 bg-slate-50/50 p-4 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
            Faculty advisors
          </p>

          <button
            type="button"
            onClick={() => setActiveTeacher("homeroom")}
            className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center gap-3 ${
              activeTeacher === "homeroom"
                ? "bg-white border border-slate-200 shadow-2xs ring-1 ring-[#1D4ED8]/20"
                : "hover:bg-slate-100"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] font-bold flex items-center justify-center shrink-0 text-sm">
              HA
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-slate-900 truncate">Homeroom Advisor</h4>
              <p className="text-[11px] text-slate-500">Academic Guidance</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTeacher("physics")}
            className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center gap-3 ${
              activeTeacher === "physics"
                ? "bg-white border border-slate-200 shadow-2xs ring-1 ring-[#1D4ED8]/20"
                : "hover:bg-slate-100"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm">
              PH
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-slate-900 truncate">Physics Department</h4>
              <p className="text-[11px] text-slate-500">Natural Science</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTeacher("mathematics")}
            className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center gap-3 ${
              activeTeacher === "mathematics"
                ? "bg-white border border-slate-200 shadow-2xs ring-1 ring-[#1D4ED8]/20"
                : "hover:bg-slate-100"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] font-bold flex items-center justify-center shrink-0 text-sm">
              MA
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-slate-900 truncate">Mathematics Department</h4>
              <p className="text-[11px] text-slate-500">Natural & Social</p>
            </div>
          </button>
        </div>

        {/* Messaging Box */}
        <div className="md:col-span-8 flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-900 capitalize">
                {activeTeacher === "homeroom" ? "Homeroom Advisor" : `${activeTeacher} Department`}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Institutional Faculty Channel</span>
          </div>

          <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[360px] bg-slate-50/20">
            {currentMessages.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                No message history yet. Enter a message below to contact the faculty advisor.
              </div>
            ) : (
              currentMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "parent" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "parent"
                        ? "bg-[#1D4ED8] text-white font-medium rounded-br-xs shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white flex gap-2">
            <input
              type="text"
              placeholder="Type a message to faculty..."
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 outline-none"
            />
            <button
              type="submit"
              disabled={sending || !typedMessage.trim()}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs disabled:opacity-50"
            >
              <span>{sending ? "Sending..." : "Send"}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
