import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExamHistory } from "../../services/studentService";
import { 
  FileCheck2, 
  Calendar, 
  Clock, 
  Award, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2 
} from "lucide-react";

interface ExamRecord {
  id: string;
  title: string;
  type: string;
  stream: string;
  score: number;
  max_score: number;
  accuracy_percent: number;
  completed_at: string;
  duration_minutes: number;
  status: string;
  subject_scores?: Record<string, number>;
}

export default function ExamHistory(): React.ReactElement {
  const navigate = useNavigate();
  const [records, setRecords] = useState<ExamRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getExamHistory()
      .then((res) => {
        setRecords(res.data || []);
      })
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 text-xs font-semibold border border-blue-500/20 mb-2">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Assessment Archive</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Exam History & Diagnostic Results
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Inspect historical entrance mock exams, timed past papers, and adaptive diagnostics with full question analysis.
            </p>
          </div>

          <button
            onClick={() => navigate("/student/exams")}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Take New Mock Exam</span>
          </button>
        </div>
      </div>

      {/* History List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading diagnostic exam archive...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <p className="text-sm font-bold text-slate-800">No completed exams recorded yet.</p>
          <p className="text-xs text-slate-500 mt-1">Complete a mock simulation or past paper to view your archive.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((rec) => {
            const dateStr = new Date(rec.completed_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            });

            return (
              <div
                key={rec.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                        {rec.type}
                      </span>
                      <span className="text-xs text-slate-400">&bull;</span>
                      <span className="text-xs text-slate-500 font-medium">{rec.stream}</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{rec.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {dateStr}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {rec.duration_minutes} mins
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-start sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Diagnostic Score
                      </span>
                      <span className="font-serif text-2xl font-bold text-slate-900">
                        {rec.score}{" "}
                        <span className="text-xs font-normal text-slate-400">/ {rec.max_score}</span>
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 block">
                        {rec.accuracy_percent}% Accuracy
                      </span>
                    </div>
                  </div>
                </div>

                {rec.subject_scores && (
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-wrap gap-2 text-xs">
                    {Object.entries(rec.subject_scores).map(([subj, sc]) => (
                      <span
                        key={subj}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium text-[11px]"
                      >
                        <strong>{subj}:</strong> {sc} pts
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => navigate("/student/results")}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Detailed Question Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
