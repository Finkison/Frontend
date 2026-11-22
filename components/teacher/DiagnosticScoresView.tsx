import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2, Search, Save, Users } from "lucide-react";
import { getSchoolStudents, getTeacherAssignedPairs, saveGradeEntries } from "../../services/schoolService";
import { useToast } from "../ui/Toast";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import { useI18n } from "../../i18n";

type AssignedSection = {
  section_id: string | number;
  section_name?: string;
  grade?: string;
  subject_name?: string;
};

type Student = {
  id: string;
  name: string;
  section_id?: string;
  predicted_score?: number | null;
  diagnostic_score: string;
};

const unwrapList = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.results)) return value.results;
  return [];
};

const normalizeStudents = (data: unknown): Student[] => unwrapList(data)
  .filter((row) => row?.id != null && row?.name)
  .map((row) => ({
    id: String(row.id),
    name: String(row.name),
    section_id: row.section_id ? String(row.section_id) : undefined,
    predicted_score: row.predicted_score == null || row.predicted_score === "" ? null : Number.isFinite(Number(row.predicted_score)) ? Number(row.predicted_score) : null,
    diagnostic_score: "",
  }));

export default function TeacherDiagnosticScoresView(): React.ReactElement {
  const { t } = useI18n();
  const { showToast } = useToast();
  const [sections, setSections] = useState<AssignedSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [assignmentLoading, setAssignmentLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    getTeacherAssignedPairs()
      .then((response) => {
        if (!active) return;
        const pairs = Array.isArray(response.data?.pairs) ? response.data.pairs : [];
        const unique = new Map<string, AssignedSection>();
        pairs.forEach((pair: any) => {
          if (pair?.section_id != null) unique.set(String(pair.section_id), pair);
        });
        const nextSections = Array.from(unique.values());
        setSections(nextSections);
        setSelectedSectionId(String(nextSections[0]?.section_id || ""));
        if (!nextSections.length) setAssignmentLoading(false);
      })
      .catch(() => { if (active) { setLoadError(t("teacherDiagnostic.loadClassesError")); setAssignmentLoading(false); } })
      .finally(() => { if (active) setAssignmentLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selectedSectionId) { setStudents([]); return; }
    let active = true;
    setStudentsLoading(true);
    setLoadError("");
    getSchoolStudents(true, false, selectedSectionId)
      .then((response) => {
        if (!active) return;
        setStudents(normalizeStudents(response.data));
      })
          .catch(() => { if (active) { setStudents([]); setLoadError(t("teacherDiagnostic.loadStudentsError")); } })
      .finally(() => { if (active) setStudentsLoading(false); });
    return () => { active = false; };
  }, [selectedSectionId]);

  const enteredCount = students.filter((student) => student.diagnostic_score !== "").length;
  const invalidCount = students.filter((student) => student.diagnostic_score !== "" && (!Number.isInteger(Number(student.diagnostic_score)) || Number(student.diagnostic_score) < 0 || Number(student.diagnostic_score) > 100)).length;
  const filteredStudents = useMemo(() => students.filter((student) => student.name.toLowerCase().includes(search.trim().toLowerCase())), [students, search]);
  const selectedSection = sections.find((section) => String(section.section_id) === selectedSectionId);

  const updateScore = (studentId: string, value: string) => {
    setStudents((current) => current.map((student) => student.id === studentId ? { ...student, diagnostic_score: value } : student));
  };

  const handleSave = async () => {
    const entries = students.filter((student) => student.diagnostic_score !== "").map((student) => ({ student_id: student.id, score: Number(student.diagnostic_score) }));
    if (!entries.length || saving) return;
    if (invalidCount > 0) {
      showToast({ title: t("teacherDiagnostic.invalidTitle"), message: t("teacherDiagnostic.invalidMessage"), type: "error" });
      return;
    }
    setSaving(true);
    try {
      const response = await saveGradeEntries(entries);
      if (response.data?.success === false) throw new Error("save_failed");
      const updatedCount = Number(response.data?.updated_count ?? entries.length);
      try {
        const refreshed = await getSchoolStudents(true, false, selectedSectionId);
        setStudents(normalizeStudents(refreshed.data));
        showToast({ title: t("teacherDiagnostic.savedTitle"), message: t("teacherDiagnostic.savedMessage", { count: updatedCount }), type: "success" });
      } catch {
        setStudents((current) => current.map((student) => ({ ...student, diagnostic_score: "" })));
        showToast({ title: t("teacherDiagnostic.savedTitle"), message: t("teacherDiagnostic.savedRefreshError"), type: "success" });
      }
    } catch {
      showToast({ title: t("teacherDiagnostic.saveErrorTitle"), message: t("teacherDiagnostic.saveErrorMessage"), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalPage className="max-w-6xl space-y-6">
      <PageHeader
        title={t("appNavigation.items.diagnosticScores")}
        description={t("teacherGradebook.baselineDescription")}
        primaryAction={{
          label: saving ? t("teacherDiagnostic.saving") : t("teacherDiagnostic.saveMarks", { count: enteredCount }),
          onClick: () => void handleSave(),
          icon: Save,
          loading: saving,
          disabled: enteredCount === 0 || invalidCount > 0 || studentsLoading,
        }}
      />

      <div className="flex flex-col gap-4 rounded-xl border border-[#E7E0D6] bg-white p-4 dark:border-white/10 dark:bg-[#261E1A] sm:flex-row sm:items-end sm:justify-between">
        <label className="block w-full space-y-1.5 sm:max-w-sm"><span className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("teacherDiagnostic.assignedClass")}</span><select value={selectedSectionId} onChange={(event) => setSelectedSectionId(event.target.value)} disabled={assignmentLoading || !sections.length || studentsLoading || saving} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/15 disabled:opacity-60 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]">{assignmentLoading && <option value="">{t("teacherDiagnostic.loadingClasses")}</option>}{!assignmentLoading && !sections.length && <option value="">{t("teacherDiagnostic.noAssignedClasses")}</option>}{sections.map((section) => <option key={section.section_id} value={String(section.section_id)}>{section.section_name || section.grade || t("teacherDiagnostic.classFallback", { id: section.section_id })}{section.subject_name ? ` · ${section.subject_name}` : ""}</option>)}</select></label>
        <label className="relative block w-full sm:max-w-xs"><span className="sr-only">{t("teacherDiagnostic.searchStudents")}</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("teacherDiagnostic.searchStudents")} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label>
      </div>

      <aside className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><p><strong>{t("teacherDiagnostic.howItWorksTitle")}</strong> {t("teacherDiagnostic.howItWorksDescription")}</p></aside>
      {invalidCount > 0 && <p role="alert" className="text-sm font-medium text-rose-700 dark:text-rose-200">{t("teacherDiagnostic.invalidMessage")}</p>}

      <section className="overflow-hidden rounded-xl border border-[#E7E0D6] bg-white dark:border-white/10 dark:bg-[#261E1A]">
        <div className="flex items-center justify-between border-b border-[#E7E0D6] px-4 py-3 dark:border-white/10"><div><h2 className="text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{selectedSection?.section_name || t("teacherDiagnostic.students")}</h2><p className="mt-0.5 text-xs text-stone-500 dark:text-[#A89C90]">{studentsLoading ? t("teacherDiagnostic.loadingRoster") : t("teacherDiagnostic.assignedStudents", { count: students.length })}</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600 dark:bg-white/5 dark:text-[#E7E0D6]"><Users className="h-3.5 w-3.5" aria-hidden="true" />{t("teacherDiagnostic.enteredCount", { count: enteredCount })}</span></div>
        {assignmentLoading || studentsLoading ? <div role="status" className="p-10 text-center text-sm text-stone-500 dark:text-[#A89C90]"><Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" aria-hidden="true" />{t("teacherDiagnostic.loadingStudents")}</div>
          : loadError ? <div role="alert" className="p-8 text-center text-sm text-rose-700 dark:text-rose-200">{loadError}</div>
            : !sections.length ? <div className="p-10 text-center"><Users className="mx-auto h-6 w-6 text-stone-400" aria-hidden="true" /><p className="mt-2 text-sm font-semibold text-stone-800 dark:text-[#FDFBF7]">{t("teacherDiagnostic.noClassesTitle")}</p><p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("teacherDiagnostic.noClassesDescription")}</p></div>
              : filteredStudents.length === 0 ? <div className="p-10 text-center text-sm text-stone-500 dark:text-[#A89C90]">{students.length ? t("teacherDiagnostic.noSearchResults") : t("teacherDiagnostic.noStudentRecords")}</div>
                : <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><caption className="sr-only">{t("teacherDiagnostic.tableCaption", { className: selectedSection?.section_name || t("teacherDiagnostic.students") })}</caption><thead className="bg-[#FAF8F5] text-xs font-semibold text-stone-500 dark:bg-[#1C1512] dark:text-[#A89C90]"><tr><th scope="col" className="px-4 py-3">{t("teacherDiagnostic.student")}</th><th scope="col" className="px-4 py-3">{t("teacherDiagnostic.predictedScore")}</th><th scope="col" className="px-4 py-3">{t("teacherDiagnostic.markColumn")}</th></tr></thead><tbody className="divide-y divide-[#E7E0D6] dark:divide-white/10">{filteredStudents.map((student) => <tr key={student.id}><td className="px-4 py-3 font-medium text-stone-800 dark:text-[#FDFBF7]">{student.name}</td><td className="px-4 py-3 text-stone-600 dark:text-[#E7E0D6]">{student.predicted_score == null ? t("teacherDiagnostic.notAvailable") : student.predicted_score}</td><td className="px-4 py-3"><label className="flex items-center gap-2"><span className="sr-only">{t("teacherDiagnostic.markFor", { name: student.name })}</span><input type="number" inputMode="numeric" min={0} max={100} step={1} value={student.diagnostic_score} onChange={(event) => updateScore(student.id, event.target.value)} placeholder="—" aria-invalid={student.diagnostic_score !== "" && (!Number.isInteger(Number(student.diagnostic_score)) || Number(student.diagnostic_score) < 0 || Number(student.diagnostic_score) > 100)} aria-describedby={`diagnostic-score-hint-${student.id}`} className="min-h-10 w-28 rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/15 aria-[invalid=true]:border-rose-500 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /><span id={`diagnostic-score-hint-${student.id}`} className="text-xs text-stone-500 dark:text-[#A89C90]">/ 100</span></label></td></tr>)}</tbody></table></div>}
      </section>
    </PortalPage>
  );
}
