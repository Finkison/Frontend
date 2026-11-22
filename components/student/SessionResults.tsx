import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSessionStore from "../../store/sessionStore";
import { CheckCircle2, Bot } from "lucide-react";
import PortalPage from "../shared/PortalPage";

export default function SessionResults() {
  const navigate = useNavigate();
  const { result, questions, endSession } = useSessionStore();
  const [openExplanations, setOpenExplanations] = useState<Record<number, boolean>>({});

  if (!result) {
    return (
      <PortalPage className="max-w-4xl">
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
          <h3 className="text-xl font-semibold text-stone-900 dark:text-[#FDFBF7]">No results yet</h3>
          <p className="mt-2 mb-5 text-sm text-stone-600 dark:text-[#A89C90]">Finish a practice session or exam to see your results.</p>
          <button className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#881337] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9F1239]" onClick={() => navigate("/student/practice")}>Start practice</button>
        </div>
      </PortalPage>
    );
  }

  const reviewQuestions = result.questions?.length ? result.questions : questions;
  const scorePercent = Number(result.score_percent) || 0;
  const durationSeconds = Number(result.duration_seconds) || 0;
  const radius = 50;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (scorePercent / 100) * circumference;

  const toggleExplanation = (index: number) => {
    setOpenExplanations((current) => ({ ...current, [index]: !current[index] }));
  };

  const handleFinish = () => {
    endSession();
    navigate("/student");
  };

  return (
    <PortalPage className="max-w-4xl">
      <div className="grid gap-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:grid-cols-[1fr_auto] sm:p-8">
        <div>
          <h2 className="text-xl font-semibold text-stone-900 dark:text-[#FDFBF7]">Session completed</h2>
          <p className="mt-1 mb-4 text-sm text-stone-600 dark:text-[#A89C90]">Your score and answer review.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-stone-50 p-3 dark:bg-[#1C1512]">
              <span className="text-xs text-stone-500 dark:text-[#A89C90]">Correct answers</span>
              <h4 className="mt-1 text-xl font-semibold text-emerald-700 dark:text-emerald-300">
                {result.correct_count} / {result.total_questions}
              </h4>
            </div>
            <div className="rounded-lg bg-stone-50 p-3 dark:bg-[#1C1512]">
              <span className="text-xs text-stone-500 dark:text-[#A89C90]">Time spent</span>
              <h4 className="mt-1 text-xl font-semibold text-stone-900 dark:text-[#FDFBF7]">
                {durationSeconds > 0 ? `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s` : "Not recorded"}
              </h4>
            </div>
          </div>
        </div>

        <div className="score-circle-container flex-col">
          <svg height={120} width={120} className="score-circle-svg" aria-label={`${scorePercent}% accuracy`}>
            <circle className="score-circle-bg" cx={60} cy={60} r={normalizedRadius} />
            <circle
              className="score-circle-progress"
              cx={60}
              cy={60}
              r={normalizedRadius}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset }}
            />
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" transform="rotate(90 60 60)" className="fill-stone-900 text-[22px] font-bold dark:fill-[#FDFBF7]">
              {scorePercent}%
            </text>
          </svg>
          <span className="mt-2 text-[11px] font-bold text-stone-500 dark:text-[#A89C90]">ACCURACY</span>
        </div>
      </div>

      <h3 className="mb-3 text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">Answer review</h3>
      {reviewQuestions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 p-6 text-sm text-stone-600 dark:border-white/15 dark:text-[#A89C90]">
          No answer details were recorded for this session.
        </div>
      ) : (
        <div className="mb-6 grid gap-4">
          {reviewQuestions.map((q, idx) => {
            const hasAnswer = q.selected_answer !== null && q.selected_answer !== undefined && q.selected_answer !== "";
            const isCorrect = q.is_correct === true;
            const labels = ["A", "B", "C", "D", "E"];
            const rawSelection = String(q.selected_answer ?? "");
            const selectedLabel = /^\d+$/.test(rawSelection) ? labels[Number(rawSelection)] : rawSelection.toUpperCase();
            const correctIndex = Number.isInteger(q.correct_answer) ? q.correct_answer : q.correctAnswer;

            return (
              <article key={q.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <span className="text-sm font-bold text-stone-900 dark:text-[#FDFBF7]">Question {idx + 1}</span>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${isCorrect ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200" : hasAnswer ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-200" : "border-stone-200 bg-stone-50 text-stone-600 dark:border-white/10 dark:bg-white/5 dark:text-[#A89C90]"}`}>
                    {isCorrect ? "Correct" : hasAnswer ? "Incorrect" : "Unanswered"}
                  </span>
                </div>
                <p className="mb-3 font-medium text-stone-800 dark:text-[#E7E0D6]">
                  {q.question_text_en || q.question_text || q.question || "Question text unavailable."}
                </p>
                <div className="mb-4 grid gap-1.5 text-sm">
                  {(q.options || []).map((option, optionIndex) => {
                    const optionLabel = typeof option === "object" ? (option.label || labels[optionIndex]) : labels[optionIndex];
                    const optionText = typeof option === "object" ? (option.text || option.text_en || "") : String(option);
                    const isCorrectOption = optionLabel === q.correct_label || optionIndex === correctIndex;
                    const isSelectedOption = optionLabel === selectedLabel;
                    return (
                      <div key={optionLabel} className={`rounded-lg border p-2 ${isCorrectOption ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200" : isSelectedOption ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200" : "border-transparent text-stone-600 dark:text-[#A89C90]"}`}>
                        <span>{optionLabel}. {optionText}</span>
                        {isCorrectOption && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline ml-1.5" />}
                        {isSelectedOption && <span className="ml-1.5 text-[11px]">Your answer</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" className="inline-flex min-h-10 items-center rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 hover:bg-stone-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5" onClick={() => toggleExplanation(idx)}>
                    {openExplanations[idx] ? "Hide explanation" : "Show explanation"}
                  </button>
                  <button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-emerald-200 px-3 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-200 dark:hover:bg-emerald-950/30" onClick={() => navigate("/student/ai-tutor")}>
                      <Bot className="w-3.5 h-3.5" />
                      Ask tutor
                  </button>
                </div>
                {openExplanations[idx] && (
                  <div className="mt-3 rounded-lg border-l-4 border-[#FBBF24] bg-amber-50 p-3 text-sm leading-6 text-amber-950 dark:bg-amber-950/20 dark:text-amber-100">
                    <strong>Explanation</strong>
                    <p className="mt-1">
                      {q.explanation_en || q.explanation || "No explanation is available for this question yet."}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap justify-end gap-3">
        <button className="inline-flex min-h-11 items-center justify-center rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5" onClick={() => navigate("/student/practice")}>Practice again</button>
        <button className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#881337] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9F1239]" onClick={handleFinish}>Return to dashboard</button>
      </div>
    </PortalPage>
  );
}
