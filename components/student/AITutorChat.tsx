import React, { useEffect, useRef, useState } from "react";
import { Bot, Lightbulb, Languages, RefreshCw, Send, Sparkles } from "lucide-react";
import { useI18n } from "../../i18n";
import { streamAITutor } from "../../services/aiService";
import useAuthStore from "../../store/authStore";
import useScope from "../../hooks/useScope";
import PortalPage from "../shared/PortalPage";

interface ChatMessage {
  id: string;
  sender: "user" | "tutor";
  text: string;
  subject?: string;
  hint?: string;
  timestamp: string;
}

const subjectLabelKeys: Record<string, string> = {
  Mathematics: "mathematics",
  Physics: "physics",
  Chemistry: "chemistry",
  Biology: "biology",
  English: "english",
  Aptitude: "aptitude",
  History: "history",
  Geography: "geography",
  Economics: "economics",
  Civics: "civics",
  "Information Technology": "informationTechnology",
};

const juniorPrompts = [
  { labelKey: "aiTutor.prompts.linearEquation", questionKey: "aiTutor.questions.linearEquation" },
  { labelKey: "aiTutor.prompts.forces", questionKey: "aiTutor.questions.forces" },
  { labelKey: "aiTutor.prompts.foodChain", questionKey: "aiTutor.questions.foodChain" },
] as const;

const seniorPrompts = [
  { labelKey: "aiTutor.prompts.electrochemistry", questionKey: "aiTutor.questions.electrochemistry" },
  { labelKey: "aiTutor.prompts.derivatives", questionKey: "aiTutor.questions.derivatives" },
  { labelKey: "aiTutor.prompts.induction", questionKey: "aiTutor.questions.induction" },
] as const;

