import React, { useEffect, useState } from "react";
import { 
  getClassData, 
  assignExam, 
  getClassrooms, 
  createClassroom,
  getSchoolAssignments,
  generateCustomExam
} from "../../services/schoolService";
import { 
  Users, 
  BookOpen, 
  Send, 
  CheckCircle2, 
  GraduationCap, 
  ArrowRight,
  Plus,
  Layers,
  X,
  Clock,
  Target,
  Sparkles,
  FileCheck2,
  Wand2,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Percent,
  CheckCircle
} from "lucide-react";
import { useToast } from "../shared/Toast";

export default function ClassView(): React.ReactElement {
  const { showToast } = useToast();
  const [grade, setGrade] = useState("Grade 12");
  const [section, setSection] = useState("A");
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);

  // Exam dispatch modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [dispatchMode, setDispatchMode] = useState<"preset" | "generator">("preset");
  const [examForm, setExamForm] = useState({
    examType: "euee_past",
    examTitle: "2016 E.C. Ethiopian University Entrance Examination (Standard Mock)",
    subject: "Natural Science Composite",
    durationMinutes: "120",
    dueDate: "In 7 days",
    passingScorePercent: "60",
    notes: "Timed national entrance simulation. Candidates must complete in one sitting."
  });

  // Dynamic question bank generator state
  const [generatorForm, setGeneratorForm] = useState({
    title: "Preparatory Diagnostic & Speed Assessment",
    subject: "Mathematics",
    questionCount: 20,
    difficulty: "all",
    durationMinutes: 60,
  });

  // Assignment tracking ledger state
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);

  // New section modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSection, setNewSection] = useState({
    name: "",
    grade: "Grade 12",
    section: "C",
    stream: "Natural Science"
  });
  const [creating, setCreating] = useState(false);

  const fetchClassrooms = () => {
    getClassrooms()
      .then((r) => setClassrooms(r.data || []))
      .catch(() => setClassrooms([]));
  };

  const fetchAssignments = async () => {
    setLoadingAssignments(true);
    try {
      const res = await getSchoolAssignments();
      setAssignments(res.data?.assignments || []);
    } catch {
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
    fetchAssignments();
  }, []);

  useEffect(() => {
    setLoading(true);
    getClassData(grade, section)
      .then((r) => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [grade, section]);

  const handleDispatchExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssigning(true);
    try {
      await assignExam({ 
        grade, 
        section, 
        exam_topic: examForm.examTitle,
        examTitle: examForm.examTitle,
        subject: examForm.subject,
        dueDate: examForm.dueDate,
        durationMinutes: examForm.durationMinutes
      });
      setAssignmentSuccess(true);
      setShowAssignModal(false);
      showToast({
        type: "success",
        title: "Benchmark Test Dispatched",
        message: `'${examForm.examTitle}' assigned to ${grade} Section ${section}.`
      });
      fetchAssignments();
      setTimeout(() => setAssignmentSuccess(false), 3000);
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Assignment Failed",
        message: err?.response?.data?.message || err?.message || "Failed to dispatch benchmark test."
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleGenerateCustomExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssigning(true);
    try {
      const res = await generateCustomExam({
        subject: generatorForm.subject,
        grade: grade,
        difficulty: generatorForm.difficulty,
        question_count: generatorForm.questionCount,
        title: generatorForm.title || `${grade} ${generatorForm.subject} Generated Exam`,
        target_grade: grade,
        target_section: section,
        duration_minutes: Number(generatorForm.durationMinutes),
      });
      setAssignmentSuccess(true);
      setShowAssignModal(false);
      showToast({
        type: "success",
        title: "Custom Exam Assembled & Dispatched",
        message: `'${res.data?.assignment?.title || generatorForm.title}' created with ${res.data?.questions_count || generatorForm.questionCount} questions and assigned to ${grade} Section ${section}.`
      });
      fetchAssignments();
      setTimeout(() => setAssignmentSuccess(false), 3000);
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Exam Generation Failed",
        message: err?.response?.data?.message || err?.response?.data?.detail || err?.message || "Failed to assemble exam from question bank."
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const name = newSection.name.trim() || `Section ${newSection.grade.replace('Grade ', '')}-${newSection.section.toUpperCase()}`;
      await createClassroom({
        name,
        grade: newSection.grade,
        section: newSection.section.toUpperCase(),
        stream: newSection.stream
      });
      showToast({
        type: "success",
        title: "Section Created",
        message: `Classroom '${name}' initialized for school roster.`
      });
      setShowAddModal(false);
      fetchClassrooms();
      setGrade(newSection.grade);
      setSection(newSection.section.toUpperCase());
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Creation Failed",
        message: err?.response?.data?.error || err?.message || "Only School Principals or Admins can initialize sections."
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 text-xs font-semibold border border-blue-500/20 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cohort Section Analytics</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-slate-900">
              Class Section Roster & Assignment Engine
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Select specific preparatory sections to inspect student benchmarks and broadcast mock tests.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Section</span>
            </button>
            <button
              onClick={() => setShowAssignModal(true)}
              disabled={assigning}
              className="px-4 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs flex items-center gap-2 shadow transition-colors cursor-pointer shrink-0"
            >
              {assigning ? (
                <span>Broadcasting...</span>
              ) : assignmentSuccess ? (
                <span className="flex items-center gap-1.5 text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800" /> Dispatched!
                </span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Assign Benchmark Test</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section Quick Selector */}
        {classrooms.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold uppercase text-slate-400 shrink-0">Active Sections:</span>
            {classrooms.map((c) => {
              const active = c.grade === grade && c.section === section;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setGrade(c.grade);
                    setSection(c.section);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    active
                      ? "bg-slate-900 text-amber-400 shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {c.name} ({c.student_count})
                </button>
              );
            })}
          </div>
        )}

        {/* Filter controls */}
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Grade Tier
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white cursor-pointer"
            >
              <option value="Grade 9">Grade 9 Secondary</option>
              <option value="Grade 10">Grade 10 Secondary</option>
              <option value="Grade 11">Grade 11 Preparatory</option>
              <option value="Grade 12">Grade 12 Entrance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              Stream Section
            </label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white cursor-pointer"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </select>
          </div>
        </div>

        {/* Class data grid */}
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading section roster...</div>
        ) : !data ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No stream roster found for {grade} Section {section}.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
              <span>Section Roster: {data.students?.length || 0} Registered Candidates</span>
              <span>Average Predicted Score: <strong className="text-slate-900">{data.average_score || 480} / 700</strong></span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Stream</th>
                    <th className="py-3 px-4">Predicted IRT Score</th>
                    <th className="py-3 px-4">Practice Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data.students || []).map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {s.id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {s.user__full_name || s.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {s.stream || "Natural Science"}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-600">
                        {s.score || 460} / 700
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {s.streak || 7} days
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Assignment Ledger & Completion Tracking */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-semibold border border-emerald-500/20 mb-2">
              <ListChecks className="w-3.5 h-3.5 text-emerald-700" />
              <span>Assignment Ledger & Progress Tracker</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Institutional Benchmark Tasks & Submissions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live tracking of dispatched benchmark exams, student completion ratios, and cohort averages.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              {assignments.length} Dispatched Tasks
            </span>
          </div>
        </div>

        {loadingAssignments ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading assignment submissions ledger...</div>
        ) : assignments.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
            No active benchmark tasks assigned yet. Use "Assign Benchmark Test" above to broadcast an exam to this cohort.
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((asg) => {
              const isExpanded = expandedAssignmentId === asg.id;
              const completedCount = asg.completed_count || 0;
              const totalAssigned = asg.total_assigned || 0;
              const rate = asg.completion_rate !== undefined ? asg.completion_rate : (totalAssigned > 0 ? Math.round((completedCount / totalAssigned) * 100) : 0);
              const hasSubmissions = asg.recent_submissions && asg.recent_submissions.length > 0;

              return (
                <div key={asg.id} className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                          {asg.subject || "Composite"}
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          {asg.classroom_name || `${asg.target_grade || grade} Sec ${asg.target_section || section}`}
                        </span>
                        {asg.duration_minutes && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {asg.duration_minutes}m
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900">{asg.title}</h3>
                      {asg.due_date && (
                        <p className="text-[11px] text-slate-500">
                          Due: {new Date(asg.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-900">
                          {completedCount} / {totalAssigned} Submitted
                        </div>
                        <div className="w-28 sm:w-36 bg-slate-200 h-2 rounded-full overflow-hidden mt-1.5">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, rate)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 mt-0.5 inline-block">
                          {rate}% Completion
                        </span>
                      </div>

                      <div className="text-right border-l border-slate-200 pl-4">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Class Average</span>
                        <div className="text-sm sm:text-base font-serif font-bold text-amber-600">
                          {asg.average_score !== null && asg.average_score !== undefined ? `${asg.average_score}%` : "Pending"}
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedAssignmentId(isExpanded ? null : asg.id)}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-white text-slate-600 cursor-pointer transition-colors"
                        title={isExpanded ? "Collapse submissions" : "View student submissions"}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Submissions Roster */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 p-4 sm:p-5 bg-white space-y-3 animate-in fade-in duration-200">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Student Submissions Ledger ({completedCount})</span>
                      </h4>

                      {!hasSubmissions ? (
                        <p className="text-xs text-slate-400 py-2">
                          No candidate has submitted this assignment yet. Submissions update automatically in real-time.
                        </p>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border border-slate-100">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-100">
                                <th className="py-2.5 px-3">Student Candidate</th>
                                <th className="py-2.5 px-3">Submission Time</th>
                                <th className="py-2.5 px-3">Raw Score</th>
                                <th className="py-2.5 px-3">Percentage</th>
                                <th className="py-2.5 px-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {asg.recent_submissions.map((sub: any, sIdx: number) => (
                                <tr key={sub.id || sIdx} className="hover:bg-slate-50/60">
                                  <td className="py-2.5 px-3 font-bold text-slate-900">{sub.student_name}</td>
                                  <td className="py-2.5 px-3 text-slate-500">
                                    {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                                  </td>
                                  <td className="py-2.5 px-3 font-semibold text-slate-700">
                                    {sub.score !== null ? `${sub.score} / ${sub.total_points || 100}` : "—"}
                                  </td>
                                  <td className="py-2.5 px-3 font-bold text-amber-600">
                                    {sub.score_percent !== null ? `${sub.score_percent}%` : "—"}
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                      <CheckCircle className="w-3 h-3" /> Submitted
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Initialize Classroom Section
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Section Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Section 12-C Natural Science"
                  value={newSection.name}
                  onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Grade Tier *
                  </label>
                  <select
                    value={newSection.grade}
                    onChange={(e) => setNewSection({ ...newSection, grade: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Section Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={newSection.section}
                    onChange={(e) => setNewSection({ ...newSection, section: e.target.value.toUpperCase() })}
                    placeholder="C"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Curriculum Stream *
                </label>
                <select
                  value={newSection.stream}
                  onChange={(e) => setNewSection({ ...newSection, stream: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white"
                >
                  <option value="Natural Science">Natural Science</option>
                  <option value="Social Science">Social Science</option>
                  <option value="General Secondary">General Secondary</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs shadow cursor-pointer"
                >
                  {creating ? "Creating..." : "Initialize Section"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Benchmark Exam Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Assign National Benchmark Examination
                  </h3>
                  <p className="text-xs text-slate-500">
                    Deploy testing payload to <strong className="text-slate-800">{grade} Section {section}</strong> candidates.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setDispatchMode("preset")}
                className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  dispatchMode === "preset"
                    ? "border-amber-500 text-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Pre-Set Standard Benchmark</span>
              </button>
              <button
                type="button"
                onClick={() => setDispatchMode("generator")}
                className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  dispatchMode === "generator"
                    ? "border-amber-500 text-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <Wand2 className="w-4 h-4 text-purple-600" />
                <span>⚡ Question Bank Test Generator</span>
              </button>
            </div>

            {dispatchMode === "preset" ? (
              <>
                {/* Assessment Type Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase text-slate-700">
                    Assessment Classification
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "euee_past", label: "National Past Paper", defaultTitle: "2016 E.C. Ethiopian University Entrance Examination (Standard Mock)" },
                      { id: "unit_diagnostic", label: "Curriculum Diagnostic", defaultTitle: "Grade 12 Physics & Math Diagnostic: Unit Assessment" },
                      { id: "remedial", label: "Cutoff Remedial Drill", defaultTitle: "Accelerated Preparatory Drill for University Cutoff (< 350 pts)" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setExamForm({
                            ...examForm,
                            examType: t.id,
                            examTitle: t.defaultTitle
                          });
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                          examForm.examType === t.id
                            ? "border-amber-500 bg-amber-50/60 text-slate-950 ring-1 ring-amber-400"
                            : "border-slate-200 hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleDispatchExam} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Examination Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={examForm.examTitle}
                      onChange={(e) => setExamForm({ ...examForm, examTitle: e.target.value })}
                      placeholder="e.g. 2016 E.C. EUEE Natural Science Mock Benchmark"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
                    />
                    
                    {/* Fast Title Presets */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase self-center">Presets:</span>
                      {[
                        "2016 E.C. National Mock Exam",
                        "2015 E.C. EUEE Official Paper",
                        "Physics Unit 3 Electromagnetism Drill",
                        "Calculus & Analytic Geometry Diagnostic"
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setExamForm({ ...examForm, examTitle: preset })}
                          className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Academic Subject / Stream
                      </label>
                      <select
                        value={examForm.subject}
                        onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white cursor-pointer"
                      >
                        <option value="Natural Science Composite">Natural Science Composite (All Subjects)</option>
                        <option value="Social Science Composite">Social Science Composite (All Subjects)</option>
                        <option value="Mathematics">Mathematics (Natural/Social)</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="English">English</option>
                        <option value="Aptitude & Scholastic Reasoning">Aptitude & Scholastic Reasoning</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Submission Window (Due Date)
                      </label>
                      <select
                        value={examForm.dueDate}
                        onChange={(e) => setExamForm({ ...examForm, dueDate: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white cursor-pointer"
                      >
                        <option value="Tomorrow 11:59 PM">Tomorrow 11:59 PM</option>
                        <option value="In 3 days">In 3 days</option>
                        <option value="In 7 days">In 7 days (Standard Window)</option>
                        <option value="In 14 days">In 14 days (Term Benchmark)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Exam Duration Limit
                      </label>
                      <select
                        value={examForm.durationMinutes}
                        onChange={(e) => setExamForm({ ...examForm, durationMinutes: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white cursor-pointer"
                      >
                        <option value="45">45 Minutes (Quick Drill)</option>
                        <option value="60">60 Minutes</option>
                        <option value="120">120 Minutes (Standard EUEE)</option>
                        <option value="180">180 Minutes (Full Composite)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Benchmark Cutoff Threshold
                      </label>
                      <select
                        value={examForm.passingScorePercent}
                        onChange={(e) => setExamForm({ ...examForm, passingScorePercent: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white cursor-pointer"
                      >
                        <option value="50">50% (National Passing Line)</option>
                        <option value="60">60% (Preparatory Standard)</option>
                        <option value="75">75% (Merit / University First-Tier)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Candidate Instructions / Teacher Directives
                    </label>
                    <textarea
                      rows={2}
                      value={examForm.notes}
                      onChange={(e) => setExamForm({ ...examForm, notes: e.target.value })}
                      placeholder="Instructions displayed to candidates before launching exam session..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none resize-none"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Real-Time Institutional Synchronization</span>
                    </div>
                    <p>
                      Candidates registered in {grade} Section {section} will receive this task directly on their mobile/web study consoles. IRT predictive scores will calibrate upon test completion.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAssignModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={assigning}
                      className="px-6 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs shadow flex items-center gap-2 cursor-pointer"
                    >
                      {assigning ? (
                        <span>Broadcasting Examination...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Broadcast to {grade} Sec {section}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Question Bank Test Generator Form */
              <form onSubmit={handleGenerateCustomExam} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Generated Test Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={generatorForm.title}
                    onChange={(e) => setGeneratorForm({ ...generatorForm, title: e.target.value })}
                    placeholder="e.g. Unit 3 Calculus & Physics Velocity Diagnostic"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Target Subject *
                    </label>
                    <select
                      value={generatorForm.subject}
                      onChange={(e) => setGeneratorForm({ ...generatorForm, subject: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white cursor-pointer"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="English">English</option>
                      <option value="Aptitude">Aptitude & Reasoning</option>
                      <option value="History">History</option>
                      <option value="Geography">Geography</option>
                      <option value="Economics">Economics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={generatorForm.difficulty}
                      onChange={(e) => setGeneratorForm({ ...generatorForm, difficulty: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white cursor-pointer"
                    >
                      <option value="all">Balanced (All Levels)</option>
                      <option value="easy">Foundational (Easy)</option>
                      <option value="medium">Standard National (Medium)</option>
                      <option value="hard">Advanced Distinguisher (Hard)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Question Count
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[10, 20, 30, 50].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGeneratorForm({ ...generatorForm, questionCount: num })}
                          className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            generatorForm.questionCount === num
                              ? "bg-slate-900 text-amber-400 border-slate-900 shadow-2xs"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {num} Qs
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Time Allowed
                    </label>
                    <select
                      value={generatorForm.durationMinutes}
                      onChange={(e) => setGeneratorForm({ ...generatorForm, durationMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white cursor-pointer"
                    >
                      <option value={30}>30 Minutes</option>
                      <option value={45}>45 Minutes</option>
                      <option value={60}>60 Minutes (Standard)</option>
                      <option value={90}>90 Minutes</option>
                      <option value={120}>120 Minutes (Full Exam)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 text-[11px] text-purple-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-purple-950">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Dynamic Question Bank Assembly</span>
                  </div>
                  <p>
                    The system will randomly sample verified questions matching {generatorForm.subject} ({grade}) and package them into an interactive mock exam assigned directly to <strong>{grade} Section {section}</strong>.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={assigning}
                    className="px-6 py-2.5 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs shadow flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    {assigning ? (
                      <span>Assembling & Dispatching...</span>
                    ) : (
                      <>
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Assemble & Dispatch ({generatorForm.questionCount} Questions)</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
