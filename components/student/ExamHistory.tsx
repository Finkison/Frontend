import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExamHistory } from "../../services/studentService";
import { 
  FileCheck2, 
  Calendar, 
  Clock, 
  Sparkles
} from "lucide-react";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import PortalLoading from "../shared/PortalLoading";
import PortalError from "../shared/PortalError";

interface ExamRecord {
  id: string;
  title: string;
  type: string;
  stream: string;
  score: number;
  max_score: number;
  accuracy_percent: number | null;
  recorded_at: string;
  duration_minutes: number | null;
  status: string;
  subject_scores?: Record<string, number>;
}

export default function ExamHistory(): React.ReactElement {
  const navigate = useNavigate();
  const [records, setRecords] = useState<ExamRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setLoading(true);
    getExamHistory()
      .then((res) => {
        setLoadError(false);
        setRecords(res.data || []);
      })
      .catch(() => { setRecords([]); setLoadError(true); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PortalPage className="max-w-5xl space-y-6">

      <PageHeader
        eyebrow="Assessments"
        title="Exam history"
        description="Review your submitted exam results."
        primaryAction={{ label: "Take exam", href: "/student/exams", icon: Sparkles }}
      />

      {loading ? (
        <PortalLoading message="Loading exam history…" />
      ) : loadError ? (
        <PortalError message="Exam history could not be loaded." onAction={() => window.location.reload()} />
      ) : records.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200 dark:border-white/10">
          <p className="text-sm font-bold text-stone-800 dark:text-[#FDFBF7]">No submitted exam sessions yet</p>
          <p className="text-xs text-stone-500 dark:text-[#A89C90] mt-1">Your submitted results will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((rec) => {
            const recordedAt = new Date(rec.recorded_at);
            const dateStr = Number.isNaN(recordedAt.getTime()) ? "Date not available" : recordedAt.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric"
            });

            return (
              <div
                key={rec.id}
                className="bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200/90 dark:border-white/10 p-6 shadow-xs hover:border-stone-300 dark:hover:border-white/20 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] dark:text-[#FBBF24] text-[10px] font-bold uppercase tracking-wider">
                        {rec.type}
                      </span>
                      <span className="text-xs text-stone-400 dark:text-[#A89C90]">&bull;</span>
                      {rec.stream && <span className="text-xs text-stone-500 dark:text-[#A89C90] font-medium">{rec.stream}</span>}
                    </div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-[#FDFBF7]">{rec.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-stone-400 dark:text-[#A89C90] mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Recorded {dateStr}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {rec.duration_minutes == null ? "Duration not recorded" : `${rec.duration_minutes} mins`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-start sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-[#A89C90] block">
                        Exam score
                      </span>
                      <span className="font-sans text-2xl font-bold text-stone-900 dark:text-[#FDFBF7]">
                        {rec.score}{" "}
                        <span className="text-xs font-normal text-stone-400 dark:text-[#A89C90]">/ {rec.max_score}</span>
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 block">
                        {rec.accuracy_percent == null ? "Accuracy not available" : `${rec.accuracy_percent}% score ratio`}
                      </span>
                    </div>
                  </div>
                </div>

                {rec.subject_scores && Object.keys(rec.subject_scores).length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-100 dark:border-white/10 flex flex-wrap gap-2 text-xs">
                    {Object.entries(rec.subject_scores).map(([subj, sc]) => (
                      <span
                        key={subj}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#261E1A] border border-stone-200 dark:border-white/10 text-stone-700 dark:text-[#E7E0D6] font-medium text-[11px]"
                      >
                        <strong>{subj}:</strong> {sc} pts
                      </span>
                    ))}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </PortalPage>
  );
}