export default function AITutorChat(): React.ReactElement {
  const user = useAuthStore((state) => state.user);
  const { t, language: appLanguage } = useI18n();
  const scope = useScope();
  const getSubjectLabel = (value: string) => {
    const labelKey = subjectLabelKeys[value];
    return labelKey ? t(`aiTutor.subjects.${labelKey}`) : value;
  };
  const subjects = scope.availableSubjects.map((value) => ({
    value,
    label: getSubjectLabel(value),
  }));
  const [subject, setSubject] = useState(scope.availableSubjects[0] || "Mathematics");
  const [responseLanguage, setResponseLanguage] = useState<"English" | "Amharic" | "Afaan Oromoo">(() => (
    appLanguage === "am" ? "Amharic" : appLanguage === "om" ? "Afaan Oromoo" : "English"
  ));
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const wasNearBottom = useRef(true);

  const locale = appLanguage === "am" ? "am-ET" : appLanguage === "om" ? "om-ET" : "en-ET";
  const currentSubjectLabel = subjects.find((item) => item.value === subject)?.label;
  const prompts = scope.gradeLevel <= 10 ? juniorPrompts : seniorPrompts;

  useEffect(() => {
    if (!scope.availableSubjects.includes(subject) && scope.availableSubjects.length > 0) {
      setSubject(scope.availableSubjects[0]);
    }
  }, [scope.availableSubjects, subject]);

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (!transcript || !wasNearBottom.current) return;
    transcript.scrollTo({ top: transcript.scrollHeight, behavior: loading ? "auto" : "smooth" });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText ?? inputQuery).trim();
    if (!textToSend || loading) return;

    const timestamp = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(new Date());
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp,
    };
    const tutorMsgId = `tutor-${Date.now()}`;
    const initialTutorMsg: ChatMessage = {
      id: tutorMsgId,
      sender: "tutor",
      text: "",
      subject,
      timestamp,
    };
    const conversationHistory = [...messages, userMsg].map((message) => ({
      sender: message.sender,
      text: message.text,
    }));

    setMessages((previous) => [...previous, userMsg, initialTutorMsg]);
    setInputQuery("");
    setRequestError(null);
    setLoading(true);

    try {
      await streamAITutor(
        {
          userQuery: textToSend,
          subject,
          gradeLevel: user?.grade || `Grade ${scope.gradeLevel}`,
          stream: user?.stream || scope.stream,
          preferredLanguage: responseLanguage,
          conversationHistory,
        },
        (chunk) => {
          setMessages((previous) => previous.map((message) =>
            message.id === tutorMsgId ? { ...message, text: message.text + chunk } : message,
          ));
        },
        (hint) => {
          if (!hint) return;
          setMessages((previous) => previous.map((message) =>
            message.id === tutorMsgId ? { ...message, hint } : message,
          ));
        },
      );
    } catch {
      setMessages((previous) => previous.flatMap((message) => {
        if (message.id !== tutorMsgId) return [message];
        return message.text.trim()
          ? [{ ...message, hint: t("aiTutor.partialResponse") }]
          : [];
      }));
      setInputQuery((current) => current || textToSend);
      setRequestError(t("aiTutor.unavailable"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalPage className="max-w-4xl space-y-6 pb-8">
      <header className="flex flex-col gap-5 rounded-2xl border border-[#3A2921] bg-gradient-to-r from-[#261E1A] via-[#34231F] to-[#261E1A] p-5 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-300/25 bg-amber-300/10 text-amber-300">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />{t("aiTutor.eyebrow")}
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">{t("aiTutor.title")}</h1>
            <p className="mt-1 max-w-xl text-sm leading-5 text-stone-200">{t("aiTutor.description")}</p>
          </div>
        </div>

        <label className="flex min-h-10 shrink-0 items-center gap-2 self-start rounded-lg border border-white/15 bg-white/5 px-3 text-sm font-medium text-white sm:self-auto">
          <Languages className="h-4 w-4 text-amber-300" aria-hidden="true" />
          <span className="sr-only">{t("aiTutor.responseLanguage")}</span>
          <select
            aria-label={t("aiTutor.responseLanguage")}
            value={responseLanguage}
            onChange={(event) => setResponseLanguage(event.target.value as typeof responseLanguage)}
            className="max-w-40 bg-transparent text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <option className="text-stone-900" value="English">English</option>
            <option className="text-stone-900" value="Amharic">አማርኛ</option>
            <option className="text-stone-900" value="Afaan Oromoo">Afaan Oromoo</option>
          </select>
        </label>
      </header>

      <section aria-labelledby="ai-tutor-subject-heading" className="space-y-2">
        <h2 id="ai-tutor-subject-heading" className="text-sm font-semibold text-stone-800 dark:text-[#FDFBF7]">{t("aiTutor.chooseSubject")}</h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {subjects.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={subject === item.value}
              onClick={() => setSubject(item.value)}
              className={`min-h-10 shrink-0 rounded-lg border px-3.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:focus-visible:ring-[#FBBF24] ${
                subject === item.value
                  ? "border-[#881337] bg-[#881337] text-white dark:border-[#FBBF24] dark:bg-[#FBBF24] dark:text-[#261E1A]"
                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#E7E0D6] dark:hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section
        ref={transcriptRef}
        role="log"
        aria-label={t("aiTutor.conversation")}
        aria-live="polite"
        onScroll={(event) => {
          const element = event.currentTarget;
          wasNearBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < 96;
        }}
        className="flex min-h-[360px] max-h-[56vh] flex-col gap-5 overflow-y-auto rounded-2xl border border-stone-200 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-6"
      >
        {messages.length === 0 && (
          <div className="my-auto rounded-xl border border-dashed border-stone-300 bg-[#FAF8F5] p-5 dark:border-white/15 dark:bg-[#1C1512] sm:p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">
              <Bot className="h-4 w-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
              {t("aiTutor.welcomeTitle")}
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 dark:text-[#E7E0D6]">{t("aiTutor.welcomeDescription")}</p>
            <p className="mt-4 text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("aiTutor.tryPrompt")}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {prompts.map((item) => (
                <button
                  key={item.labelKey}
                  type="button"
                  disabled={loading}
                  onClick={() => void handleSend(t(item.questionKey))}
                  className="min-h-9 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-left text-xs font-medium text-stone-700 transition-colors hover:border-[#881337]/50 hover:bg-rose-50 disabled:cursor-wait disabled:opacity-60 dark:border-white/15 dark:bg-[#261E1A] dark:text-[#E7E0D6] dark:hover:bg-white/5"
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => {
          const messageSubjectLabel = message.subject
            ? getSubjectLabel(message.subject)
            : t("aiTutor.subjects.mathematics");
          return (
            <article key={message.id} className={`flex flex-col gap-2 ${message.sender === "user" ? "items-end" : "items-start"}`}>
              <p className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-[#A89C90]">
                {message.sender === "tutor" ? <Bot className="h-3.5 w-3.5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /> : null}
                <span>{message.sender === "tutor"
                  ? t("aiTutor.tutorLabel", { subject: messageSubjectLabel })
                  : t("aiTutor.youLabel")}</span>
                <time>{message.timestamp}</time>
              </p>
              <div className={`max-w-[95%] rounded-xl px-4 py-3 text-sm leading-6 whitespace-pre-line sm:max-w-[85%] sm:px-5 ${
                message.sender === "user"
                  ? "rounded-br-sm bg-[#881337] text-white dark:bg-[#4C0519]"
                  : "rounded-bl-sm border border-stone-200 bg-[#FAF8F5] text-stone-800 dark:border-white/10 dark:bg-[#1C1512] dark:text-[#FDFBF7]"
              }`}>
                {message.text}
                {message.hint && (
                  <p className="mt-3 flex items-start gap-2 border-t border-stone-200 pt-3 text-xs leading-5 text-stone-600 dark:border-white/10 dark:text-[#E7E0D6]">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                    <span>{message.hint}</span>
                  </p>
                )}
              </div>
            </article>
          );
        })}

        {loading && (
          <p role="status" aria-live="polite" className="inline-flex items-center gap-2 self-start rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
            <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />{t("aiTutor.thinking")}
          </p>
        )}
      </section>

      {requestError && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-100">
          {requestError}
        </p>
      )}

      <form onSubmit={(event) => { event.preventDefault(); void handleSend(); }} className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white p-2 shadow-xs focus-within:border-[#881337] focus-within:ring-2 focus-within:ring-[#881337]/15 dark:border-white/15 dark:bg-[#261E1A] dark:focus-within:border-[#FBBF24]">
        <label className="sr-only" htmlFor="ai-tutor-question">{t("aiTutor.questionLabel")}</label>
        <input
          id="ai-tutor-question"
          type="text"
          maxLength={4000}
          value={inputQuery}
          onChange={(event) => setInputQuery(event.target.value)}
          placeholder={t("aiTutor.questionPlaceholder", { subject: currentSubjectLabel || t("aiTutor.subjects.mathematics") })}
          className="min-h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-stone-800 outline-none placeholder:text-stone-400 dark:text-[#FDFBF7]"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#9F1239] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#FBBF24] dark:text-[#261E1A] dark:hover:bg-amber-300"
        >
          <span>{t("aiTutor.send")}</span><Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
      <p className="text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t("aiTutor.privacyNote")}</p>
    </PortalPage>
  );
}
