import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { messageTeacher } from "../../services/parentService";
import { 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  User, 
  Sparkles, 
  GraduationCap 
} from "lucide-react";

import { useToast } from "../shared/Toast";

export default function TeacherMessaging(): React.ReactElement {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTeacher, setActiveTeacher] = useState<"helen" | "girmay">("helen");
  const [typedMessage, setTypedMessage] = useState("");
  const [chatLogs, setChatLogs] = useState({
    helen: [
      { sender: "teacher", text: "Hello! I wanted to check in regarding Daniel's physics performance. He started off great but is finding electromagnetism equations tricky." },
      { sender: "parent", text: "Thank you for reaching out Mrs. Helen. I noticed that too on his score trajectories. What study steps do you recommend?" },
      { sender: "teacher", text: "He should focus on mock topic unit 3 practice. I have also assigned a review test. Make sure he reviews the explanations!" }
    ],
    girmay: [
      { sender: "teacher", text: "Good afternoon! Daniel has been performing exceptionally well in his mathematics calculus tests. He maintains an 84% accuracy!" },
      { sender: "parent", text: "That is wonderful to hear! He spends a lot of time on the platform daily." }
    ]
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const currentTeacher = activeTeacher;
    const newMessage = { sender: "parent", text: typedMessage };

    setChatLogs((prev) => ({
      ...prev,
      [currentTeacher]: [...prev[currentTeacher], newMessage]
    }));

    const originalText = typedMessage;
    setTypedMessage("");

    try {
      await messageTeacher({ teacher: currentTeacher, message: originalText });

      setTimeout(() => {
        const replyText = currentTeacher === "helen"
          ? "Thank you for the update! I will monitor his practice sessions and send over more analytics soon."
          : "He is doing a great job! Keep encouraging him to maintain his 14-day streak.";

        setChatLogs((prev) => ({
          ...prev,
          [currentTeacher]: [...prev[currentTeacher], { sender: "teacher", text: replyText }]
        }));
      }, 1000);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      showToast({
        type: "error",
        title: "Message Failed",
        message: err?.message || "Could not deliver message to the educator. Please try again."
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/parent")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Guardian Overview</span>
        </button>
        <span className="text-xs font-semibold text-slate-500">
          Direct Teacher Messaging
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs grid md:grid-cols-12 min-h-[500px]">
        {/* Contact Roster */}
        <div className="md:col-span-4 border-r border-slate-100 bg-slate-50/50 p-4 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
            Educators & Mentors
          </p>

          <button
            type="button"
            onClick={() => setActiveTeacher("helen")}
            className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center gap-3 ${
              activeTeacher === "helen"
                ? "bg-white border border-slate-200 shadow-2xs ring-1 ring-amber-500/20"
                : "hover:bg-slate-100"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm">
              HK
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-slate-900 truncate">Mrs. Helen Kassa</h4>
              <p className="text-[11px] text-slate-500">Physics Master Educator</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTeacher("girmay")}
            className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center gap-3 ${
              activeTeacher === "girmay"
                ? "bg-white border border-slate-200 shadow-2xs ring-1 ring-amber-500/20"
                : "hover:bg-slate-100"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-sm">
              GB
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-slate-900 truncate">Mr. Girmay Belay</h4>
              <p className="text-[11px] text-slate-500">Mathematics Educator</p>
            </div>
          </button>
        </div>

        {/* Messaging Box */}
        <div className="md:col-span-8 flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900">
                {activeTeacher === "helen" ? "Mrs. Helen Kassa (Physics)" : "Mr. Girmay Belay (Mathematics)"}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Online &bull; Menelik II Secondary</span>
          </div>

          <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[360px] bg-slate-50/20">
            {chatLogs[activeTeacher].map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "parent" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "parent"
                      ? "bg-amber-500 text-slate-950 font-medium rounded-br-xs shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white flex gap-2">
            <input
              type="text"
              placeholder="Type your message to the educator..."
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
