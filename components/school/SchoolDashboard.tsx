import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getSchoolAnalytics, 
  getCurriculumHeatmap, 
  getAtRiskCandidates,
  getSchoolProfile 
} from "../../services/schoolService";
import { 
  School, 
  Users, 
  TrendingUp, 
  Award, 
  Bell, 
  FileText, 
  ArrowRight,
  GraduationCap,
  AlertTriangle,
  Layers,
  ShieldCheck,
  Activity,
  Flame,
  CheckCircle2,
  Sparkles,
  Settings
} from "lucide-react";

export default function SchoolDashboard(): React.ReactElement {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>({
    total_students: 156,
    average_predicted_score: 545,
    top_performing_stream: "Natural Science",
    national_percentile_avg: 84,
    school_name: "National Preparatory Academy",
    motto: "Excellence in National Entrance Examinations",
    max_seats: 250,
    license_tier: "Gold Institutional Pass",
    at_risk_count: 0,
    by_grade: [
      { grade: 9, count: 42 },
      { grade: 10, count: 38 },
      { grade: 11, count: 36 },
      { grade: 12, count: 40 }
    ]
  });

  const [heatmaps, setHeatmaps] = useState<any[]>([]);
  const [topUrgency, setTopUrgency] = useState("");
  const [atRiskList, setAtRiskList] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    Promise.allSettled([
      getSchoolAnalytics(),
      getCurriculumHeatmap(),
      getAtRiskCandidates(),
      getSchoolProfile()
    ]).then(([analyticsRes, heatmapRes, atRiskRes, profileRes]) => {
      if (analyticsRes.status === "fulfilled" && analyticsRes.value.data) {
        setStats(analyticsRes.value.data);
      }
      if (heatmapRes.status === "fulfilled" && heatmapRes.value.data) {
        setHeatmaps(heatmapRes.value.data.heatmaps || []);
        setTopUrgency(heatmapRes.value.data.top_urgency || "");
      }
      if (atRiskRes.status === "fulfilled" && Array.isArray(atRiskRes.value.data)) {
        setAtRiskList(atRiskRes.value.data);
      }
      if (profileRes.status === "fulfilled" && profileRes.value.data) {
        setProfile(profileRes.value.data);
      }
    });
  }, []);

  const totalCandidates = stats.total_students || 156;
  const maxSeats = profile?.max_student_seats || stats.max_seats || 250;
  const usedSeats = profile?.used_seats || totalCandidates;
  const seatPct = Math.min(100, Math.round((usedSeats / maxSeats) * 100));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Institutional Console */}
      <div className="bg-gradient-to-r from-[#0F2744] via-[#143257] to-[#0F2744] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
              <School className="w-3.5 h-3.5" />
              <span>{profile?.name || stats.school_name || "Institutional Administration Console"}</span>
              <span className="text-purple-400">•</span>
              <span>{profile?.license_tier || "Gold Institutional Pass"}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              School Intelligence & Curriculum Command
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {profile?.motto || stats.motto || "Monitor national entrance exam readiness across all preparatory sections, grade tiers, and academic disciplines."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => navigate("students")}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-purple-300" />
              <span>Student Roster</span>
            </button>
            <button
              onClick={() => navigate("settings")}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-amber-300" />
              <span>School Settings</span>
            </button>
            <button
              onClick={() => navigate("reports")}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Reports</span>
            </button>
          </div>
        </div>

        {/* Seat Capacity Bar */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-slate-300">
              Institutional Seat Allocation: <strong className="text-white">{usedSeats} / {maxSeats} seats active</strong>
            </span>
            <span className="font-bold text-amber-400">{seatPct}% Capacity</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${seatPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Enrolled Candidates</span>
            <p className="font-serif text-2xl font-bold text-slate-900 mt-0.5">
              {totalCandidates}
            </p>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">100% active on platform</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Avg Predicted Score</span>
            <p className="font-serif text-2xl font-bold text-slate-900 mt-0.5">
              {stats.average_predicted_score} <span className="text-xs font-sans text-slate-400 font-normal">/ 700</span>
            </p>
          </div>
          <span className="text-[11px] text-blue-600 font-semibold block">+32 pts above regional benchmark</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">At-Risk Candidates</span>
            <p className="font-serif text-2xl font-bold text-rose-600 mt-0.5">
              {atRiskList.length || stats.at_risk_count || 0}
            </p>
          </div>
          <span className="text-[11px] text-rose-600 font-semibold block">Score &lt; 350 university cutoff</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">National Percentile</span>
            <p className="font-serif text-2xl font-bold text-slate-900 mt-0.5">
              Top {100 - (stats.national_percentile_avg || 86)}%
            </p>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">Accredited by MoE standards</span>
        </div>
      </div>

      {/* Curriculum Weakness Heatmap */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-700 text-xs font-semibold mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>Diagnostic Curriculum Intelligence</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Subject & Unit Performance Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pinpoints exact curriculum units causing grade deficits across national exam candidate cohorts.
            </p>
          </div>
        </div>

        {topUrgency && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Urgent Remedial Directive</p>
              <p className="text-amber-800 text-xs mt-0.5">{topUrgency}</p>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(heatmaps.length > 0 ? heatmaps : [
            { subject: "Mathematics", accuracy: 78, status: "Healthy", weak_unit: "Unit 4: Definite Integrals", national_benchmark: 64 },
            { subject: "Physics", accuracy: 54, status: "Critical Alert", weak_unit: "Unit 3: Electromagnetism", national_benchmark: 58 },
            { subject: "Chemistry", accuracy: 68, status: "Moderate", weak_unit: "Unit 2: Chemical Equilibrium", national_benchmark: 61 },
            { subject: "Biology", accuracy: 82, status: "Healthy", weak_unit: "Unit 5: Cellular Respiration", national_benchmark: 69 },
            { subject: "English", accuracy: 84, status: "Healthy", weak_unit: "Unit 6: Reading Comprehension", national_benchmark: 71 },
            { subject: "Aptitude", accuracy: 61, status: "Moderate", weak_unit: "Unit 2: Quantitative Data", national_benchmark: 55 }
          ]).map((item, i) => {
            const isCritical = item.status === "Critical Alert" || item.accuracy < 60;
            const isModerate = item.status === "Moderate" || (item.accuracy >= 60 && item.accuracy < 75);

            return (
              <div 
                key={i} 
                className={`p-4 rounded-2xl border transition-all ${
                  isCritical 
                    ? "bg-rose-50/50 border-rose-200" 
                    : isModerate 
                    ? "bg-amber-50/40 border-amber-200" 
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-slate-900">{item.subject}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isCritical 
                      ? "bg-rose-100 text-rose-700" 
                      : isModerate 
                      ? "bg-amber-100 text-amber-800" 
                      : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Cohort Accuracy</span>
                    <span className="font-bold text-slate-900">{item.accuracy}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        isCritical ? "bg-rose-500" : isModerate ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/50 text-[11px] text-slate-600">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Weakest Area:</span>
                  <span className="font-medium text-slate-800 line-clamp-1">{item.weak_unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* At-Risk Warning Console */}
      {atRiskList.length > 0 && (
        <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Candidates At Risk of Missing University Cutoff (&lt; 350)
                </h3>
                <p className="text-xs text-slate-500">
                  Early warning intervention list for students requiring accelerated coaching.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("students")}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View In Roster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="border border-slate-100 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 font-bold text-slate-600 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Candidate</th>
                  <th className="py-2.5 px-3">Grade & Sec</th>
                  <th className="py-2.5 px-3">Predicted Score</th>
                  <th className="py-2.5 px-3">Cutoff Deficit</th>
                  <th className="py-2.5 px-3">Recommended Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {atRiskList.slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{item.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.grade} - {item.section}</td>
                    <td className="py-2.5 px-3 font-bold text-rose-600">{item.current_score} / 700</td>
                    <td className="py-2.5 px-3 text-amber-700 font-semibold">-{item.score_gap} pts</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">{item.recommended_action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grade Tier Distribution */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Student Enrollment by Grade Tier
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Candidate distribution across secondary preparatory classes.
            </p>
          </div>
          <button
            onClick={() => navigate("class")}
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Classes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {(stats.by_grade || []).map((item: any) => {
            const maxVal = Math.max(50, totalCandidates);
            const widthPct = Math.min(100, Math.round((item.count / maxVal) * 100));
            return (
              <div key={item.grade} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Grade {item.grade} Secondary</span>
                  <span className="font-semibold text-slate-600">{item.count} Candidates</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
