import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLearningStore } from "../../store/learningStore";
import { Brain, CheckCircle, XCircle, RotateCcw, Sparkles, Target, RefreshCw } from "lucide-react";
import PortalPage from "../shared/PortalPage";

export default function SpacedReview() {
  const {
    dueReviews,
    dueCount,
    reviewsLoading,
    reviewQueueError,
    fetchDueReviews,
    handleReviewSubmit,
  } = useLearningStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [startTime, setStartTime] = useState(Date.now());
  const [reviewedCount, setReviewedCount] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchDueReviews();
  }, [fetchDueReviews]);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  const currentReview = dueReviews[currentIndex];
  const currentQuestion = currentReview?.questions?.[0];
  const hasQuestionOptions = Boolean(currentQuestion && Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0);
  const queueReviewedCount = Math.min(dueCount, currentIndex + (ratingSubmitting ? 1 : 0));

  const handleAnswer = useCallback((answerIndex: number) => {
    if (showAnswer || !hasQuestionOptions) return;
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
  }, [showAnswer, hasQuestionOptions]);

  const handleRating = useCallback(async (rating: 1 | 2 | 3 | 4) => {
    if (!currentReview || ratingSubmitting) return;

    setRatingSubmitting(true);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const confidence = hasQuestionOptions
      ? (selectedAnswer === currentQuestion?.correct_answer ? rating : 1)
      : rating;

    try {
      const result = await handleReviewSubmit(
        currentReview.concept_state_id,
        rating,
        timeTaken,
        confidence,
      );
      setFeedback(result.message);
      setReviewedCount(prev => prev + 1);

      advanceTimer.current = setTimeout(async () => {
        if (currentIndex < dueReviews.length - 1) {
          setShowAnswer(false);
          setSelectedAnswer(null);
          setFeedback("");
          setStartTime(Date.now());
          setCurrentIndex(prev => prev + 1);
          setRatingSubmitting(false);
        } else {
          await fetchDueReviews();
          setCurrentIndex(0);
          setShowAnswer(false);
          setSelectedAnswer(null);
          setFeedback("");
          setStartTime(Date.now());
          setRatingSubmitting(false);
        }
      }, 1500);
    } catch {
      setFeedback("Could not submit review. Check connection and retry.");
      setRatingSubmitting(false);
    }
  }, [currentReview, currentQuestion, currentIndex, dueReviews.length, handleReviewSubmit, fetchDueReviews, selectedAnswer, startTime, ratingSubmitting, hasQuestionOptions]);

  if (reviewsLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Brain className="w-12 h-12 text-[#881337] dark:text-[#FBBF24] mx-auto" />
          <p className="text-stone-600 dark:text-[#E7E0D6]">Loading your review queue...</p>
        </div>
      </div>
    );
  }

  if (reviewQueueError) {
    return (
      <div className="mx-auto max-w-lg p-6">
        <div className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
          <h2 className="text-lg font-semibold text-rose-900 dark:text-rose-100">Review queue unavailable</h2>
          <p role="alert" className="text-sm text-rose-800 dark:text-rose-200">{reviewQueueError}</p>
          <button type="button" onClick={() => void fetchDueReviews()} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white hover:bg-[#9F1239]"><RefreshCw className="h-4 w-4" aria-hidden="true" />Try again</button>
        </div>
      </div>
    );
  }

  if (dueCount === 0 || !currentReview) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900/40 dark:bg-[#261E1A]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/50">
            <CheckCircle className="h-8 w-8 text-emerald-700 dark:text-emerald-300" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-emerald-950 dark:text-emerald-100">
            {reviewedCount > 0 ? "Review session complete" : "You’re all caught up"}
          </h2>
          <p className="mb-1 text-emerald-900 dark:text-emerald-200">
            {reviewedCount > 0 ? "You’ve reviewed every concept that was due in this session." : "You don’t have any concepts due for review right now."}
          </p>
          {reviewedCount > 0 && (
            <p className="mt-3 text-sm text-emerald-800 dark:text-emerald-200">
              Session: {reviewedCount} concept{reviewedCount === 1 ? "" : "s"} reviewed
            </p>
          )}
          <p className="mt-4 text-xs text-emerald-800/80 dark:text-emerald-200/80">
            Your next review dates are set from your study history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PortalPage className="max-w-2xl space-y-4">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFF1F2] dark:bg-[#4C0519]/40 border border-[#FECDD3] dark:border-[#881337]/50 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-[#881337] dark:text-[#FBBF24]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-900 dark:text-[#FDFBF7]">Spaced review</h1>
            <p className="text-xs text-stone-500 dark:text-[#A89C90]">
              {dueCount} concepts due · {reviewedCount} reviewed
            </p>
          </div>
        </div>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold tabular-nums text-stone-600 dark:bg-white/10 dark:text-[#E7E0D6]">{Math.max(0, dueCount - queueReviewedCount)} left in queue</span>
      </div>

      <div className="w-full bg-stone-200 dark:bg-white/10 rounded-full h-2" role="progressbar" aria-label="Review queue progress" aria-valuemin={0} aria-valuemax={dueCount} aria-valuenow={queueReviewedCount}>
        <div
          className="bg-[#881337] h-2 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, (queueReviewedCount / Math.max(1, dueCount)) * 100)}%` }}
        />
      </div>

      <div className="bg-white dark:bg-[#261E1A] rounded-2xl border border-stone-200 dark:border-white/10 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 bg-[#FFE4E6] dark:bg-[#4C0519]/50 text-[#881337] dark:text-[#FBBF24] text-xs font-medium rounded-full">
            {currentReview.subject}
          </span>
          <span className="px-2.5 py-0.5 bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24] text-xs font-medium rounded-full border border-[#FECDD3] dark:border-[#881337]/50">
            Mastery: {Math.round(currentReview.mastery_level * 100)}%
          </span>
          <span className="px-2.5 py-0.5 bg-stone-100 dark:bg-[#201815] text-stone-600 dark:text-[#E7E0D6] text-xs rounded-full">
            Review #{currentReview.review_count + 1}
          </span>
        </div>

        <h2 className="text-lg font-bold text-stone-900 dark:text-[#FDFBF7] mb-1">
          {currentReview.concept_name}
        </h2>
        {currentReview.concept_name_am && (
          <p className="text-sm text-stone-500 dark:text-[#A89C90] mb-4">{currentReview.concept_name_am}</p>
        )}

        {hasQuestionOptions && currentQuestion ? (
          <div className="mt-4 space-y-3">
            <p className="text-stone-800 dark:text-[#FDFBF7] font-medium leading-relaxed">
              {currentQuestion.question_text}
            </p>

            <div className="space-y-2 mt-4">
              {currentQuestion.options.map((option: string, idx: number) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQuestion.correct_answer;
                const showResult = showAnswer;

                let classes = "w-full p-3.5 rounded-xl border text-left text-sm font-medium transition-all ";
                if (showResult && isCorrect) {
                  classes += "bg-emerald-50 border-emerald-400 text-emerald-800";
                } else if (showResult && isSelected && !isCorrect) {
                  classes += "bg-red-50 border-red-400 text-red-800";
                } else if (isSelected) {
                  classes += "bg-[#FFF1F2] dark:bg-[#4C0519]/40 border-[#881337] text-[#881337] dark:text-[#FBBF24]";
                } else {
                  classes += "bg-white dark:bg-[#261E1A] border-stone-200 dark:border-white/10 text-stone-700 dark:text-[#E7E0D6] hover:border-[#FECDD3] hover:bg-[#FFF1F2] dark:hover:bg-[#4C0519]/50";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={showAnswer}
                    className={classes}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-stone-100 dark:bg-[#201815] flex items-center justify-center text-xs font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                      {showResult && isCorrect && <CheckCircle className="w-4 h-4 ml-auto text-emerald-600" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 ml-auto text-red-500" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-dashed border-stone-300 bg-[#FAF8F5] p-4 dark:border-white/15 dark:bg-[#1C1512]">
            <p className="text-sm leading-6 text-stone-600 dark:text-[#E7E0D6]">Review this concept from memory, then rate your recall.</p>
            <button type="button" onClick={() => { setSelectedAnswer(null); setFeedback(""); setShowAnswer(true); }} disabled={showAnswer} className="min-h-10 self-start rounded-lg bg-[#881337] px-4 text-xs font-semibold text-white hover:bg-[#9F1239] disabled:opacity-60">Rate my recall</button>
          </div>
        )}
      </div>

      {showAnswer && (
        <div className="bg-white dark:bg-[#261E1A] rounded-2xl border border-stone-200 dark:border-white/10 p-5 shadow-sm space-y-3">
          <p className="text-sm font-bold text-stone-700 dark:text-[#E7E0D6] text-center">
            How well did you recall this concept?
          </p>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleRating(1)}
              disabled={ratingSubmitting}
              className="p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-center transition-all disabled:cursor-wait disabled:opacity-60"
            >
              <RotateCcw className="w-5 h-5 text-red-500 mx-auto mb-1" />
              <span className="text-xs font-bold text-red-700 block">Again</span>
              <span className="text-[10px] text-red-500">Forgot this</span>
            </button>
            <button
              onClick={() => handleRating(2)}
              disabled={ratingSubmitting}
              className="p-3 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-center transition-all disabled:cursor-wait disabled:opacity-60"
            >
              <Target className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <span className="text-xs font-bold text-orange-700 block">Hard</span>
              <span className="text-[10px] text-orange-500">Difficult recall</span>
            </button>
            <button
              onClick={() => handleRating(3)}
              disabled={ratingSubmitting}
              className="p-3 rounded-xl bg-[#FFF1F2] dark:bg-[#4C0519]/40 hover:bg-[#FFE4E6] dark:hover:bg-[#4C0519]/60 border border-[#FECDD3] dark:border-[#881337]/50 text-center transition-all disabled:cursor-wait disabled:opacity-60"
            >
              <CheckCircle className="w-5 h-5 text-[#881337] dark:text-[#FBBF24] mx-auto mb-1" />
              <span className="text-xs font-bold text-[#881337] dark:text-[#FBBF24] block">Good</span>
              <span className="text-[10px] text-[#5C5046] dark:text-[#FBBF24]">Recalled with effort</span>
            </button>
            <button
              onClick={() => handleRating(4)}
              disabled={ratingSubmitting}
              className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-center transition-all disabled:cursor-wait disabled:opacity-60"
            >
              <Sparkles className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <span className="text-xs font-bold text-emerald-700 block">Easy</span>
              <span className="text-[10px] text-emerald-600">Recalled easily</span>
            </button>
          </div>
          {feedback && (
            <p role="status" className="text-center text-sm text-stone-600 dark:text-[#E7E0D6] mt-2">
              {feedback}
            </p>
          )}
        </div>
      )}
    </PortalPage>
  );
}
