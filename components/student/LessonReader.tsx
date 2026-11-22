import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Sparkles, 
  Loader2,
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  Bot, 
  Send, 
  Lightbulb, 
  Languages, 
  HelpCircle, 
  Layers, 
  ArrowRight,
  Bookmark,
  Share2,
  ListOrdered,
  FileText,
  Plus,
  Trash2,
  Pin,
  Check,
  NotebookPen
} from "lucide-react";
import PortalPage from "../shared/PortalPage";
import { 
  getLessons, 
  getLessonDetail, 
  explainLessonAI, 
  getStudentNotes, 
  createStudentNote, 
  deleteStudentNote, 
  UnitGroup, 
  LessonDetail, 
  StudentNoteItem 
} from "../../services/curriculumService";
import { startPractice } from "../../services/practiceService";
import useSessionStore from "../../store/sessionStore";
import MathText from "../shared/MathText";
import { useToast } from "../ui/Toast";

export default function LessonReader(): React.ReactElement {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const startSession = useSessionStore((s) => s.startSession);

  const [selectedSubject, setSelectedSubject] = useState("English");
  const [units, setUnits] = useState<UnitGroup[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [lessonDetail, setLessonDetail] = useState<LessonDetail | null>(null);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [rightPanelTab, setRightPanelTab] = useState<"ai" | "notes">("ai");
  const [notes, setNotes] = useState<StudentNoteItem[]>([]);
  const [activeNoteTitle, setActiveNoteTitle] = useState("");
  const [activeNoteContent, setActiveNoteContent] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const [aiOpen, setAiOpen] = useState(true);
  const [aiLanguage, setAiLanguage] = useState<"en" | "am" | "or">("en");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Ask questions about this lesson in English, Amharic (አማርኛ), or Afaan Oromoo."
    }
  ]);

  const subjects = [
    { id: "English", name: "English", icon: "BookOpen" },
    { id: "Mathematics", name: "Mathematics", icon: "Calculator" },
    { id: "Physics", name: "Physics", icon: "Atom" },
    { id: "Chemistry", name: "Chemistry", icon: "FlaskConical" },
    { id: "Biology", name: "Biology", icon: "Dna" },
    { id: "Scholastic Aptitude", name: "Scholastic Aptitude", icon: "Brain" },
  ];

  useEffect(() => {
    fetchLessonsForSubject(selectedSubject);
  }, [selectedSubject]);

  useEffect(() => {
    if (activeLessonId) {
      fetchDetail(activeLessonId);
    }
  }, [activeLessonId]);

  const fetchLessonsForSubject = async (sub: string) => {
    setLoadingUnits(true);
    try {
      const res = await getLessons({ subject: sub, grade: 12 });
      const unitList = res.data?.units || [];
      setUnits(unitList);

      if (unitList.length > 0 && unitList[0].lessons.length > 0) {
        setActiveLessonId(unitList[0].lessons[0].id);
      } else {
        setActiveLessonId(null);
        setLessonDetail(null);
      }
    } catch (err) {
      console.error("Failed to load lessons:", err);
    } finally {
      setLoadingUnits(false);
    }
  };

  const fetchDetail = async (lesId: string) => {
    setLoadingDetail(true);
    try {
      const res = await getLessonDetail(lesId);
      const data = res.data?.data;
      if (data) {
        setLessonDetail(data);
        setAiMessages([
          {
            sender: "ai",
            text: `Ask questions about "${data.title}" or request translations.`
          }
        ]);
        getStudentNotes({ lesson_id: lesId })
          .then((r) => setNotes(r.data?.notes || []))
          .catch(() => setNotes([]));
      }
    } catch (err) {
      console.error("Failed to load lesson detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSaveNote = async () => {
    if (!activeNoteContent.trim() || !lessonDetail) return;
    setSavingNote(true);
    try {
      const res = await createStudentNote({
        lesson_id: lessonDetail.id,
        subject: lessonDetail.subject,
        topic: lessonDetail.title,
        title: activeNoteTitle.trim() || `Notes: ${lessonDetail.title}`,
        content: activeNoteContent.trim(),
        tags: [lessonDetail.subject, `Unit ${lessonDetail.unit_number}`],
        source: "manual"
      });
      if (res.data?.note) {
        setNotes((prev) => [res.data.note, ...prev]);
        setActiveNoteContent("");
        setActiveNoteTitle("");
        showToast({
          type: "success",
          title: "Note Saved",
          message: "Saved to notes."
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Failed to Save",
        message: "Could not persist study note."
      });
    } finally {
      setSavingNote(false);
    }
  };

  const handleSaveAIToNotes = async (text: string) => {
    if (!lessonDetail) return;
    try {
      const res = await createStudentNote({
        lesson_id: lessonDetail.id,
        subject: lessonDetail.subject,
        topic: lessonDetail.title,
        title: `AI Insight: ${lessonDetail.title}`,
        content: text,
        tags: [lessonDetail.subject, "AI Insight"],
        source: "ai_companion"
      });
      if (res.data?.note) {
        setNotes((prev) => [res.data.note, ...prev]);
        showToast({
          type: "success",
          title: "AI Explanation Saved",
          message: "Added to your personal notes for this lesson."
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Save Failed",
        message: "Unable to add AI snippet to notes."
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteStudentNote(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      showToast({ type: "info", title: "Note Deleted", message: "Removed from notes." });
    } catch {
      showToast({ type: "error", title: "Delete Failed", message: "Could not remove note." });
    }
  };

  const handleAskAI = async (promptText?: string) => {
    const query = promptText || aiPrompt;
    if (!query.trim() || !lessonDetail) return;

    // Append user message
    setAiMessages((prev) => [...prev, { sender: "user", text: query }]);
    setAiPrompt("");
    setAiLoading(true);

    try {
      const res = await explainLessonAI({
        lesson_id: lessonDetail.id,
        prompt: query,
        language: aiLanguage
      });
      const reply = res.data?.response || "I could not retrieve an explanation. Please try again.";
      setAiMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    } catch {
      setAiMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiLanguage === "am"
            ? "ይቅርታ፣ አሁን መልስ መስጠት አልቻልኩም። እባክዎ ጥያቄዎን በድጋሚ ይሞክሩ።"
            : aiLanguage === "or"
            ? "Dhiifama, deebii kennuu hin dandeenye. Maaloo lammata yaalaa."
            : "I apologize, could you please repeat that question? I will analyze the lesson concepts."
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleLaunchTopicDrill = async () => {
    if (!lessonDetail) return;
    try {
      const res = await startPractice({
        subject: lessonDetail.subject,
        mode: "topic_drill",
        grade: lessonDetail.grade,
        unit: lessonDetail.unit_number
      });
      const data = res.data;
      const questions = data.questions || lessonDetail.related_questions || [];
      startSession(data.id || `drill-${lessonDetail.id}`, "topic_drill", questions, 1200);
      navigate("/student/session");
    } catch {
      showToast({
        type: "error",
        title: "Practice unavailable",
        message: "No saved questions are available for this lesson yet. Try another topic."
      });
    }
  };

  return (
    <PortalPage className="max-w-7xl space-y-6">

      <div className="flex items-center justify-between gap-4 flex-wrap bg-white dark:bg-[#261E1A] p-4 rounded-3xl border border-stone-200/80 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {subjects.map((sub) => {
            const isActive = selectedSubject.toLowerCase() === sub.id.toLowerCase();
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id)}
                className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-stone-900 to-stone-800 text-amber-400 shadow-md border border-stone-800"
                    : "bg-stone-50 dark:bg-[#1C1512] text-stone-600 dark:text-[#E7E0D6] border border-stone-200 dark:border-white/10 hover:bg-stone-100 dark:hover:bg-white/10"
                }`}
              >
                <BookOpen className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-stone-400 dark:text-[#A89C90]"}`} />
                <span>{sub.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-xs font-bold text-stone-600 dark:text-[#E7E0D6] px-3 py-1.5 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1C1512] hover:bg-stone-100 dark:hover:bg-white/10 flex items-center gap-1.5"
          >
            <ListOrdered className="w-3.5 h-3.5 text-stone-500 dark:text-[#A89C90]" />
            <span>{sidebarOpen ? "Hide Syllabus" : "View Syllabus"}</span>
          </button>
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              aiOpen
                ? "bg-amber-400 text-stone-950 border-amber-500 shadow-sm"
                : "bg-stone-900 text-amber-400 border-stone-800"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Tutor</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {sidebarOpen && (
          <aside className="lg:col-span-3 space-y-4 bg-white dark:bg-[#261E1A] p-4 rounded-3xl border border-stone-200 dark:border-white/10 shadow-sm lg:sticky lg:top-20 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-stone-900 dark:text-[#FDFBF7]">Syllabus</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                Grade 12
              </span>
            </div>

            {loadingUnits ? (
              <div className="py-12 text-center text-xs text-stone-400 dark:text-[#A89C90]">Loading units...</div>
            ) : units.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400 dark:text-[#A89C90]">No lessons available for {selectedSubject}.</div>
            ) : (
              <div className="space-y-4">
                {units.map((u) => (
                  <div key={u.unit_number} className="space-y-2">
                    <div className="text-xs font-bold text-stone-500 dark:text-[#A89C90] uppercase tracking-wider px-1">
                      {u.unit_title}
                    </div>
                    <div className="space-y-1">
                      {u.lessons.map((les) => {
                        const isCurrent = activeLessonId === les.id;
                        return (
                          <button
                            key={les.id}
                            onClick={() => setActiveLessonId(les.id)}
                            className={`w-full text-left p-3 rounded-2xl text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                              isCurrent
                                ? "bg-amber-500/10 border border-amber-500/30 text-stone-900 dark:text-[#FDFBF7] font-bold shadow-sm"
                                : "hover:bg-stone-50 dark:hover:bg-white/5 text-stone-600 dark:text-[#E7E0D6] border border-transparent"
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-mono ${
                              isCurrent ? "bg-amber-400 text-stone-950 font-bold" : "bg-stone-100 dark:bg-[#201815] text-stone-500 dark:text-[#A89C90]"
                            }`}>
                              {les.lesson_number}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-medium leading-tight">{les.title}</p>
                              <span className="text-[10px] text-stone-400 dark:text-[#A89C90] flex items-center gap-1 mt-1">
                                <Clock className="w-2.5 h-2.5" />
                                {les.read_time_minutes} min read
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}

        <div className={`${sidebarOpen ? (aiOpen ? "lg:col-span-5 xl:col-span-6" : "lg:col-span-9") : (aiOpen ? "lg:col-span-8" : "lg:col-span-12")} space-y-6`}>
          {loadingDetail ? (
            <div className="p-12 text-center bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200 dark:border-white/10">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-stone-700 dark:text-[#E7E0D6]">Loading lesson content & formulas...</p>
            </div>
          ) : !lessonDetail ? (
            <div className="p-12 text-center bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200 dark:border-white/10">
              <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bold text-stone-800 dark:text-[#FDFBF7]">No Lesson Selected</h3>
              <p className="text-xs text-stone-500 dark:text-[#A89C90] mt-1">Select a unit topic from the syllabus to begin studying.</p>
            </div>
          ) : (
            <article className="bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-8">

              <div className="space-y-3 pb-6 border-b border-stone-100 dark:border-white/10">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-stone-900 text-amber-400 text-xs font-bold tracking-wide">
                    {lessonDetail.subject} • Grade {lessonDetail.grade}
                  </span>
                  <div className="flex items-center gap-2 text-stone-400 dark:text-[#A89C90] text-xs">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {lessonDetail.read_time_minutes} min read
                    </span>
                  </div>
                </div>

                <h1 className="font-sans text-2xl sm:text-3xl font-bold text-stone-900 dark:text-[#FDFBF7] leading-tight">
                  {lessonDetail.title}
                </h1>

                <p className="text-xs text-stone-500 dark:text-[#A89C90] font-medium">
                  {lessonDetail.unit_title} • Lesson {lessonDetail.lesson_number}
                </p>

                {lessonDetail.summary && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs leading-relaxed font-sans">
                    <div className="font-bold mb-1 flex items-center gap-1.5 text-amber-800">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      <span>Summary</span>
                    </div>
                    {lessonDetail.summary}
                  </div>
                )}
              </div>

              <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4">
                <MathText text={lessonDetail.content_markdown} />
              </div>

              {lessonDetail.key_formulas && lessonDetail.key_formulas.length > 0 && (
                <div className="space-y-3 p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-[#0A192F] text-white border border-stone-800">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Key Formulas</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {lessonDetail.key_formulas.map((f, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[11px] font-bold text-stone-300">{f.name}</span>
                        <div className="font-mono text-xs text-amber-300">
                          <MathText text={f.formula} />
                        </div>
                        {f.note && <p className="text-[10px] text-stone-400 dark:text-[#A89C90] mt-1">{f.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lessonDetail.key_terms && lessonDetail.key_terms.length > 0 && (
                <div className="space-y-3 p-5 rounded-2xl bg-stone-50 dark:bg-[#1C1512] border border-stone-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-stone-900 dark:text-[#FDFBF7] font-bold text-xs uppercase tracking-wider">
                      <Languages className="w-4 h-4 text-emerald-600" />
                      <span>Terminology & Glossary</span>
                    </div>
                    <span className="text-[10px] text-stone-400 dark:text-[#A89C90] font-mono">EN • አማርኛ • OROMOO</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 pt-1">
                    {lessonDetail.key_terms.map((t, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white dark:bg-[#261E1A] border border-stone-200/80 text-xs space-y-1 shadow-2xs">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-bold text-stone-900 dark:text-[#FDFBF7]">{t.term}</span>
                          <div className="flex items-center gap-2 text-[11px]">
                            {t.amharic && (
                              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium">
                                አማርኛ: {t.amharic}
                              </span>
                            )}
                            {t.oromo && (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium">
                                Oromoo: {t.oromo}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-stone-600 dark:text-[#E7E0D6] text-[11px] leading-relaxed">{t.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lessonDetail.worked_examples && lessonDetail.worked_examples.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-[#FDFBF7] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Worked Examples</span>
                  </h3>
                  {lessonDetail.worked_examples.map((ex, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
                      <span className="font-bold text-xs text-emerald-900">{ex.title}</span>
                      {ex.passage_excerpt && (
                        <blockquote className="p-3 rounded-xl bg-white dark:bg-[#261E1A] border-l-4 border-emerald-500 text-xs text-stone-700 dark:text-[#E7E0D6] italic">
                          "{ex.passage_excerpt}"
                        </blockquote>
                      )}
                      <p className="text-xs font-semibold text-stone-800 dark:text-[#FDFBF7]">Q: {ex.question}</p>
                      <div className="p-3 rounded-xl bg-white dark:bg-[#261E1A] border border-emerald-200 text-xs text-stone-800 dark:text-[#FDFBF7] space-y-1">
                        <span className="font-bold text-emerald-700 text-[11px] uppercase tracking-wide">Step-by-Step Solution:</span>
                        <div className="mt-1">
                          <MathText text={ex.solution} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {lessonDetail.exam_tips && (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-stone-900 dark:text-[#FDFBF7] space-y-2">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wide">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>Exam Strategy & Traps</span>
                  </div>
                  <p className="text-xs text-stone-700 dark:text-[#E7E0D6] leading-relaxed font-medium">
                    {lessonDetail.exam_tips}
                  </p>
                </div>
              )}

              <div className="pt-6 border-t border-stone-100 dark:border-white/10 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  {lessonDetail.prev_lesson_id && (
                    <button
                      onClick={() => setActiveLessonId(lessonDetail.prev_lesson_id)}
                      className="px-4 py-2 rounded-xl border border-stone-200 dark:border-white/10 text-xs font-bold text-stone-700 dark:text-[#E7E0D6] hover:bg-stone-50 dark:hover:bg-white/5 flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous Lesson</span>
                    </button>
                  )}
                  {lessonDetail.next_lesson_id && (
                    <button
                      onClick={() => setActiveLessonId(lessonDetail.next_lesson_id)}
                      className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 flex items-center gap-1.5"
                    >
                      <span>Next Lesson</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={handleLaunchTopicDrill}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Practice Topic Drill</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          )}
        </div>

        {aiOpen && (
          <aside className="lg:col-span-4 xl:col-span-3 space-y-3 bg-white dark:bg-[#261E1A] p-4 sm:p-5 rounded-3xl border border-stone-200 dark:border-white/10 shadow-lg lg:sticky lg:top-20 max-h-[85vh] flex flex-col justify-between">
            <div className="space-y-3">

              <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-[#201815] rounded-2xl">
                <button
                  type="button"
                  onClick={() => setRightPanelTab("ai")}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    rightPanelTab === "ai"
                      ? "bg-white dark:bg-[#261E1A] text-stone-900 dark:text-[#FDFBF7] shadow-xs"
                      : "text-stone-500 dark:text-[#A89C90] hover:text-stone-800"
                  }`}
                >
                  AI Companion
                </button>
                <button
                  type="button"
                  onClick={() => setRightPanelTab("notes")}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    rightPanelTab === "notes"
                      ? "bg-white dark:bg-[#261E1A] text-stone-900 dark:text-[#FDFBF7] shadow-xs"
                      : "text-stone-500 dark:text-[#A89C90] hover:text-stone-800"
                  }`}
                >
                  <NotebookPen className="w-3.5 h-3.5 text-amber-500" />
                  <span>Notes ({notes.length})</span>
                </button>
              </div>

              {rightPanelTab === "ai" && (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] text-[#0369A1] font-bold">National Curriculum AI</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => handleAskAI("Explain this concept simply and clearly")}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-50 dark:bg-[#1C1512] text-stone-800 dark:text-[#FDFBF7] border border-stone-200 dark:border-white/10 hover:bg-stone-100 dark:hover:bg-white/10 font-medium transition-colors cursor-pointer"
                      >
                        Explain simply
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAskAI("Provide a memorable formula summary for this")}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-50 dark:bg-[#1C1512] text-stone-800 dark:text-[#FDFBF7] border border-stone-200 dark:border-white/10 hover:bg-stone-100 dark:hover:bg-white/10 font-medium transition-colors cursor-pointer"
                      >
                        Formula summary
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAiLanguage("am");
                          handleAskAI("ይህን ፅንሰ ሀሳብ በአማርኛ በዝርዝር አስረዳኝ");
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-50 dark:bg-[#1C1512] text-stone-800 dark:text-[#FDFBF7] border border-stone-200 dark:border-white/10 hover:bg-stone-100 dark:hover:bg-white/10 font-medium transition-colors cursor-pointer"
                      >
                        በአማርኛ አስረዳኝ
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5 overflow-y-auto max-h-[340px] pr-1 pt-1">
                    {aiMessages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl text-xs leading-relaxed space-y-2 ${
                          m.sender === "user"
                            ? "bg-amber-50 text-stone-900 dark:text-[#FDFBF7] border border-amber-200 ml-4 font-medium"
                            : "bg-stone-50 dark:bg-[#1C1512] text-stone-800 dark:text-[#FDFBF7] border border-stone-200/80 mr-1"
                        }`}
                      >
                        <MathText text={m.text} />
                        {m.sender === "ai" && idx > 0 && (
                          <div className="pt-1.5 border-t border-stone-200/50 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleSaveAIToNotes(m.text)}
                              className="text-[10px] font-bold text-amber-700 hover:text-amber-900 bg-amber-100/70 hover:bg-amber-100 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            >
                              <Pin className="w-3 h-3 text-amber-600" />
                              <span>Save to Notes</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {aiLoading && (
                      <div className="p-3 rounded-2xl bg-stone-50 dark:bg-[#1C1512] text-stone-500 dark:text-[#A89C90] text-xs italic flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {rightPanelTab === "notes" && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                      New Study Note
                    </span>
                    <input
                      type="text"
                      placeholder="Note Title (e.g. Key Formulas)"
                      value={activeNoteTitle}
                      onChange={(e) => setActiveNoteTitle(e.target.value)}
                      className="w-full bg-white dark:bg-[#261E1A] border border-stone-200 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-xs focus:border-amber-500 outline-none"
                    />
                    <textarea
                      rows={3}
                      placeholder="Type your personal observations, derivations, or exam notes..."
                      value={activeNoteContent}
                      onChange={(e) => setActiveNoteContent(e.target.value)}
                      className="w-full bg-white dark:bg-[#261E1A] border border-stone-200 dark:border-white/10 rounded-xl p-2.5 text-xs focus:border-amber-500 outline-none resize-none"
                    />
                    <button
                      type="button"
                      disabled={savingNote || !activeNoteContent.trim()}
                      onClick={handleSaveNote}
                      className="w-full py-1.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-stone-950 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{savingNote ? "Saving Note..." : "Save Note"}</span>
                    </button>
                  </div>

                  <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-[#A89C90] block">
                      Saved Notes ({notes.length})
                    </span>
                    {notes.length === 0 ? (
                      <p className="text-xs text-stone-400 dark:text-[#A89C90] italic text-center py-4">
                        No notes for this lesson yet.
                      </p>
                    ) : (
                      notes.map((n) => (
                        <div
                          key={n.id}
                          className="p-3 rounded-2xl bg-stone-50 dark:bg-[#1C1512] border border-stone-200 dark:border-white/10 space-y-1.5 text-xs hover:border-stone-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-stone-900 dark:text-[#FDFBF7] line-clamp-1">{n.title}</h4>
                            <button
                              type="button"
                              onClick={() => handleDeleteNote(n.id)}
                              className="text-stone-400 dark:text-[#A89C90] hover:text-rose-600 p-0.5 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-stone-600 dark:text-[#E7E0D6] whitespace-pre-wrap text-[11px] line-clamp-4 leading-relaxed">
                            {n.content}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-stone-400 dark:text-[#A89C90] pt-1 border-t border-stone-200/50">
                            <span className="px-1.5 py-0.2 rounded bg-stone-200/60 font-semibold text-stone-700 dark:text-[#E7E0D6]">
                              {n.source === "ai_companion" ? "AI Companion" : "Self-Study"}
                            </span>
                            <span>{n.created_at}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {rightPanelTab === "ai" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskAI();
                }}
                className="mt-2 pt-2 border-t border-stone-100 dark:border-white/10 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask AI about this lesson..."
                  className="flex-1 bg-stone-50 dark:bg-[#1C1512] border border-stone-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-[#FDFBF7] focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={aiLoading || !aiPrompt.trim()}
                  className="p-2 rounded-xl bg-stone-900 text-amber-400 hover:bg-stone-800 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </aside>
        )}
      </div>
    </PortalPage>
  );
}
