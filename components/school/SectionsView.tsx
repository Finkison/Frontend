import React, { useCallback, useEffect, useRef, useState } from "react";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import PortalLoading from "../shared/PortalLoading";
import PortalError from "../shared/PortalError";
import { 
  getClassrooms, 
  createClassroom, 
  getTeachers,
  getClassData 
} from "../../services/schoolService";
import { 
  Layers, 
  Plus, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  X, 
  Check, 
  AlertCircle,
  TrendingUp,
  Clock,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { useToast } from "../ui/Toast";
import { useI18n } from "../../i18n";
import { getApiErrorMessage } from "../../services/api";

interface SectionItem {
  id: string;
  name: string;
  grade: string;
  section: string;
  stream: string;
  capacity?: number;
  students_count?: number;
  homeroom_teacher_name?: string;
  teachers_count?: number;
  status?: string;
}

export default function SectionsView(): React.ReactElement {
  const { t } = useI18n();
  const { showToast } = useToast();
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSection, setSelectedSection] = useState<SectionItem | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "teachers" | "students" | "results">("overview");
  const [sectionData, setSectionData] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    grade: "Grade 12",
    section: "",
    stream: "Natural Science",
    capacity: 40,
    homeroom_teacher_id: ""
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const detailsDialogRef = useRef<HTMLDivElement>(null);
  const createDialogRef = useRef<HTMLDivElement>(null);
  const dialogTriggerRef = useRef<HTMLElement | null>(null);
  const detailRequestId = useRef(0);
  const formatGrade = (grade: string) => {
    const number = grade.match(/\d+/)?.[0];
    return number ? t("schoolClasses.gradeOption", { grade: number }) : grade;
  };
  const formatStream = (stream?: string) => {
    const keys: Record<string, string> = {
      "Natural Science": "naturalScience",
      "Social Science": "socialScience",
      "General Secondary": "generalSecondary",
    };
    return stream && keys[stream] ? t(`schoolClasses.streams.${keys[stream]}`) : stream || t("schoolClasses.generalStream");
  };

  useEffect(() => {
    const activeDialog = selectedSection ? detailsDialogRef.current : showCreateModal ? createDialogRef.current : null;
    if (!activeDialog) return;

    dialogTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusFirstControl = () => activeDialog.querySelector<HTMLElement>(focusableSelector)?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (selectedSection) setSelectedSection(null);
        else setShowCreateModal(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = Array.from(activeDialog.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => !element.hasAttribute("disabled"));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(focusFirstControl);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      window.requestAnimationFrame(() => dialogTriggerRef.current?.focus());
    };
  }, [selectedSection, showCreateModal]);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [classRes, teacherRes] = await Promise.all([
        getClassrooms(),
        getTeachers().catch(() => ({ data: [] }))
      ]);
      const list = Array.isArray(classRes.data) ? classRes.data : classRes.data?.data || [];
      setSections(list.map((section: any) => ({
        ...section,
        students_count: section.student_count ?? section.students_count ?? 0,
        homeroom_teacher_name: section.homeroom_teacher_name ?? section.homeroom_teacher ?? null,
      })));
      setTeachers(Array.isArray(teacherRes.data) ? teacherRes.data : teacherRes.data?.data || []);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError(t("schoolClasses.permissionError"));
      } else {
        setError(getApiErrorMessage(err) || t("schoolClasses.loadError"));
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void fetchSections();
  }, [fetchSections]);

  const openSectionDetail = async (sec: SectionItem) => {
    const requestId = detailRequestId.current + 1;
    detailRequestId.current = requestId;
    setSelectedSection(sec);
    setActiveTab("overview");
    setDetailError(null);
    setLoadingDetail(true);
    try {
      const res = await getClassData(sec.grade.replace(/\D/g, "") || "12", sec.section);
      if (detailRequestId.current === requestId) setSectionData(res.data);
    } catch (err: any) {
      if (detailRequestId.current === requestId) {
        setSectionData(null);
        setDetailError(getApiErrorMessage(err) || t("schoolClasses.detailError"));
      }
    } finally {
      if (detailRequestId.current === requestId) setLoadingDetail(false);
    }
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      await createClassroom({
        name: `${createForm.grade} - ${createForm.section.trim().toUpperCase()}`,
        grade: createForm.grade,
        section: createForm.section,
        stream: createForm.stream,
        capacity: Number(createForm.capacity) || 40,
        homeroom_teacher_id: createForm.homeroom_teacher_id || undefined
      } as any);
      showToast({ title: t("schoolClasses.created"), message: t("schoolClasses.createdMessage", { grade: createForm.grade.match(/\d+/)?.[0] || createForm.grade, section: createForm.section.toUpperCase() }), type: "success" });
      setShowCreateModal(false);
      setCreateForm({
        grade: "Grade 12",
        section: "",
        stream: "Natural Science",
        capacity: 40,
        homeroom_teacher_id: ""
      });
      fetchSections();
    } catch (err: any) {
      setCreateError(getApiErrorMessage(err) || t("schoolClasses.createError"));
    } finally {
      setCreating(false);
    }
  };

  return (
    <PortalPage className="max-w-6xl space-y-6">

      <PageHeader
        eyebrow={t("schoolClasses.eyebrow")}
        title={t("schoolClasses.title")}
        description={t("schoolClasses.description")}
        primaryAction={{ label: t("schoolClasses.createClass"), onClick: () => setShowCreateModal(true), icon: Plus }}
      />

      {error && (
        <PortalError message={error} actionLabel={t("schoolClasses.tryAgain")} onAction={() => void fetchSections()} />
      )}

      {loading ? (
        <PortalLoading message={t("schoolClasses.loading")} />
      ) : sections.length === 0 ? (
        /* Empty state */
        <div className="bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 rounded-[8px] p-12 text-center max-w-md mx-auto">
          <div className="w-10 h-10 rounded-full bg-[#FFF1F2] dark:bg-[#4C0519]/40 text-[#881337] flex items-center justify-center mx-auto mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{t("schoolClasses.emptyTitle")}</h2>
          <p className="text-xs text-[#5C5046] dark:text-[#E7E0D6] mt-1 mb-4">
            {t("schoolClasses.emptyDescription")}
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#881337] hover:bg-[#9F1239] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t("schoolClasses.createClass")}</span>
          </button>
        </div>
      ) : (
        /* Sections Table */
        <div className="bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 rounded-[8px] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <caption className="sr-only">{t("schoolClasses.tableCaption")}</caption>
              <thead>
                <tr className="bg-[#FAF8F5] dark:bg-[#1C1512] border-b border-[#E7E0D6] dark:border-white/10 text-stone-500 dark:text-[#A89C90] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">{t("schoolClasses.table.name")}</th>
                  <th className="py-3 px-4">{t("schoolClasses.table.gradeStream")}</th>
                  <th className="py-3 px-4">{t("schoolClasses.table.enrolledCapacity")}</th>
                  <th className="py-3 px-4">{t("schoolClasses.table.homeroomTeacher")}</th>
                  <th className="py-3 px-4 text-right">{t("schoolClasses.table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E0D6] text-[#261E1A] dark:text-[#FDFBF7]">
                {sections.map((sec) => (
                  <tr key={sec.id} className="hover:bg-[#FAF8F5] dark:hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#261E1A] dark:text-[#FDFBF7]">
                      {sec.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#5C5046] dark:text-[#E7E0D6]">
                      {formatGrade(sec.grade)} · {formatStream(sec.stream)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono">{sec.students_count ?? 0}</span>
                      <span className="text-stone-400 dark:text-[#A89C90]"> / {sec.capacity ?? "—"}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#5C5046] dark:text-[#E7E0D6]">
                      {sec.homeroom_teacher_name || t("schoolClasses.unassigned")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        aria-label={t("schoolClasses.viewDetailsFor", { className: sec.name })}
                        onClick={() => openSectionDetail(sec)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] border border-[#E7E0D6] dark:border-white/10 hover:bg-[#FFF1F2] dark:hover:bg-[#4C0519]/50 hover:border-[#FECDD3] text-[#881337] font-medium text-xs cursor-pointer min-h-[32px]"
                      >
                        <span>{t("schoolClasses.viewDetails")}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedSection && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedSection(null); }}>
          <div ref={detailsDialogRef} role="dialog" aria-modal="true" aria-labelledby="class-details-title" className="bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 rounded-[8px] shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E7E0D6] dark:border-white/10 flex items-center justify-between">
              <div>
                <h2 id="class-details-title" className="text-base font-semibold text-[#261E1A] dark:text-[#FDFBF7]">
                  {t("schoolClasses.classOverview", { className: selectedSection.name })}
                </h2>
                <p className="text-xs text-[#5C5046] dark:text-[#E7E0D6] mt-0.5">
                  {t("schoolClasses.gradeAndCapacity", { grade: selectedSection.grade.match(/\d+/)?.[0] || selectedSection.grade, capacity: selectedSection.capacity ?? "—" })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSection(null)}
                data-dialog-close="true"
                aria-label={t("schoolClasses.closeDetails")}
                className="p-1.5 text-stone-400 dark:text-[#A89C90] hover:text-stone-600 rounded-[6px] cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div role="tablist" aria-label={t("schoolClasses.detailsTabs")} className="border-b border-[#E7E0D6] dark:border-white/10 px-5 flex gap-4 text-xs font-semibold">
              {(["overview", "teachers", "students", "results"] as const).map((tab, index, tabs) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  id={`class-tab-${tab}`}
                  role="tab"
                  aria-selected={activeTab === tab}
                  aria-controls="class-details-panel"
                  tabIndex={activeTab === tab ? 0 : -1}
                  onKeyDown={(event) => {
                    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                    event.preventDefault();
                    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
                    const nextTab = tabs[nextIndex];
                    setActiveTab(nextTab);
                    document.getElementById(`class-tab-${nextTab}`)?.focus();
                  }}
                  className={`py-3 cursor-pointer border-b-2 -mb-px transition-colors ${
                    activeTab === tab
                      ? "border-[#881337] text-[#881337]"
                      : "border-transparent text-[#5C5046] dark:text-[#E7E0D6] hover:text-[#261E1A] dark:hover:text-[#FDFBF7]"
                  }`}
                >
                  {t(`schoolClasses.tabs.${tab === "students" ? "studentSummary" : tab === "results" ? "assessmentResults" : tab}`)}
                </button>
              ))}
            </div>

            <div id="class-details-panel" role="tabpanel" aria-labelledby={`class-tab-${activeTab}`} aria-busy={loadingDetail} tabIndex={0} className="p-5 overflow-y-auto flex-1 space-y-4 focus:outline-none">
              {loadingDetail ? (
                <div role="status" className="py-12 text-center text-xs text-[#5C5046] dark:text-[#E7E0D6]">
                  <div className="w-6 h-6 border-2 border-stone-300 dark:border-white/20 border-t-[#881337] rounded-full animate-spin mx-auto mb-2" />
                  {t("schoolClasses.loadingDetails")}
                </div>
              ) : detailError ? (
                <div role="alert" className="py-10 text-center text-sm text-rose-700">
                  <p>{detailError}</p>
                  <button
                    type="button"
                    onClick={() => selectedSection && void openSectionDetail(selectedSection)}
                    className="mt-3 min-h-9 rounded-lg border border-rose-200 bg-white dark:bg-[#261E1A] px-3 text-sm font-semibold text-rose-800 hover:bg-rose-50"
                  >
                    {t("schoolClasses.tryAgain")}
                  </button>
                </div>
              ) : activeTab === "overview" ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{t("schoolClasses.subjectsAndTeachers")}</h3>
                  {sectionData?.subject_cards?.length ? (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {sectionData.subject_cards.map((assignment: any) => (
                        <article key={assignment.subject} className="rounded-lg border border-[#E7E0D6] dark:border-white/10 bg-[#FAF8F5] dark:bg-[#1C1512] p-4">
                          <h4 className="text-sm font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{assignment.subject}</h4>
                          <p className="mt-1 text-sm text-stone-600 dark:text-[#E7E0D6]">{assignment.teacher}</p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-lg border border-dashed border-stone-300 dark:border-white/20 px-4 py-8 text-center text-sm text-stone-600 dark:text-[#E7E0D6]">
                      {t("schoolClasses.noTeachersAssigned")}
                    </p>
                  )}
                </div>
              ) : activeTab === "students" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="p-3 bg-[#FAF8F5] dark:bg-[#1C1512] border border-[#E7E0D6] dark:border-white/10 rounded-[8px]">
                      <div className="text-[11px] text-stone-500 dark:text-[#A89C90]">{t("schoolClasses.studentCount")}</div>
                      <div className="text-lg font-bold text-[#261E1A] dark:text-[#FDFBF7] mt-1">{sectionData?.total_students ?? "—"}</div>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] dark:bg-[#1C1512] border border-[#E7E0D6] dark:border-white/10 rounded-[8px]">
                      <div className="text-[11px] text-stone-500 dark:text-[#A89C90]">{t("schoolClasses.averageScore")}</div>
                      <div className="text-lg font-bold text-[#261E1A] dark:text-[#FDFBF7] mt-1">{sectionData?.average_score ?? "—"}</div>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] dark:bg-[#1C1512] border border-[#E7E0D6] dark:border-white/10 rounded-[8px]">
                      <div className="text-[11px] text-stone-500 dark:text-[#A89C90]">{t("schoolClasses.studentsNeedSupport")}</div>
                      <div className="text-lg font-bold text-amber-700 mt-1">{sectionData?.at_risk_count ?? "—"}</div>
                    </div>
                  </div>
                  <div className="text-xs text-stone-500 dark:text-[#A89C90]">
                    {t("schoolClasses.privacySummary")}
                  </div>
                </div>
              ) : activeTab === "teachers" ? (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{t("schoolClasses.teachers")}</div>
                  <div className="border border-[#E7E0D6] dark:border-white/10 rounded-[8px] divide-y divide-[#E7E0D6]">
                    {(sectionData?.subject_cards || []).map((teacher: any) => (
                      <div key={teacher.subject} className="p-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{teacher.teacher}</div>
                          <div className="text-stone-500 dark:text-[#A89C90]">{t("schoolClasses.subjectTeacher", { subject: teacher.subject })}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {!sectionData?.subject_cards?.length && (
                    <p className="rounded-lg border border-dashed border-stone-300 dark:border-white/20 px-4 py-8 text-center text-sm text-stone-600 dark:text-[#E7E0D6]">
                      {t("schoolClasses.noTeachersAssigned")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{t("schoolClasses.assignedAssessments")}</h3>
                  {sectionData?.exam_results?.length ? (
                    <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 dark:border-white/10">
                      {sectionData.exam_results.map((result: any) => (
                        <li key={result.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{result.title}</h4>
                            <p className="mt-1 text-xs text-stone-600 dark:text-[#E7E0D6]">{result.subject}</p>
                          </div>
                          <div className="text-sm text-stone-700 dark:text-[#E7E0D6] sm:text-right">
                            <p>{t("schoolClasses.submissionsReceived", { count: result.submitted_count })}</p>
                            <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">
                              {t("schoolClasses.averageScoreLabel", { score: result.average_score == null ? t("schoolClasses.noScoresYet") : `${result.average_score}%` })}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="rounded-lg border border-dashed border-stone-300 dark:border-white/20 px-4 py-8 text-center text-sm text-stone-600 dark:text-[#E7E0D6]">
                      {t("schoolClasses.noAssessmentResults")}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-[#E7E0D6] dark:border-white/10 bg-[#FAF8F5] dark:bg-[#1C1512] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSection(null)}
                className="px-3.5 py-1.5 rounded-[6px] border border-[#E7E0D6] dark:border-white/10 bg-white dark:bg-[#261E1A] hover:bg-stone-50 dark:hover:bg-white/5 text-xs font-semibold text-[#261E1A] dark:text-[#FDFBF7] cursor-pointer min-h-[36px]"
              >
                {t("schoolClasses.close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowCreateModal(false); }}>
          <div ref={createDialogRef} role="dialog" aria-modal="true" aria-labelledby="create-class-title" className="bg-white dark:bg-[#261E1A] border border-[#E7E0D6] dark:border-white/10 rounded-[8px] shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E7E0D6] dark:border-white/10 flex items-center justify-between">
              <h2 id="create-class-title" className="text-sm font-semibold text-[#261E1A] dark:text-[#FDFBF7]">{t("schoolClasses.createClass")}</h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                data-dialog-close="true"
                aria-label={t("schoolClasses.closeCreateDialog")}
                className="p-1 text-stone-400 dark:text-[#A89C90] hover:text-stone-600 rounded-[6px] cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSection} className="p-5 space-y-4 text-xs">
              {createError && (
                <div className="p-2.5 rounded-[6px] bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {createError}
                </div>
              )}

              <div>
                <label htmlFor="section-grade" className="block font-semibold text-[#261E1A] dark:text-[#FDFBF7] mb-1">{t("schoolClasses.grade")}</label>
                <select
                  id="section-grade"
                  required
                  value={createForm.grade}
                  onChange={(e) => setCreateForm({ ...createForm, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E7E0D6] dark:border-white/10 rounded-[6px] bg-white dark:bg-[#261E1A] text-xs focus:outline-none focus:ring-2 focus:ring-[#881337]"
                >
                  <option value="Grade 12">{t("schoolClasses.gradeOption", { grade: 12 })}</option>
                  <option value="Grade 11">{t("schoolClasses.gradeOption", { grade: 11 })}</option>
                  <option value="Grade 10">{t("schoolClasses.gradeOption", { grade: 10 })}</option>
                  <option value="Grade 9">{t("schoolClasses.gradeOption", { grade: 9 })}</option>
                </select>
              </div>

              <div>
                <label htmlFor="section-identifier" className="block font-semibold text-[#261E1A] dark:text-[#FDFBF7] mb-1">{t("schoolClasses.classGroup")}</label>
                <input
                  id="section-identifier"
                  type="text"
                  required
                  placeholder={t("schoolClasses.classGroupPlaceholder")}
                  value={createForm.section}
                  onChange={(e) => setCreateForm({ ...createForm, section: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-[#E7E0D6] dark:border-white/10 rounded-[6px] bg-white dark:bg-[#261E1A] text-xs focus:outline-none focus:ring-2 focus:ring-[#881337]"
                />
              </div>

              <div>
                <label htmlFor="section-stream" className="block font-semibold text-[#261E1A] dark:text-[#FDFBF7] mb-1">{t("schoolClasses.stream")}</label>
                <select
                  id="section-stream"
                  required
                  value={createForm.stream}
                  onChange={(e) => setCreateForm({ ...createForm, stream: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E7E0D6] dark:border-white/10 rounded-[6px] bg-white dark:bg-[#261E1A] text-xs focus:outline-none focus:ring-2 focus:ring-[#881337]"
                >
                  <option value="Natural Science">{t("schoolClasses.streams.naturalScience")}</option>
                  <option value="Social Science">{t("schoolClasses.streams.socialScience")}</option>
                  <option value="General Secondary">{t("schoolClasses.streams.generalSecondary")}</option>
                </select>
              </div>

              <div>
                <label htmlFor="section-capacity" className="block font-semibold text-[#261E1A] dark:text-[#FDFBF7] mb-1">{t("schoolClasses.capacity")}</label>
                <input
                  id="section-capacity"
                  type="number"
                  required
                  min={10}
                  max={80}
                  value={createForm.capacity}
                  onChange={(e) => setCreateForm({ ...createForm, capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-[#E7E0D6] dark:border-white/10 rounded-[6px] bg-white dark:bg-[#261E1A] text-xs focus:outline-none focus:ring-2 focus:ring-[#881337]"
                />
              </div>

              <div>
                <label htmlFor="section-homeroom-teacher" className="block font-semibold text-[#261E1A] dark:text-[#FDFBF7] mb-1">{t("schoolClasses.homeroomTeacher")}</label>
                <select
                  id="section-homeroom-teacher"
                  value={createForm.homeroom_teacher_id}
                  onChange={(e) => setCreateForm({ ...createForm, homeroom_teacher_id: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E7E0D6] dark:border-white/10 rounded-[6px] bg-white dark:bg-[#261E1A] text-xs focus:outline-none focus:ring-2 focus:ring-[#881337]"
                >
                  <option value="">{t("schoolClasses.none")}</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.subject || t("schoolClasses.teacherFallback")})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E7E0D6] dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 border border-[#E7E0D6] dark:border-white/10 rounded-[6px] hover:bg-stone-50 dark:hover:bg-white/5 font-semibold text-[#5C5046] dark:text-[#E7E0D6] cursor-pointer min-h-[38px]"
                >
                  {t("schoolClasses.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-3.5 py-2 bg-[#881337] hover:bg-[#9F1239] disabled:opacity-50 text-white rounded-[6px] font-semibold cursor-pointer min-h-[38px]"
                >
                  {creating ? t("schoolClasses.creating") : t("schoolClasses.createClass")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalPage>
  );
}
