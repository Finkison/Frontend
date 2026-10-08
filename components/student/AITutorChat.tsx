import React, { useState } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Lightbulb, 
  Languages, 
  BookOpen, 
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { askAITutor, streamAITutor } from "../../services/aiService";
import useAuthStore from "../../store/authStore";

interface ChatMessage {
  id: string;
  sender: "user" | "tutor";
  text: string;
  hint?: string;
  suggestedFollowUps?: string[];
  timestamp: string;
}

export default function AITutorChat(): React.ReactElement {
  const user = useAuthStore((s) => s.user);

  const [subject, setSubject] = useState("Mathematics");
  const [lang, setLang] = useState<"English" | "Amharic" | "Afaan Oromoo">("English");
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "tutor",
      text: "Selam candidate! I am your Ethiopian Curriculum Socratic AI Tutor.\n\nAsk me any concept, past exam problem, or derivation from Grade 11 or 12 STEM & Social Science subjects. I will guide you with step-by-step reasoning rather than just giving you the answer.",
      hint: "Ask any step-by-step question or request a conceptual breakdown.",
      suggestedFollowUps: [
        "Explain standard reduction potentials in Electrochemistry",
        "How do I find the derivative of f(x) = ln(x^2 + 1)?",
        "Explain Lenz's Law and electromagnetic induction"
      ],
      timestamp: "Just now"
    }
  ]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const tutorMsgId = `tutor-${Date.now()}`;
    const initialTutorMsg: ChatMessage = {
      id: tutorMsgId,
      sender: "tutor",
      text: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const conversationHistory = [...messages, userMsg].map((m) => ({
      sender: m.sender,
      text: m.text
    }));

    setMessages((prev) => [...prev, userMsg, initialTutorMsg]);
    setInputQuery("");
    setLoading(true);

    try {
      await streamAITutor(
        {
          userQuery: textToSend,
          subject,
          gradeLevel: user?.grade || "Grade 12",
          stream: user?.stream || "Natural Science",
          preferredLanguage: lang,
          conversationHistory
        },
        (chunk: string) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tutorMsgId ? { ...msg, text: msg.text + chunk } : msg
            )
          );
        },
        (hint?: string) => {
          setLoading(false);
          if (hint) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === tutorMsgId ? { ...msg, hint } : msg
              )
            );
          }
        }
      );
    } catch {
      setLoading(false);
      // Resilient fallback
      const fallbackReply = lang === "Amharic"
        ? `እንደምን አለህ! የ${subject} ጥያቄህን በጥልቀት እንመርምር። መጀመሪያ የተሰጡትን ዋና መረጃዎች ለይተህ ጻፍ። ቀጣዩን የሂሳብ ወይም ሳይንስ ቀመር መተግበር ትችላለህ?`
        : lang === "Afaan Oromoo"
        ? `Akkam jirtu! Gaaffii ${subject} kee haa ilaallu. Jalqaba wantoota kennaman adda baasii barreessi.`
        : `Let's break down this **${subject}** question step-by-step:\n\n1. What is the fundamental formula or law from Grade 12 syllabus that applies here?\n2. What variables are given, and what are we asked to calculate?`;

      setMessages((prev) => [
        ...prev,
        {
          id: `tutor-${Date.now()}`,
          sender: "tutor",
          text: fallbackReply,
          hint: "Break the problem down into smaller algebraic components first.",
          suggestedFollowUps: ["Show me a step-by-step example", "Give me a similar past national exam drill"],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Panel */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-[#0A192F] to-slate-950 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Socratic AI Pedagogical Guide</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">Interactive Curriculum Tutor</h2>
          </div>
        </div>

        {/* Language Badge */}
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 border border-white/10 text-xs font-bold text-amber-300">
          <Languages className="w-3.5 h-3.5" />
          <span>English Medium</span>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {["Mathematics", "Physics", "Chemistry", "Biology", "English", "Aptitude"].map((s) => (
          <button
            key={s}
            onClick={() => setSubject(s)}
            className={`px-3.5 py-1.5 rounded-xl font-bold border transition-colors shrink-0 ${
              subject === s
                ? "bg-slate-900 text-amber-400 border-slate-900 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm min-h-[460px] max-h-[580px] overflow-y-auto space-y-5 flex flex-col">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"} space-y-2`}
          >
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
              {m.sender === "tutor" ? (
                <>
                  <Bot className="w-3.5 h-3.5 text-amber-500" />
                  <span>Socratic AI ({subject})</span>
                </>
              ) : (
                <span>You • {m.timestamp}</span>
              )}
            </div>

            <div
              className={`p-4 sm:p-5 rounded-2xl max-w-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                m.sender === "user"
                  ? "bg-slate-900 text-white rounded-br-none shadow-md"
                  : "bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
              }`}
            >
              {m.text}

              {/* Socratic Hint */}
              {m.hint && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2 text-xs">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{m.hint}</span>
                </div>
              )}

              {/* Follow-up Prompts */}
              {m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Recommended Follow-ups:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {m.suggestedFollowUps.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSend(prompt)}
                        className="py-1 px-2.5 rounded-lg bg-white border border-slate-300 hover:border-amber-400 hover:bg-amber-50/50 text-[11px] font-semibold text-slate-700 transition-colors text-left"
                      >
                        • {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-amber-600 font-bold p-3 bg-amber-50 rounded-2xl w-fit">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Socratic AI is formulating step-by-step pedagogical breakdown...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-2 rounded-2xl bg-white border border-slate-300 shadow-md flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={`Ask Socratic AI about ${subject} (e.g., "Why is cell potential positive in galvanic cells?")...`}
          className="flex-1 p-3 text-xs sm:text-sm bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="p-3 rounded-xl bg-amber-400 hover:bg-amber-500 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-sm flex items-center gap-1.5 text-xs"
        >
          <span>Ask</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
