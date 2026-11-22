import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, AlertCircle, ClipboardList, GraduationCap, Search, Target, Users } from "lucide-react";
import { getSchoolStudents, getTeacherAssignedPairs } from "../../services/schoolService";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import { useI18n } from "../../i18n";

interface TeachingAssignment {
  assignment_id: string | number;
  section_id: string | number;
  section_name: string;
  grade: string | number;
  stream?: string | null;
  subject_id: string | number;
  subject_name: string;
  is_substitute?: boolean;
  can_publish?: boolean;
}

interface StudentRecord {
  id: string | number;
  name: string;
  grade: string | number;
  section: string;
  classroom_name?: string;
  predicted_score?: number | null;
  target_score?: number | null;
  is_at_risk?: boolean;
  streak_days?: number;
}

type RosterFilter = "all" | "support";

export default function AssignedSectionsView(): React.ReactElement {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [assignments, setAssignments] = useState<TeachingAssignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");
  const [assignmentLoading, setAssignmentLoading] = useState(true);
  const [assignmentError, setAssignmentError] = useState(false);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterError, setRosterError] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<RosterFilter>("all");
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const detailsDialogRef = useRef<HTMLDivElement | null>(null);
  const detailsCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const detailsReturnFocusRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let active = true;
    setAssignmentLoading(true);
    getTeacherAssignedPairs()
      .then((response) => {
        const pairs = response.data?.pairs;
        if (!active) return;
        const validPairs = Array.isArray(pairs) ? pairs as TeachingAssignment[] : [];
        setAssignments(validPairs);
        setSelectedAssignmentId((current) => current || String(validPairs[0]?.assignment_id ?? ""));
        setAssignmentError(false);
      })
      .catch(() => {
        if (!active) return;
        setAssignments([]);
        setAssignmentError(true);
      })
      .finally(() => {
        if (active) setAssignmentLoading(false);
      });
    return () => { active = false; };
  }, [refreshKey]);

  const selectedAssignment = assignments.find(
    (assignment) => String(assignment.assignment_id) === selectedAssignmentId,
  ) ?? assignments[0] ?? null;

  useEffect(() => {
    if (!selectedAssignment) {
      setStudents([]);
      return;
    }

    let active = true;
    setRosterLoading(true);
    setRosterError(false);
    getSchoolStudents(true, false, String(selectedAssignment.section_id))
      .then((response) => {
        if (!active) return;
        const records = Array.isArray(response.data) ? response.data : [];
        setStudents(records as StudentRecord[]);
      })
      .catch(() => {
        if (!active) return;
        setStudents([]);
        setRosterError(true);
      })
      .finally(() => {
        if (active) setRosterLoading(false);
      });
    return () => { active = false; };
  }, [selectedAssignment?.section_id, refreshKey]);

  const filteredStudents = useMemo(() => students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(search.trim().toLowerCase());
    return matchesSearch && (filter === "all" || student.is_at_risk === true);
  }), [students, search, filter]);

  const closeSelectedStudent = useCallback(() => {
    setSelectedStudent(null);
    window.requestAnimationFrame(() => detailsReturnFocusRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!selectedStudent) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    detailsCloseButtonRef.current?.focus();
    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSelectedStudent();
        return;
      }
      if (event.key !== "Tab" || !detailsDialogRef.current) return;
      const focusable = Array.from(detailsDialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !detailsDialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !detailsDialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleDialogKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleDialogKeyDown);
    };
  }, [selectedStudent, closeSelectedStudent]);

  if (assignmentLoading) {
    return <div role="status" className="mx-auto max-w-5xl rounded-2xl border border-[#E7E0D6] bg-white p-8 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90]">{t("teacherClasses.loadingAssignments")}</div>;
  }

  if (assignmentError) {
    return (
      <section className="mx-auto max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-900/40 dark:bg-rose-950/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-700 dark:text-rose-300" aria-hidden="true" />
          <div>
            <h1 className="text-base font-semibold text-rose-950 dark:text-rose-100">{t("teacherClasses.assignmentErrorTitle")}</h1>
            <p className="mt-1 text-sm text-rose-800 dark:text-rose-200">{t("teacherClasses.assignmentErrorDescription")}</p>
            <button type="button" onClick={() => setRefreshKey((value) => value + 1)} className="mt-4 min-h-10 rounded-lg border border-rose-300 px-4 text-sm font-semibold text-rose-900 hover:bg-rose-100 dark:text-rose-200 dark:hover:bg-rose-950/40">{t("teacherClasses.tryAgain")}</button>
          </div>
        </div>
      </section>
    );
  }

  if (assignments.length === 0) {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl border border-[#E7E0D6] bg-white p-8 text-center dark:border-white/10 dark:bg-[#261E1A] sm:p-12">
        <GraduationCap className="mx-auto h-10 w-10 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-stone-900 dark:text-[#FDFBF7]">{t("teacherClasses.noAssignmentsTitle")}</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-stone-600 dark:text-[#A89C90]">{t("teacherClasses.noAssignmentsDescription")}</p>
        <button type="button" onClick={() => navigate("/teacher/messages")} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white hover:bg-[#9F1239]">{t("teacherClasses.contactSchool")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
      </section>
    );
  }

  const supportCount = students.filter((student) => student.is_at_risk === true).length;
  return (
    <PortalPage className="space-y-6">
      <PageHeader
        eyebrow={t("teacherClasses.eyebrow")}
        title={t("teacherClasses.title")}
        description={t("teacherClasses.description")}
        secondaryActions={[{ label: t("teacherClasses.createTask"), href: "/teacher/tasks", icon: ClipboardList }]}
        primaryAction={{ label: t("teacherDashboard.buildAssessment"), href: "/teacher/assessment-builder", icon: BookOpen }}
      />

      <section aria-labelledby="assigned-sections-heading">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 id="assigned-sections-heading" className="text-base font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("teacherClasses.assignedClasses")}</h2>
            <p className="mt-0.5 text-xs text-stone-500 dark:text-[#A89C90]">{t("teacherClasses.chooseClass")}</p>
          </div>
          <span className="text-xs font-medium text-stone-500 dark:text-[#A89C90]">{assignments.length === 1 ? t("teacherClasses.oneClass") : t("teacherClasses.classCount", { count: assignments.length })}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {assignments.map((assignment) => {
            const selected = String(assignment.assignment_id) === String(selectedAssignment?.assignment_id);
            return (
              <button
                key={assignment.assignment_id}
                type="button"
                aria-pressed={selected}
                onClick={() => { setSelectedAssignmentId(String(assignment.assignment_id)); setSelectedStudent(null); }}
                className={`rounded-xl border p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] ${selected ? "border-[#881337] bg-[#FFF1F2] ring-1 ring-[#881337]/15 dark:border-[#FBBF24] dark:bg-[#4C0519]/30" : "border-[#E7E0D6] bg-white hover:border-[#881337]/40 dark:border-white/10 dark:bg-[#261E1A] dark:hover:border-[#FBBF24]/40"}`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-semibold text-stone-900 dark:text-[#FDFBF7]">{assignment.section_name || t("teacherClasses.classLabel", { id: assignment.section_id })}</span>
                  <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600 dark:border-white/10 dark:bg-[#1C1512] dark:text-[#E7E0D6]">{t("teacherClasses.gradeContext", { grade: assignment.grade })}</span>
                </span>
                <span className="mt-2 block text-sm text-stone-600 dark:text-[#A89C90]">{assignment.subject_name}{assignment.stream ? ` · ${assignment.stream}` : ""}</span>
                {assignment.is_substitute && <span className="mt-3 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">{t("teacherClasses.substituteAssignment")}</span>}
              </button>
            );
          })}
        </div>
      </section>

      {selectedAssignment && (
        <section className="overflow-hidden rounded-2xl border border-[#E7E0D6] bg-white shadow-xs dark:border-white/10 dark:bg-[#261E1A]" aria-labelledby="class-roster-heading">
          <div className="flex flex-col gap-4 border-b border-[#E7E0D6] p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 dark:text-[#A89C90]">{selectedAssignment.stream ? t("teacherClasses.gradeStreamContext", { grade: selectedAssignment.grade, stream: selectedAssignment.stream }) : t("teacherClasses.gradeContext", { grade: selectedAssignment.grade })}</p>
              <h2 id="class-roster-heading" className="mt-1 text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("teacherClasses.rosterTitle", { className: selectedAssignment.section_name })}</h2>
              <p className="mt-1 text-sm text-stone-600 dark:text-[#A89C90]">{selectedAssignment.subject_name}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#FAF8F5] px-3 font-medium text-stone-700 dark:bg-[#1C1512] dark:text-[#E7E0D6]"><Users className="h-4 w-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />{rosterLoading ? t("teacherClasses.loadingRoster") : students.length === 1 ? t("teacherClasses.oneLearner") : t("teacherClasses.learnerCount", { count: students.length })}</span>
              {supportCount > 0 && <span className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#FAF8F5] px-3 font-medium text-stone-700 dark:bg-[#1C1512] dark:text-[#E7E0D6]"><Target className="h-4 w-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />{supportCount === 1 ? t("teacherClasses.oneLearnerNeedsSupport") : t("teacherClasses.supportCount", { count: supportCount })}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-b border-[#E7E0D6] p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block w-full sm:max-w-sm">
              <span className="sr-only">{t("teacherClasses.searchLabel")}</span>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("teacherClasses.searchPlaceholder")} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white pl-9 pr-3 text-sm text-stone-800 outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" />
            </label>
            <div className="flex gap-2" role="group" aria-label={t("teacherClasses.filterLabel")}>
              {(["all", "support"] as const).map((option) => (
                <button key={option} type="button" aria-pressed={filter === option} onClick={() => setFilter(option)} className={`min-h-10 rounded-lg px-3 text-xs font-semibold transition-colors ${filter === option ? "bg-[#881337] text-white" : "border border-stone-300 text-stone-700 hover:bg-stone-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5"}`}>{option === "all" ? t("teacherClasses.allLearners") : t("teacherClasses.needsSupport")}</button>
              ))}
            </div>
          </div>

          {rosterLoading ? (
            <p role="status" className="p-10 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("teacherClasses.loadingRoster")}</p>
          ) : rosterError ? (
            <div className="p-6 text-center">
              <p role="alert" className="text-sm text-rose-800 dark:text-rose-200">{t("teacherClasses.rosterError")}</p>
              <button type="button" onClick={() => setRefreshKey((value) => value + 1)} className="mt-3 min-h-10 rounded-lg border border-rose-300 px-4 text-sm font-semibold text-rose-900 hover:bg-rose-100 dark:text-rose-200">{t("teacherClasses.tryAgain")}</button>
            </div>
          ) : students.length === 0 ? (
            <div className="p-10 text-center">
              <Users className="mx-auto h-8 w-8 text-stone-300 dark:text-stone-600" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-semibold text-stone-800 dark:text-[#FDFBF7]">{t("teacherClasses.noLearnersTitle")}</h3>
              <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("teacherClasses.noLearnersDescription")}</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <p className="p-8 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("teacherClasses.noSearchResults")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-[#FAF8F5] text-xs font-semibold text-stone-500 dark:bg-[#1C1512] dark:text-[#A89C90]">
                  <tr><th scope="col" className="px-5 py-3">{t("teacherClasses.learner")}</th><th scope="col" className="px-5 py-3">{t("teacherClasses.scoreEstimate")}</th><th scope="col" className="px-5 py-3">{t("teacherClasses.targetScore")}</th><th scope="col" className="px-5 py-3">{t("teacherClasses.learningStreak")}</th><th scope="col" className="px-5 py-3">{t("teacherClasses.status")}</th><th scope="col" className="px-5 py-3 text-right">{t("teacherClasses.details")}</th></tr>
                </thead>
                <tbody className="divide-y divide-[#E7E0D6] dark:divide-white/10">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-[#FAF8F5]/70 dark:hover:bg-white/5">
                      <td className="px-5 py-3"><span className="block font-semibold text-stone-900 dark:text-[#FDFBF7]">{student.name}</span><span className="mt-0.5 block text-xs text-stone-500 dark:text-[#A89C90]">{t("teacherClasses.learnerContext", { grade: student.grade, className: student.classroom_name || student.section })}</span></td>
                      <td className="px-5 py-3 font-mono tabular-nums text-stone-700 dark:text-[#E7E0D6]">{student.predicted_score ?? "—"}<span className="text-xs text-stone-400">{student.predicted_score == null ? "" : " / 600"}</span></td>
                      <td className="px-5 py-3 font-mono tabular-nums text-stone-700 dark:text-[#E7E0D6]">{student.target_score ?? "—"}</td>
                      <td className="px-5 py-3 text-stone-700 dark:text-[#E7E0D6]">{typeof student.streak_days === "number" ? student.streak_days === 1 ? t("teacherClasses.oneDay") : t("teacherClasses.dayCount", { count: student.streak_days }) : "—"}</td>
                      <td className="px-5 py-3">{student.is_at_risk ? <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">{t("teacherClasses.needsSupport")}</span> : <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">{t("teacherClasses.onTrack")}</span>}</td>
                      <td className="px-5 py-3 text-right"><button type="button" onClick={(event) => { detailsReturnFocusRef.current = event.currentTarget; setSelectedStudent(student); }} className="min-h-9 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 hover:border-[#881337] hover:text-[#881337] dark:border-white/15 dark:text-[#E7E0D6] dark:hover:border-[#FBBF24]">{t("teacherClasses.viewDetails")}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) closeSelectedStudent(); }}>
          <section ref={detailsDialogRef} id="learner-details-dialog" role="dialog" aria-modal="true" aria-labelledby="learner-details-heading" aria-describedby="learner-details-description" className="w-full max-w-lg rounded-2xl border border-[#E7E0D6] bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#261E1A]">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-wide text-[#881337] dark:text-[#FBBF24]">{t("teacherClasses.learnerDetails")}</p><h2 id="learner-details-heading" className="mt-1 text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{selectedStudent.name}</h2><p className="mt-1 text-sm text-stone-600 dark:text-[#A89C90]">{t("teacherClasses.learnerContext", { grade: selectedStudent.grade, className: selectedStudent.classroom_name || selectedStudent.section })}</p></div>
              <button ref={detailsCloseButtonRef} type="button" onClick={closeSelectedStudent} className="min-h-10 rounded-lg px-3 text-sm font-semibold text-stone-600 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:text-[#E7E0D6] dark:hover:bg-white/5">{t("teacherClasses.close")}</button>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#FAF8F5] p-4 dark:bg-[#1C1512]"><dt className="text-xs text-stone-500 dark:text-[#A89C90]">{t("teacherClasses.scoreEstimate")}</dt><dd className="mt-1 font-mono text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{selectedStudent.predicted_score ?? t("teacherClasses.notAvailable")}{selectedStudent.predicted_score != null && <span className="ml-1 text-xs font-normal text-stone-500">/ 600</span>}</dd></div>
              <div className="rounded-xl bg-[#FAF8F5] p-4 dark:bg-[#1C1512]"><dt className="text-xs text-stone-500 dark:text-[#A89C90]">{t("teacherClasses.targetScore")}</dt><dd className="mt-1 font-mono text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{selectedStudent.target_score ?? t("teacherClasses.notSet")}</dd></div>
              <div className="rounded-xl bg-[#FAF8F5] p-4 dark:bg-[#1C1512]"><dt className="text-xs text-stone-500 dark:text-[#A89C90]">{t("teacherClasses.learningStreak")}</dt><dd className="mt-1 text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{typeof selectedStudent.streak_days === "number" ? selectedStudent.streak_days === 1 ? t("teacherClasses.oneDay") : t("teacherClasses.dayCount", { count: selectedStudent.streak_days }) : t("teacherClasses.noRecentActivity")}</dd></div>
              <div className="rounded-xl bg-[#FAF8F5] p-4 dark:bg-[#1C1512]"><dt className="text-xs text-stone-500 dark:text-[#A89C90]">{t("teacherClasses.supportStatus")}</dt><dd className="mt-1 text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{selectedStudent.is_at_risk ? t("teacherClasses.needsSupport") : t("teacherClasses.onTrack")}</dd></div>
            </dl>
            <p id="learner-details-description" className="mt-4 text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t("teacherClasses.scoreDisclaimer")}</p>
          </section>
        </div>
      )}
    </PortalPage>
  );
}
