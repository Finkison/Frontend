import React, { useEffect, useState, useCallback } from "react";
import { useLearningStore } from "../../store/learningStore";
import { Brain, Clock, Zap, CheckCircle, XCircle, ArrowRight, RotateCcw, Sparkles, Target } from "lucide-react";

export default function SpacedReview() {
  const {
    dueReviews,
    dueCount,
    reviewsLoading,
    fetchDueReviews,
    handleReviewSubmit,
  } = useLearningStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [startTime, setStartTime] = useState(Date.now());
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);

  useEffect(() => {
    fetchDueReviews();
  }, [fetchDueReviews]);

  const currentReview = dueReviews[currentIndex];
  const currentQuestion = currentReview?.questions?.[0];

  const handleAnswer = useCallback((answerIndex: number) => {
    if (showAnswer || !currentQuestion) return;
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
  }, [showAnswer, currentQuestion]);

  const handleRating = useCallback(async (rating: 1 | 2 | 3 | 4) => {
    if (!currentReview) return;

    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const confidence = selectedAnswer === currentQuestion?.correct_answer ? rating : 1;

    try {
      const result = await handleReviewSubmit(
        currentReview.concept_state_id,
        rating,
        timeTaken,
        confidence,
      );
      setFeedback(result.message);
      setReviewedCount(prev => prev + 1);
      setSessionXP(prev => prev + (rating >= 3 ? 15 : 5));

      setTimeout(() => {
        setShowAnswer(false);
        setSelectedAnswer(null);
        setFeedback("");
        setStartTime(Date.now());
        if (currentIndex < dueReviews.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          fetchDueReviews(); // Reload queue
          setCurrentIndex(0);
        }
      }, 1500);
    } catch {
      setFeedback("❌ Error submitting review. Please try again.");
    }
  }, [currentReview, currentQuestion, currentIndex, dueReviews.length, handleReviewSubmit, fetchDueReviews, selectedAnswer, startTime]);

  // Loading state
  if (reviewsLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Brain className="w-12 h-12 text-purple-500 animate-pulse mx-auto" />
          <p className="text-slate-600">Loading your review queue...</p>
        </div>
      </div>
    );
  }

  if (dueCount === 0 || !currentReview) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 text-center border border-emerald-200">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">
            🎉 All Reviews Complete!
          </h2>
          <p className="text-emerald-700 mb-1">
            You've reviewed everything due today. Your memory is getting stronger!
          </p>
          {reviewedCount > 0 && (
            <p className="text-sm text-emerald-600 mt-3">
              Session: {reviewedCount} concepts reviewed · +{sessionXP} XP earned
            </p>
          )}
          <p className="text-xs text-emerald-500 mt-4">
            New reviews will appear as your spaced repetition schedule progresses.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Spaced Review</h1>
            <p className="text-xs text-slate-500">
              {dueCount} concepts due · {reviewedCount} reviewed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-amber-600">+{sessionXP} XP</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, (reviewedCount / Math.max(1, dueCount)) * 100)}%` }}
        />
      </div>

      {/* Concept info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            {currentReview.subject}
          </span>
          <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
            Mastery: {Math.round(currentReview.mastery_level * 100)}%
          </span>
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
            Review #{currentReview.review_count + 1}
          </span>
        </div>

        <h2 className="text-lg font-bold text-slate-900 mb-1">
          {currentReview.concept_name}
        </h2>
        {currentReview.concept_name_am && (
          <p className="text-sm text-slate-500 mb-4">{currentReview.concept_name_am}</p>
        )}

        {/* Question */}
        {currentQuestion && (
          <div className="mt-4 space-y-3">
            <p className="text-slate-800 font-medium leading-relaxed">
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
                  classes += "bg-blue-50 border-blue-400 text-blue-800";
                } else {
                  classes += "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={showAnswer}
                    className={classes}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
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
        )}
      </div>

      {showAnswer && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <p className="text-sm font-bold text-slate-700 text-center">
            How well did you recall this concept?
          </p>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleRating(1)}
              className="p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-center transition-all"
            >
              <RotateCcw className="w-5 h-5 text-red-500 mx-auto mb-1" />
              <span className="text-xs font-bold text-red-700 block">Again</span>
              <span className="text-[10px] text-red-400">~1 min</span>
            </button>
            <button
              onClick={() => handleRating(2)}
              className="p-3 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-center transition-all"
            >
              <Target className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <span className="text-xs font-bold text-orange-700 block">Hard</span>
              <span className="text-[10px] text-orange-400">~1 day</span>
            </button>
            <button
              onClick={() => handleRating(3)}
              className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-center transition-all"
            >
              <CheckCircle className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <span className="text-xs font-bold text-blue-700 block">Good</span>
              <span className="text-[10px] text-blue-400">~3 days</span>
            </button>
            <button
              onClick={() => handleRating(4)}
              className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-center transition-all"
            >
              <Sparkles className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <span className="text-xs font-bold text-emerald-700 block">Easy</span>
              <span className="text-[10px] text-emerald-400">~7 days</span>
            </button>
          </div>
          {feedback && (
            <p className="text-center text-sm text-slate-600 mt-2 animate-fade-in">
              {feedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
