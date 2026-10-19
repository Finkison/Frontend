import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getDepartments } from "../../services/studentService";
import useAuthStore from "../../store/authStore";
import { 
  Briefcase, 
  DollarSign, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Search, 
  X, 
  BookOpen, 
  TrendingUp 
} from "lucide-react";

interface Department {
  id: number;
  name: string;
  description: string;
  career_paths: string[];
  salary_projection: string;
  demand_level: "Critical" | "High" | "Medium" | string;
  cutoff: number;
  university: string;
  eligible?: boolean;
}

export default function AcademicStreamsView(): React.ReactElement {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const studentScore = user?.predictedScore || 498;

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDemand, setFilterDemand] = useState<string>("All");
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  useEffect(() => {
    setLoading(true);
    getDepartments()
      .then((res) => setDepartments(res.data || []))
      .catch(() => setDepartments([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return departments.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.university.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDemand = filterDemand === "All" || d.demand_level === filterDemand;
      return matchesSearch && matchesDemand;
    });
  }, [departments, searchQuery, filterDemand]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 text-xs font-semibold border border-blue-500/20 mb-2">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>University Cutoffs</span>
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Academic departments
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Explore university departments, historical cutoffs, and career projections calibrated against your predicted score of{" "}
              <strong className="text-slate-900 font-bold">{studentScore} / 600</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Your Score</span>
            <span className="text-lg font-sans font-bold text-slate-950 mt-0.5 block">{studentScore} / 600</span>
            <span className="text-[11px] text-amber-800">Predicted Score</span>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search departments, universities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-amber-500 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {["All", "Critical", "High", "Medium"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterDemand(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 cursor-pointer transition-colors ${
                  filterDemand === lvl
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {lvl === "All" ? "All" : `${lvl} Demand`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading university cutoffs...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">No departments found</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting your search or filter keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((d) => {
            const isEligible = studentScore >= d.cutoff;
            const diff = studentScore - d.cutoff;

            const demandBadgeColor =
              d.demand_level === "Critical"
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : d.demand_level === "High"
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : "bg-blue-50 text-blue-700 border-blue-200";

            return (
              <div
                key={d.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md border ${demandBadgeColor}`}>
                      {d.demand_level} Demand
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${
                        isEligible
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      }`}
                    >
                      {isEligible ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Eligible (+{diff})</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Reach ({diff})</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mt-1">
                    {d.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>{d.university}</span>
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed mt-3">
                    {d.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs my-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Cutoff Score</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block">{d.cutoff} / 700</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Expected Salary</span>
                      <span className="font-bold text-emerald-700 text-xs flex items-center gap-0.5 mt-0.5">
                        <DollarSign className="w-3.5 h-3.5 shrink-0" />
                        <span>{d.salary_projection}</span>
                      </span>
                    </div>
                  </div>

                  {/* Career Pathways */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-slate-400" /> Career Paths
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {d.career_paths.map((path) => (
                        <span
                          key={path}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          {path}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedDept(d)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => navigate("/student/practice")}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                  >
                    Practice
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedDept && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedDept(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Department Details
                </span>
                <h2 className="font-sans text-2xl font-bold text-slate-900 mt-2">
                  {selectedDept.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Host Institutions: {selectedDept.university}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Degree program</span>
                  <span className="font-bold text-slate-800">Bachelor of Science</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Standard duration</span>
                  <span className="font-bold text-slate-800">5 academic years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">University cutoff</span>
                  <span className="font-bold text-slate-900">{selectedDept.cutoff} / 700</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current status</span>
                  <span className={`font-bold ${studentScore >= selectedDept.cutoff ? "text-emerald-700" : "text-amber-700"}`}>
                    {studentScore >= selectedDept.cutoff ? "Qualifying standing" : "Requires score improvement"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-700">Foundational Core Modules</h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <span>Year 1: Calculus, Physics Mechanics, Applied Chemistry</span>
                    <span className="text-[10px] font-bold text-slate-400">Semester 1 & 2</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <span>Year 2: Linear Algebra, Discrete Structures, Domain Core</span>
                    <span className="text-[10px] font-bold text-slate-400">Semester 3 & 4</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <span>Year 3-5: Advanced Specialization & Industrial Internship</span>
                    <span className="text-[10px] font-bold text-slate-400">Semesters 5-10</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setSelectedDept(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedDept(null);
                    navigate("/student/practice");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Practice Department Subjects</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { AcademicStreamsView as DepartmentsExplorer };
