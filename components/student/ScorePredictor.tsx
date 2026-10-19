import React, { useEffect, useState } from "react";
import { getScoreTrajectory, updateStudentProfile } from "../../services/studentService";
import { useToast } from "../ui/Toast";
import useAuthStore from "../../store/authStore";
import { 
  TrendingUp, 
  Target, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Sliders, 
  Save, 
  GraduationCap, 
  ArrowUpRight 
} from "lucide-react";

export default function ScorePredictor(): React.ReactElement {
  const { showToast } = useToast();
  const user = useAuthStore((s) => s.user);

  const [predictedScore, setPredictedScore] = useState(user?.currentPredictedScore || 0);
  const [targetScore, setTargetScore] = useState(user?.targetScore || 500);
  const [accuracySim, setAccuracySim] = useState(82);
  const [savingTarget, setSavingTarget] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getScoreTrajectory()
      .then((res) => {
        if (res.data && typeof res.data === "object") {
          setPredictedScore(res.data.current_predicted_score ?? (user?.currentPredictedScore || 0));
          setTargetScore(res.data.target_score ?? (user?.targetScore || 500));
        }
      })
      .catch(() => {
        setPredictedScore(user?.currentPredictedScore || 0);
        setTargetScore(user?.targetScore || 500);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const simulatedScore = Math.min(600, Math.round((accuracySim / 100) * 600));
  const completionPercent = Math.min(100, Math.round((predictedScore / targetScore) * 100));
  const percentileRank = Math.min(99.9, Math.max(50, (simulatedScore / 600) * 100)).toFixed(1);
  const topPercent = Math.max(0.1, +(100 - Number(percentileRank)).toFixed(1));

  const handleSaveGoal = async () => {
    setSavingTarget(true);
    try {
      await updateStudentProfile({ target_score: targetScore });
      showToast({
        type: "success",
        title: "Target Score Updated",
        message: `Your entrance examination target is set to ${targetScore} / 600.`
      });
    } catch {
      showToast({
        type: "error",
        title: "Failed to Save Goal",
        message: "Unable to sync target score with your profile."
      });
    } finally {
      setSavingTarget(false);
    }
  };

  const isSocial = user?.stream?.toLowerCase().includes("social");
  const isGeneral = user?.grade && (user.grade.includes("9") || user.grade.includes("10"));

  const subjectBreakdown = isSocial
    ? [
        { subject: "Mathematics", current: 80, target: 90, stream: "Core" },
        { subject: "History", current: 84, target: 92, stream: "Social" },
        { subject: "Geography", current: 78, target: 88, stream: "Social" },
        { subject: "Economics", current: 82, target: 90, stream: "Social" },
        { subject: "English", current: 90, target: 95, stream: "Common" },
        { subject: "Scholastic Aptitude (SAT)", current: 84, target: 90, stream: "Common" }
      ]
    : isGeneral
    ? [
        { subject: "Mathematics", current: 82, target: 90, stream: "Foundation" },
        { subject: "Physics", current: 75, target: 85, stream: "Foundation" },
        { subject: "Chemistry", current: 70, target: 85, stream: "Foundation" },
        { subject: "Biology", current: 85, target: 92, stream: "Foundation" },
        { subject: "History & Geography", current: 80, target: 90, stream: "Foundation" },
        { subject: "English", current: 88, target: 94, stream: "Common" }
      ]
    : [
        { subject: "Mathematics", current: 82, target: 90, stream: "Core" },
        { subject: "Physics", current: 74, target: 85, stream: "Natural" },
        { subject: "Chemistry", current: 65, target: 80, stream: "Natural" },
        { subject: "Biology", current: 85, target: 92, stream: "Natural" },
        { subject: "English", current: 90, target: 95, stream: "Common" },
        { subject: "Scholastic Aptitude (SAT)", current: 82, target: 88, stream: "Common" }
      ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold border border-emerald-500/20 mb-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Score Analytics</span>
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Score predictor
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Projected EUEE scaled score based on practice accuracy and item difficulty.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
              Grade 12 Scale
            </span>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Predicted Score
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-sans text-3xl font-bold text-slate-900">
                {predictedScore}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 600</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
              Top {topPercent}% Nationally
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">
              Target Score
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-sans text-3xl font-bold text-slate-950">
                {targetScore}
              </span>
              <span className="text-xs font-semibold text-amber-800">/ 600</span>
            </div>
            <span className="text-[11px] text-amber-900 font-semibold block mt-1">
              {Math.max(0, targetScore - predictedScore)} points to goal
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Target Progress
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-sans text-3xl font-bold text-blue-700">
                {completionPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 mt-2 overflow-hidden">
              <div
                className="h-full bg-[#1D4ED8] rounded-full"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7-Subject Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans text-xl font-bold text-slate-900">
              Subject Breakdown
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Estimated performance across examined subjects.
            </p>
          </div>
          <GraduationCap className="w-5 h-5 text-slate-400" />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Track</th>
                <th className="py-3 px-4">Predicted</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4 text-right">Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjectBreakdown.map((s) => (
                <tr key={s.subject} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{s.subject}</td>
                  <td className="py-3 px-4 text-slate-500">{s.stream}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800">{s.current} pts</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-amber-800">{s.target} pts</span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-700">
                    +{s.target - s.current} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Simulator */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-400 text-xs font-semibold mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Admission Simulator</span>
            </div>
            <h3 className="font-sans text-2xl font-bold">
              Simulate topic accuracy vs national score
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Adjust the daily practice accuracy slider to model how mastering core units increases your entrance exam standing.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Simulated Score
            </span>
            <span className="font-sans text-3xl font-bold text-amber-400 mt-1 block">
              {simulatedScore} / 600
            </span>
            <span className="text-[11px] text-slate-300">
              Percentile: Top {topPercent}%
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Overall Diagnostic Accuracy: {accuracySim}%</span>
            <span>Scale: 40% &ndash; 100%</span>
          </div>
          <input
            type="range"
            min={40}
            max={100}
            value={accuracySim}
            onChange={(e) => setAccuracySim(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
          />
        </div>

        <div className="pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label htmlFor="targetGoal" className="text-xs font-bold text-slate-300 shrink-0 uppercase">
              Set Your Target Goal:
            </label>
            <input
              id="targetGoal"
              type="number"
              min={350}
              max={600}
              value={targetScore}
              onChange={(e) => setTargetScore(Number(e.target.value))}
              className="w-28 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm text-center outline-none focus:border-amber-400"
            />
          </div>

          <button
            onClick={handleSaveGoal}
            disabled={savingTarget}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>{savingTarget ? "Saving Goal..." : "Save Goal to Profile"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
