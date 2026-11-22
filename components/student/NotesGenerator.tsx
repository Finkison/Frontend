import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Printer,
  ChevronDown,
  BookOpen,
  Brain,
  Lightbulb,
  ListOrdered,
  Copy,
  CheckCircle2,
  Loader2,
  Languages,
  GraduationCap,
  Bookmark,
  Trash2,
  Pin,
  Search,
  Filter,
  X,
  ExternalLink,
  Calendar,
  BookMarked
} from "lucide-react";
import PortalPage from "../shared/PortalPage";
import { useScope } from "../../hooks/useScope";
import api from "../../services/api";
import MathText from "../shared/MathText";
import { 
  createStudentNote, 
  getStudentNotes, 
  deleteStudentNote, 
  updateStudentNote, 
  StudentNoteItem 
} from "../../services/curriculumService";
import { useToast } from "../ui/Toast";
import { useI18n } from "../../i18n";

interface GeneratedNote {
  title: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
    keyPoints?: string[];
    formula?: string;
    example?: string;
  }[];
  mnemonics: string[];
  examTips: string[];
  language: string;
}

export default function NotesGenerator(): React.ReactElement {
  const scope = useScope();
  const { showToast } = useToast();
  const { t, language: appLanguage } = useI18n();
  const locale = appLanguage === "am" ? "am-ET" : appLanguage === "om" ? "om-ET" : "en-ET";
  const [activeTab, setActiveTab] = useState<"generator" | "vault">("generator");

  const [subject, setSubject] = useState("Mathematics");
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState<"en" | "am" | "or">(() => appLanguage === "am" ? "am" : appLanguage === "om" ? "or" : "en");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<GeneratedNote | null>(null);
  const [copied, setCopied] = useState(false);
  const [savingVault, setSavingVault] = useState(false);
  const [savedVault, setSavedVault] = useState(false);
  const notesRef = useRef<HTMLDivElement>(null);

  const [savedNotes, setSavedNotes] = useState<StudentNoteItem[]>([]);
  const [loadingVault, setLoadingVault] = useState(false);
  const [vaultError, setVaultError] = useState(false);
  const [vaultSearch, setVaultSearch] = useState("");
  const [vaultSubjectFilter, setVaultSubjectFilter] = useState("all");
  const [viewingNote, setViewingNote] = useState<StudentNoteItem | null>(null);

  const fetchSavedNotes = useCallback(async () => {
    setLoadingVault(true);
    setVaultError(false);
    try {
      const res = await getStudentNotes();
      setSavedNotes(res.data?.notes || []);
    } catch {
      setVaultError(true);
    } finally {
      setLoadingVault(false);
    }
  }, []);

  useEffect(() => {
    void fetchSavedNotes();
  }, [fetchSavedNotes]);

  const handleSaveToNotebook = async () => {
    if (!note) return;
    setSavingVault(true);
    try {
      const markdownBody = `# ${note.title}\n\n**Summary:** ${note.summary}\n\n` +
        note.sections.map(s => `### ${s.heading}\n${s.content}\n${s.formula ? `\nFormula: ${s.formula}\n` : ''}${s.keyPoints?.length ? '\nKey Points:\n' + s.keyPoints.map(k => `- ${k}`).join('\n') : ''}`).join('\n\n') +
        (note.examTips?.length ? `\n\n### Exam Tips\n` + note.examTips.map(t => `- ${t}`).join('\n') : '');

      const res = await createStudentNote({
        title: note.title,
        content: markdownBody,
        subject: subject,
        topic: topic || note.title,
        tags: [subject, scope.gradeDisplay, "AI Generated"],
        source: "generator"
      });
      if (res.data?.note) {
        setSavedNotes(prev => [res.data.note, ...prev]);
      }
      setSavedVault(true);
      showToast({
        type: "success",
        title: t("studentNotes.savedToNotebook"),
        message: t("studentNotes.savedToNotebookMessage", { title: note.title })
      });
      setTimeout(() => setSavedVault(false), 3000);
    } catch (err) {
      console.error("Failed to save note to personal notebook", err);
      showToast({
        type: "error",
        title: t("studentNotes.saveFailed"),
        message: t("studentNotes.saveFailedMessage")
      });
    } finally {
      setSavingVault(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteStudentNote(noteId);
      setSavedNotes(prev => prev.filter(n => n.id !== noteId));
      if (viewingNote?.id === noteId) setViewingNote(null);
      showToast({
        type: "success",
        title: t("studentNotes.noteRemoved"),
        message: t("studentNotes.noteRemovedMessage")
      });
    } catch {
      showToast({
        type: "error",
        title: t("studentNotes.deleteFailed"),
        message: t("studentNotes.deleteFailedMessage")
      });
    }
  };

  const handleTogglePin = async (n: StudentNoteItem) => {
    try {
      const updatedPin = !n.is_pinned;
      await updateStudentNote(n.id, { is_pinned: updatedPin });
      setSavedNotes(prev => prev.map(item => item.id === n.id ? { ...item, is_pinned: updatedPin } : item));
      if (viewingNote?.id === n.id) {
        setViewingNote(prev => prev ? { ...prev, is_pinned: updatedPin } : null);
      }
    } catch {
      showToast({
        type: "error",
        title: t("studentNotes.updateFailed"),
        message: t("studentNotes.updateFailedMessage")
      });
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ai/generate-notes/", {
        subject,
        topic: topic || undefined,
        language,
        grade: scope.gradeDisplay,
        stream: scope.stream,
      });
      if (res.data?.note) {
        setNote(res.data.note);
      } else {
        throw new Error(res.data?.message || "No notes generated for this topic.");
      }
    } catch (err: any) {
      showToast({
        type: "error",
        title: t("studentNotes.generationFailed"),
        message: err?.response?.data?.message || t("studentNotes.generationFailedMessage")
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!notesRef.current) return;
    try {
      await navigator.clipboard.writeText(notesRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast({ type: "error", title: t("studentNotes.copyFailed"), message: t("studentNotes.copyFailedMessage") });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredVaultNotes = savedNotes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(vaultSearch.toLowerCase()) ||
                          n.content.toLowerCase().includes(vaultSearch.toLowerCase()) ||
                          (n.topic && n.topic.toLowerCase().includes(vaultSearch.toLowerCase()));
    const matchesSubject = vaultSubjectFilter === "all" || n.subject.toLowerCase() === vaultSubjectFilter.toLowerCase();
    return matchesSearch && matchesSubject;
  });

  return (
    <PortalPage className="max-w-5xl space-y-6">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold text-stone-900 dark:text-[#FDFBF7] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" />
            {t("studentNotes.title")}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-[#A89C90] mt-0.5">
            {t("studentNotes.description")}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-[#201815] rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("generator")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "generator"
                ? "bg-white dark:bg-[#261E1A] text-stone-900 dark:text-[#FDFBF7] shadow-2xs"
                : "text-stone-600 dark:text-[#E7E0D6] hover:text-stone-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t("studentNotes.generateTab")}</span>
          </button>
          <button
            type="button"
              onClick={() => {
              setActiveTab("vault");
              void fetchSavedNotes();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "vault"
                ? "bg-white dark:bg-[#261E1A] text-stone-900 dark:text-[#FDFBF7] shadow-2xs"
                : "text-stone-600 dark:text-[#E7E0D6] hover:text-stone-900"
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-[#881337] dark:text-[#FBBF24]" />
            <span>{t("studentNotes.notebookTab")}</span>
            {savedNotes.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#FFE4E6] dark:bg-[#4C0519]/50 text-[#881337] dark:text-[#FBBF24] font-bold">
                {savedNotes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "generator" && (
        <div className="space-y-6">

          <div className="bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200 dark:border-white/10 shadow-sm p-6 space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">

              <div>
                <label htmlFor="study-note-subject" className="block text-xs font-semibold text-stone-700 dark:text-[#E7E0D6] mb-1.5">{t("studentNotes.subject")}</label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-stone-400 dark:text-[#A89C90] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    id="study-note-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 text-sm font-semibold text-stone-800 dark:text-[#FDFBF7] bg-stone-50 dark:bg-[#1C1512] focus:border-[#881337] dark:focus:border-[#FBBF24] focus:bg-white dark:focus:bg-[#261E1A] outline-none appearance-none cursor-pointer transition-colors"
                  >
                    {scope.availableSubjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-400 dark:text-[#A89C90] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label htmlFor="study-note-topic" className="block text-xs font-semibold text-stone-700 dark:text-[#E7E0D6] mb-1.5">{t("studentNotes.topic")}</label>
                <input
                  id="study-note-topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t("studentNotes.topicPlaceholder")}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 text-sm text-stone-800 dark:text-[#FDFBF7] bg-stone-50 dark:bg-[#1C1512] placeholder-stone-400 focus:border-[#881337] dark:focus:border-[#FBBF24] focus:bg-white dark:focus:bg-[#261E1A] outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="study-note-language" className="block text-xs font-semibold text-stone-700 dark:text-[#E7E0D6] mb-1.5">{t("studentNotes.language")}</label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1C1512] text-sm font-semibold text-stone-800 dark:text-[#FDFBF7]">
                  <Languages className="w-4 h-4 text-[#881337] dark:text-[#FBBF24] shrink-0" />
                  <select
                    id="study-note-language"
                    value={language}
                    onChange={(event) => setLanguage(event.target.value as typeof language)}
                    className="min-h-10 w-full bg-transparent text-sm font-semibold text-stone-800 outline-none dark:text-[#FDFBF7]"
                  >
                    <option value="en">English</option>
                    <option value="am">አማርኛ</option>
                    <option value="or">Afaan Oromoo</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#881337] to-[#4C0519] hover:from-[#9F1239] hover:to-[#881337] text-white text-sm font-bold shadow-md shadow-[#881337]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t("studentNotes.generating")}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t("studentNotes.generateForGrade", { grade: scope.gradeDisplay })}</span>
                </>
              )}
            </button>
          </div>

          {note && (
            <div className="space-y-4" ref={notesRef}>

              <div className="flex items-center justify-between bg-white dark:bg-[#261E1A] rounded-2xl border border-stone-200 dark:border-white/10 p-4">
                <div>
                  <h2 className="font-sans text-lg font-bold text-stone-900 dark:text-[#FDFBF7]">{note.title}</h2>
                  <p className="text-xs text-stone-500 dark:text-[#A89C90] mt-0.5">{scope.gradeDisplay} · {scope.stream} · {subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleSaveToNotebook} 
                    disabled={savingVault}
                    className="px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    title={t("studentNotes.saveToNotebook")}
                  >
                    <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                    <span>{savedVault ? t("studentNotes.saved") : t("studentNotes.saveToNotebook")}</span>
                  </button>
                  <button type="button" onClick={handleCopy} aria-label={t("studentNotes.copyNotes")} className="p-2.5 rounded-xl border border-stone-200 dark:border-white/10 hover:bg-stone-50 dark:hover:bg-white/5 text-stone-600 dark:text-[#E7E0D6] transition-colors cursor-pointer" title={t("studentNotes.copyNotes")}>
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button type="button" onClick={handlePrint} aria-label={t("studentNotes.printNotes")} className="p-2.5 rounded-xl border border-stone-200 dark:border-white/10 hover:bg-stone-50 dark:hover:bg-white/5 text-stone-600 dark:text-[#E7E0D6] transition-colors cursor-pointer" title={t("studentNotes.printNotes")}>
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-[#FFF1F2] dark:bg-[#4C0519]/40 border border-[#FECDD3] dark:border-[#881337]/50 rounded-2xl p-5">
                <p className="text-sm text-[#4C0519] dark:text-[#FDFBF7] leading-relaxed font-medium">{note.summary}</p>
              </div>

              {note.sections.map((section, i) => (
                <div key={i} className="bg-white dark:bg-[#261E1A] rounded-2xl border border-stone-200 dark:border-white/10 overflow-hidden shadow-xs">
                  <div className="px-6 py-4 border-b border-stone-100 dark:border-white/10 bg-stone-50/50">
                    <h3 className="font-bold text-stone-900 dark:text-[#FDFBF7] flex items-center gap-2">
                      <ListOrdered className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" />
                      {section.heading}
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-stone-700 dark:text-[#E7E0D6] leading-relaxed">{section.content}</p>

                    {section.keyPoints && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-[#A89C90]">{t("studentNotes.keyPoints")}</p>
                        <ul className="space-y-1">
                          {section.keyPoints.map((point, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-stone-700 dark:text-[#E7E0D6]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {section.formula && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">{t("studentNotes.formula")}</p>
                        <p className="font-mono text-sm font-bold text-amber-900">{section.formula}</p>
                      </div>
                    )}

                    {section.example && (
                      <div className="bg-stone-50 dark:bg-[#1C1512] border border-stone-200 dark:border-white/10 rounded-xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-[#A89C90] mb-1">{t("studentNotes.workedExample")}</p>
                        <pre className="text-sm text-stone-700 dark:text-[#E7E0D6] whitespace-pre-wrap font-mono">{section.example}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {note.mnemonics.length > 0 && (
                <div className="bg-[#FFF1F2]/70 dark:bg-[#4C0519]/40 border border-[#FECDD3] dark:border-[#881337]/50 rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-[#4C0519] dark:text-[#FDFBF7] flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[#881337] dark:text-[#FBBF24]" />
                    {t("studentNotes.memoryAids")}
                  </h3>
                  <ul className="space-y-2">
                    {note.mnemonics.map((m, i) => (
                      <li key={i} className="text-sm text-stone-800 dark:text-[#FDFBF7] flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {note.examTips.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-5 space-y-3">
                  <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                    {t("studentNotes.examGuidelines")}
                  </h3>
                  <ul className="space-y-2">
                    {note.examTips.map((tip, i) => (
                      <li key={i} className="text-sm text-emerald-900 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-2 shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!note && !loading && (
            <div className="text-center py-16 bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200 dark:border-white/10">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24] flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-stone-800 dark:text-[#FDFBF7] text-lg">{t("studentNotes.emptyGeneratedTitle")}</h3>
              <p className="text-sm text-stone-500 dark:text-[#A89C90] mt-2 max-w-md mx-auto">
                {t("studentNotes.emptyGeneratedDescription", { grade: scope.gradeDisplay })}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "vault" && (
        <div className="space-y-6">

          <div className="bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200 dark:border-white/10 p-5 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 dark:text-[#A89C90] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                aria-label={t("studentNotes.searchNotes")}
                placeholder={t("studentNotes.searchNotes")}
                value={vaultSearch}
                onChange={(e) => setVaultSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 dark:border-white/10 text-xs focus:border-amber-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-stone-400 dark:text-[#A89C90] shrink-0" />
              <select
                aria-label={t("studentNotes.filterSubject")}
                value={vaultSubjectFilter}
                onChange={(e) => setVaultSubjectFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 dark:border-white/10 text-xs font-semibold text-stone-700 dark:text-[#E7E0D6] outline-none bg-stone-50 dark:bg-[#1C1512] cursor-pointer"
              >
                <option value="all">{t("studentNotes.allSubjects", { count: savedNotes.length })}</option>
                {Array.from(new Set(savedNotes.map(n => n.subject).filter(Boolean))).map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {loadingVault ? (
            <div role="status" className="p-12 text-center text-stone-400 dark:text-[#A89C90] text-sm">{t("studentNotes.loadingNotebook")}</div>
          ) : vaultError ? (
            <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
              <p className="text-sm text-rose-900 dark:text-rose-100">{t("studentNotes.notebookLoadError")}</p>
              <button type="button" onClick={() => void fetchSavedNotes()} className="min-h-10 rounded-lg border border-rose-300 px-4 text-sm font-semibold text-rose-900 hover:bg-rose-100 dark:border-rose-800 dark:text-rose-100 dark:hover:bg-rose-900/30">{t("studentNotes.retry")}</button>
            </div>
          ) : filteredVaultNotes.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200 dark:border-white/10 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <BookMarked className="w-7 h-7" />
              </div>
              <h3 className="font-sans text-lg font-bold text-stone-900 dark:text-[#FDFBF7]">{vaultSearch || vaultSubjectFilter !== "all" ? t("studentNotes.noMatches") : t("studentNotes.emptyNotebookTitle")}</h3>
              <p className="text-xs text-stone-500 dark:text-[#A89C90] max-w-md mx-auto">
                {vaultSearch || vaultSubjectFilter !== "all" ? t("studentNotes.noMatchesDescription") : t("studentNotes.emptyNotebookDescription")}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVaultNotes.map((n) => (
                <div
                  key={n.id}
                  className="bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200 dark:border-white/10 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24] border border-[#FECDD3] dark:border-[#881337]/50">
                        {n.subject}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleTogglePin(n)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            n.is_pinned ? "text-amber-500 bg-amber-50" : "text-stone-300 hover:text-stone-500"
                          }`}
                          aria-label={n.is_pinned ? t("studentNotes.unpinNote") : t("studentNotes.pinNote")}
                          title={n.is_pinned ? t("studentNotes.unpinNote") : t("studentNotes.pinNote")}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(n.id)}
                          className="p-1.5 rounded-lg text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          aria-label={t("studentNotes.deleteNote")}
                          title={t("studentNotes.deleteNote")}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-sans font-bold text-base text-stone-900 dark:text-[#FDFBF7] line-clamp-2">
                      {n.title}
                    </h3>

                    {n.topic && (
                      <p className="text-[11px] font-medium text-stone-400 dark:text-[#A89C90]">
                        {n.topic}
                      </p>
                    )}

                    <p className="text-xs text-stone-600 dark:text-[#E7E0D6] line-clamp-3 leading-relaxed whitespace-pre-wrap">
                      {n.content.replace(/^#+\s+/gm, "")}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-white/10 flex items-center justify-between text-[11px] text-stone-400 dark:text-[#A89C90]">
                    <span>{new Date(n.created_at).toLocaleDateString(locale, { month: "short", day: "numeric" })}</span>
                    <button
                      type="button"
                      onClick={() => setViewingNote(n)}
                      className="text-xs font-bold text-[#881337] dark:text-[#FBBF24] hover:text-[#881337] dark:hover:text-[#FBBF24] flex items-center gap-1 cursor-pointer"
                    >
                      <span>{t("studentNotes.readNote")}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewingNote && (
            <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#261E1A] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[85vh] flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between border-b border-stone-100 dark:border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#881337] dark:text-[#FBBF24]">
                    {viewingNote.subject} · {viewingNote.topic || t("studentNotes.studyNote")}
                    </span>
                    <h3 className="font-sans text-xl font-bold text-stone-900 dark:text-[#FDFBF7] mt-0.5">
                      {viewingNote.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    aria-label={t("studentNotes.close")}
                    onClick={() => setViewingNote(null)}
                    className="p-1.5 rounded-lg text-stone-400 dark:text-[#A89C90] hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 pr-2 space-y-4 text-xs text-stone-700 dark:text-[#E7E0D6] leading-relaxed whitespace-pre-wrap">
                  {viewingNote.content}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-white/10">
                  <span className="text-[11px] text-stone-400 dark:text-[#A89C90]">
                    {t("studentNotes.savedOn", { date: new Date(viewingNote.created_at).toLocaleDateString(locale) })}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(viewingNote.content);
                          showToast({ type: "success", title: t("studentNotes.copied"), message: t("studentNotes.copiedMessage") });
                        } catch {
                          showToast({ type: "error", title: t("studentNotes.copyFailed"), message: t("studentNotes.copyFailedMessage") });
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-white/10 text-xs font-semibold text-stone-700 dark:text-[#E7E0D6] hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer"
                    >
                      {t("studentNotes.copyText")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(viewingNote.id)}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      {t("studentNotes.deleteNote")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewingNote(null)}
                      className="px-4 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
                    >
                      {t("studentNotes.close")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </PortalPage>
  );
}
