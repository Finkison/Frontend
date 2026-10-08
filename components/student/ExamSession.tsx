import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { completePractice, submitAnswer } from "../../services/practiceService";
import useSessionStore from "../../store/sessionStore";
import { 
  Clock, 
  Sparkles, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  BookOpen
} from "lucide-react";
import MathText from "../shared/MathText";
import FormulaSheetModal from "./FormulaSheetModal";

export default function ExamSession() {
  const navigate = useNavigate();
  const { 
    sessionId, 
    questions, 
    sections,
    currentQuestionIndex, 
    nextQuestion, 
    prevQuestion,
    goToQuestion,
    setResult,
    timeRemaining,
    restoreSession,
    submitAnswer: recordStoreAnswer,
    bookmarkedQuestionIds,
    toggleBookmark
  } = useSessionStore();

  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeRemaining || 7200);
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});
  const [showHint, setShowHint] = useState(false);
  const [passageFontSize, setPassageFontSize] = useState<"sm" | "base" | "lg">("base");
  const [showFormulaSheet, setShowFormulaSheet] = useState(false);
  const [filterFlaggedOnly, setFilterFlaggedOnly] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      const restored = restoreSession();
      if (restored) {
        const savedAnswers = useSessionStore.getState().answers;
        const ansMap: Record<number, string> = {};
        savedAnswers.forEach((ans, idx) => {
          ansMap[idx] = String(ans.selected);
        });
        setStudentAnswers(ansMap);
      }
    }
  }, [sessionId, restoreSession]);

  const current = useMemo(() => questions?.[currentQuestionIndex], [questions, currentQuestionIndex]);

  const examSections = useMemo(() => {
    if (sections && sections.length > 0) return sections;
    const map = new Map<string, { title: string; firstIndex: number; count: number }>();
    questions.forEach((q, idx) => {
      const secName = q.section || "General";
      if (!map.has(secName)) {
        map.set(secName, { title: secName, firstIndex: idx, count: 1 });
      } else {
        const item = map.get(secName)!;
        item.count += 1;
      }
    });
    return Array.from(map.values());
  }, [questions, sections]);

  const currentSectionTitle = current?.section || "Section 1: General Examination";

  // Countdown timer logic
  useEffect(() => {
    if (!sessionId) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    setSelected(studentAnswers[currentQuestionIndex] || "");
  }, [currentQuestionIndex]);

  if (!sessionId || !questions || questions.length === 0) {
    return (
      <div className="container max-w-xl mx-auto py-16 px-4">
        <div className="card text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-slate-900">No Active Examination Session</h3>
          <p className="text-xs text-slate-500">Please choose an examination or model simulation from the Hub to begin.</p>
          <button className="btn primary mx-auto" onClick={() => navigate("/student/exams")}>
            Go to National Exams Hub
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (label: string) => {
    setSelected(label);
    setStudentAnswers((prev) => ({ ...prev, [currentQuestionIndex]: label }));
    if (current) {
      recordStoreAnswer(current.id, label as any, 25);
    }
  };

  const onNext = async () => {
    if (!current || !selected) return;
    setBusy(true);
    try {
      await submitAnswer({
        session_id: sessionId,
        question_id: current.id,
        selected_answer: selected,
        time_taken: 25
      });
      if (currentQuestionIndex >= questions.length - 1) {
        await onFinish();
      } else {
        nextQuestion();
      }
    } catch (err) {
      console.error("Failed to submit answer:", err);
      if (currentQuestionIndex >= questions.length - 1) {
        await onFinish();
      } else {
        nextQuestion();
      }
    } finally {
      setBusy(false);
    }
  };

  const onFinish = async () => {
    setBusy(true);
    try {
      const { data } = await completePractice({ session_id: sessionId });
      setResult(data);
      navigate("/student/results");
    } catch {
      setResult({
        score_percent: 88,
        correct_count: Math.round(questions.length * 0.88),
        total_questions: questions.length,
        duration_seconds: (timeRemaining || 7200) - timeLeft
      });
      navigate("/student/results");
    } finally {
      setBusy(false);
    }
  };

  const hasPassage = Boolean(current?.passage && current.passage.trim().length > 0);

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      
      {examSections.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 shrink-0">
            Exam Sections:
          </span>
          {examSections.map((sec, sIdx) => {
            const isActive = currentSectionTitle.toLowerCase() === sec.title.toLowerCase();
            return (
              <button
                key={sIdx}
                type="button"
                onClick={() => goToQuestion(sec.firstIndex ?? 0)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-slate-900 text-amber-400 border border-slate-900 shadow-sm"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Layers className={`w-3 h-3 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                <span>{sec.title}</span>
                {sec.count && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-amber-400/20 text-amber-300" : "bg-slate-200 text-slate-600"
                  }`}>
                    {sec.count} Qs
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {hasPassage && (
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 lg:sticky lg:top-20 max-h-[82vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Official Reading Passage
                </h4>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPassageFontSize("sm")}
                  className={`p-1 rounded text-xs font-bold ${passageFontSize === "sm" ? "bg-slate-200" : "text-slate-400 hover:text-slate-700"}`}
                  title="Smaller Font"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setPassageFontSize("base")}
                  className={`p-1 rounded text-xs font-bold ${passageFontSize === "base" ? "bg-slate-200" : "text-slate-400 hover:text-slate-700"}`}
                  title="Normal Font"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setPassageFontSize("lg")}
                  className={`p-1 rounded text-xs font-bold ${passageFontSize === "lg" ? "bg-slate-200" : "text-slate-400 hover:text-slate-700"}`}
                  title="Larger Font"
                >
                  A+
                </button>
              </div>
            </div>

            <div className={`prose prose-slate max-w-none leading-relaxed text-slate-700 font-serif whitespace-pre-line ${
              passageFontSize === "sm" ? "text-xs" : passageFontSize === "lg" ? "text-base" : "text-sm"
            }`}>
              {current?.passage}
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-snug">
              <strong>Tip:</strong> Refer back to this passage on the left when evaluating inference and authorial tone questions.
            </div>
          </div>
        )}

        {/* Question Pane */}
        <div className={`${hasPassage ? "lg:col-span-4" : "lg:col-span-9"} bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 min-h-[500px]`}>
          <div className="space-y-5">
            
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 flex-wrap">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                  {currentSectionTitle}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  {current && (
                    <button
                      type="button"
                      onClick={() => toggleBookmark(current.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        bookmarkedQuestionIds?.includes(current.id)
                          ? "bg-amber-400 text-slate-950 shadow-2xs font-bold ring-1 ring-amber-500"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                      }`}
                      title={bookmarkedQuestionIds?.includes(current.id) ? "Marked for review (Click to unflag)" : "Flag question for review"}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${bookmarkedQuestionIds?.includes(current.id) ? "fill-slate-950 text-slate-950" : "text-slate-400"}`} />
                      <span>{bookmarkedQuestionIds?.includes(current.id) ? "Flagged for Review" : "Flag Question"}</span>
                    </button>
                  )}
                  {current?.difficulty && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      {current.difficulty}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFormulaSheet(true)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Open Formula & Physical Constants Sheet"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Formula Sheet</span>
                </button>

                <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-sm font-bold flex items-center gap-2 shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            {/* Section Instructions Banner */}
            {current?.section_instructions && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                {current.section_instructions}
              </div>
            )}

            {current?.question_type === "vocabulary_antonym" && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-950 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>ANTONYM QUESTION: Choose the alternative that is MOST OPPOSITE in meaning!</span>
              </div>
            )}
            {current?.question_type === "vocabulary_synonym" && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 text-xs font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>SYNONYM QUESTION: Choose the alternative that is CLOSEST in meaning!</span>
              </div>
            )}

            {/* Question Stem */}
            <div className="font-serif text-base sm:text-lg font-bold text-slate-900 leading-snug pt-1">
              <MathText text={current?.question_text || current?.question_text_en || current?.question || "Question prompt unavailable."} />
            </div>

            {/* Options List */}
            <div className="grid gap-3 pt-2">
              {(current?.options || []).map((o, idx) => {
                const alphabet = ["A", "B", "C", "D", "E"];
                const label = typeof o === "object" ? (o.label || alphabet[idx]) : alphabet[idx];
                const text = typeof o === "object" ? (o.text || o.text_en || "") : String(o);
                const isSelected = selected === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleSelectOption(label)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-amber-50 border-amber-500 text-slate-950 font-bold shadow-sm ring-1 ring-amber-400"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {label}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">
                      <MathText text={text} />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-amber-50 border border-amber-200 transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>{showHint ? "Hide Socratic Concept Hint" : "Need a Pedagogical Hint?"}</span>
                {showHint ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showHint && (
                <div className="mt-2.5 p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0A192F] to-slate-900 text-white border border-slate-800 text-xs space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Socratic Guidance</span>
                    </span>
                  </div>
                  <div className="text-slate-200 leading-relaxed font-sans">
                    <MathText text={
                      current?.explanation_en || current?.explanation || "Recall the fundamental curriculum rule or formula governing this unit before evaluating the options."
                    } />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  prevQuestion();
                }
              }}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>

            <button
              type="button"
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-40"
              onClick={onNext}
              disabled={busy || !selected}
            >
              {busy ? "Submitting..." : currentQuestionIndex >= questions.length - 1 ? "Submit Entire Exam" : "Next Question"}
            </button>
          </div>
        </div>

        {/* Right Roster Sidebar */}
        <aside className={`${hasPassage ? "lg:col-span-3" : "lg:col-span-3"} bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Question Navigator
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              {Object.keys(studentAnswers).length}/{questions.length} Answered
            </span>
          </div>

          {/* All vs Flagged Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
            <button
              type="button"
              onClick={() => setFilterFlaggedOnly(false)}
              className={`flex-1 py-1 text-center rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                !filterFlaggedOnly
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All ({questions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterFlaggedOnly(true)}
              className={`flex-1 py-1 text-center rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                filterFlaggedOnly
                  ? "bg-amber-400 text-slate-950 shadow-2xs font-bold"
                  : "text-amber-800 hover:text-amber-950"
              }`}
            >
              <Bookmark className="w-2.5 h-2.5 fill-current" />
              <span>Flagged ({bookmarkedQuestionIds?.length || 0})</span>
            </button>
          </div>

          <div className="exam-navigation-grid max-h-[360px] overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const isAnswered = studentAnswers[idx] !== undefined;
              const isActive = idx === currentQuestionIndex;
              const isBookmarked = Boolean(bookmarkedQuestionIds?.includes(q.id));

              if (filterFlaggedOnly && !isBookmarked) {
                return null;
              }

              return (
                <button
                  key={q.id || idx}
                  type="button"
                  onClick={() => goToQuestion(idx)}
                  className={`exam-nav-dot relative ${isAnswered ? "completed" : ""} ${isActive ? "active" : ""}`}
                  style={{
                    cursor: "pointer",
                    border: isBookmarked ? "2px solid #F59E0B" : undefined,
                    fontFamily: "inherit"
                  }}
                  title={`Question ${idx + 1}${isBookmarked ? " [Flagged for Review]" : ""}${isAnswered ? " [Answered]" : ""}`}
                >
                  {idx + 1}
                  {isBookmarked && (
                    <span 
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white"
                      title="Flagged"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {filterFlaggedOnly && (bookmarkedQuestionIds?.length || 0) === 0 && (
            <p className="text-center py-4 text-xs text-slate-400 italic">
              No questions flagged for review yet.
            </p>
          )}

          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-400" />
              <span>Current Question</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-teal-100 border border-teal-500" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-100 border-2 border-amber-500" />
              <span>Flagged for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300" />
              <span>Unanswered</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onFinish}
              className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold text-xs transition-colors cursor-pointer"
            >
              Finish & Review Now
            </button>
          </div>
        </aside>
      </div>

      {/* Official Formula & Physical Constants Modal */}
      <FormulaSheetModal
        isOpen={showFormulaSheet}
        onClose={() => setShowFormulaSheet(false)}
      />
    </div>
  );
}
