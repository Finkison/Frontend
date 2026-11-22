import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { createLessonPlan, deleteLessonPlan, getLessonPlans, getTeacherAssignedPairs, updateLessonPlan } from "../../services/schoolService";
import { useToast } from "../ui/Toast";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";

type LessonPlan = {
  id: number | string;
  title: string;
  subject: string;
  duration: number;
  unitNumber?: number | null;
  overview?: string;
  learningObjectives: string[];
  activities: string[];
  materials?: string;
  assessment?: string;
  teacherName?: string;
  createdAt?: string;
};

type SubjectOption = { id: string; name: string };

const unwrapList = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.results)) return value.results;
  return [];
};

export default function TeacherLessonsView(): React.ReactElement {
  const { showToast } = useToast();
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(3);
  const [unitNumber, setUnitNumber] = useState("");
  const [overview, setOverview] = useState("");
  const [objectivesText, setObjectivesText] = useState("");
  const [activitiesText, setActivitiesText] = useState("");
  const [materials, setMaterials] = useState("");
  const [assessment, setAssessment] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getLessonPlans(), getTeacherAssignedPairs()])
      .then(([plansResponse, assignmentsResponse]) => {
        if (!active) return;
        const planRows = unwrapList(plansResponse.data).filter((row) => row && row.title && row.subject);
        setPlans(planRows.map((row) => ({
          id: row.id,
          title: String(row.title),
          subject: String(row.subject),
          duration: Number(row.duration) || 0,
          unitNumber: row.unit_number == null ? null : Number(row.unit_number),
          overview: String(row.overview || ""),
          learningObjectives: Array.isArray(row.learning_objectives) ? row.learning_objectives.map(String) : [],
          activities: Array.isArray(row.activities) ? row.activities.map(String) : [],
          materials: String(row.materials || ""),
          assessment: String(row.assessment || ""),
          teacherName: row.teacherName ? String(row.teacherName) : undefined,
          createdAt: row.createdAt ? String(row.createdAt) : undefined,
        })));

        const pairs = Array.isArray(assignmentsResponse.data?.pairs) ? assignmentsResponse.data.pairs : [];
        const byId = new Map<string, string>();
        pairs.forEach((pair: any) => {
          if (pair?.subject_id && pair?.subject_name) byId.set(String(pair.subject_id), String(pair.subject_name));
        });
        const options = Array.from(byId, ([id, name]) => ({ id, name }));
        setSubjects(options);
        setSubject(options[0]?.name || "");
      })
      .catch(() => { if (active) setLoadError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filteredPlans = useMemo(() => plans.filter((plan) => {
    const matchesSubject = subjectFilter === "all" || plan.subject === subjectFilter;
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || plan.title.toLowerCase().includes(term) || plan.subject.toLowerCase().includes(term);
    return matchesSubject && matchesSearch;
  }), [plans, search, subjectFilter]);

  const resetForm = () => {
    setEditingPlanId(null);
    setTitle("");
    setDuration(3);
    setUnitNumber("");
    setOverview("");
    setObjectivesText("");
    setActivitiesText("");
    setMaterials("");
    setAssessment("");
  };

  const openNewPlan = () => {
    resetForm();
    setSubject(subjects[0]?.name || "");
    setModalOpen(true);
  };

  const openEditPlan = (plan: LessonPlan) => {
    setEditingPlanId(String(plan.id));
    setTitle(plan.title);
    setSubject(plan.subject);
    setDuration(plan.duration || 1);
    setUnitNumber(plan.unitNumber == null ? "" : String(plan.unitNumber));
    setOverview(plan.overview || "");
    setObjectivesText(plan.learningObjectives.join("\n"));
    setActivitiesText(plan.activities.join("\n"));
    setMaterials(plan.materials || "");
    setAssessment(plan.assessment || "");
    setModalOpen(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !subject || saving) return;
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        subject,
        duration,
        unit_number: unitNumber ? Number(unitNumber) : null,
        overview: overview.trim(),
        learning_objectives: objectivesText.split("\n").map((line) => line.trim()).filter(Boolean),
        activities: activitiesText.split("\n").map((line) => line.trim()).filter(Boolean),
        materials: materials.trim(),
        assessment: assessment.trim(),
      };
      const response = editingPlanId
        ? await updateLessonPlan(editingPlanId, payload)
        : await createLessonPlan(payload);
      const created = response.data?.data || response.data;
      if (response.data?.success === false || (!created?.id && !editingPlanId)) throw new Error(response.data?.error || "The lesson plan could not be saved.");
      const newPlan: LessonPlan = {
        id: created.id || editingPlanId,
        title: String(created.title || payload.title),
        subject: String(created.subject || payload.subject),
        duration: Number(created.duration ?? payload.duration),
        unitNumber: created.unit_number ?? payload.unit_number,
        overview: created.overview ?? payload.overview,
        learningObjectives: created.learning_objectives ?? payload.learning_objectives,
        activities: created.activities ?? payload.activities,
        materials: created.materials ?? payload.materials,
        assessment: created.assessment ?? payload.assessment,
        createdAt: created.createdAt ? String(created.createdAt) : undefined,
      };
      setPlans((current) => editingPlanId
        ? current.map((plan) => String(plan.id) === editingPlanId ? { ...plan, ...newPlan } : plan)
        : [newPlan, ...current]);
      resetForm();
      setModalOpen(false);
      showToast({ title: editingPlanId ? "Lesson plan updated" : "Lesson plan created", message: "The school curriculum plan is up to date.", type: "success" });
    } catch (error: any) {
      showToast({ title: "Could not save lesson plan", message: error?.response?.data?.error || error?.message || "Try again in a moment.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plan: LessonPlan) => {
    if (!window.confirm(`Delete "${plan.title}"? This cannot be undone.`)) return;
    try {
      await deleteLessonPlan(String(plan.id));
      setPlans((current) => current.filter((item) => String(item.id) !== String(plan.id)));
      showToast({ title: "Lesson plan deleted", message: "The plan was removed from the curriculum.", type: "success" });
    } catch (error: any) {
      showToast({ title: "Could not delete lesson plan", message: error?.response?.data?.error || "Try again.", type: "error" });
    }
  };

  return (
    <PortalPage className="max-w-6xl space-y-6">
      <PageHeader
        title="Lesson plans"
        description="Create and review curriculum plans for your classes."
        primaryAction={{ label: "New lesson plan", onClick: openNewPlan, icon: Plus, disabled: subjects.length === 0 }}
      />

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#E7E0D6] bg-white p-4 dark:border-white/10 dark:bg-[#261E1A]">
          <p className="text-xs font-medium text-stone-500 dark:text-[#A89C90]">Lesson plans</p>
          <p className="mt-1 text-2xl font-semibold text-stone-900 dark:text-[#FDFBF7]">{loading ? "—" : plans.length}</p>
        </div>
        <div className="rounded-xl border border-[#E7E0D6] bg-white p-4 dark:border-white/10 dark:bg-[#261E1A]">
          <p className="text-xs font-medium text-stone-500 dark:text-[#A89C90]">Assigned subjects</p>
          <p className="mt-1 text-2xl font-semibold text-stone-900 dark:text-[#FDFBF7]">{loading ? "—" : subjects.length}</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-[#E7E0D6] bg-white dark:border-white/10 dark:bg-[#261E1A]">
        <div className="flex flex-col gap-3 border-b border-[#E7E0D6] p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">Your plans</h2></div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block"><span className="sr-only">Search plans</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" className="min-h-10 w-full rounded-lg border border-stone-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7] sm:w-52" /></label>
            <label><span className="sr-only">Filter by subject</span><select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-[#881337] dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7] sm:w-48"><option value="all">All subjects</option>{Array.from(new Set(plans.map((plan) => plan.subject))).map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
          </div>
        </div>

        {loading ? <div role="status" className="p-10 text-center text-sm text-stone-500 dark:text-[#A89C90]">Loading lesson plans…</div>
          : loadError ? <div role="alert" className="p-8 text-center text-sm text-rose-700 dark:text-rose-200">Lesson plans could not be loaded. Refresh and try again.</div>
            : filteredPlans.length === 0 ? <div className="p-10 text-center"><p className="text-sm font-semibold text-stone-800 dark:text-[#FDFBF7]">{plans.length ? "No plans match your search" : "No lesson plans yet"}</p><p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{plans.length ? "Clear the search or choose another subject." : "Create a plan to get started."}</p></div>
              : <ul className="divide-y divide-[#E7E0D6] dark:divide-white/10">
                {filteredPlans.map((plan) => <li key={plan.id} className="space-y-3 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{plan.title}</h3>
                      <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{plan.subject}{plan.unitNumber ? ` | Unit ${plan.unitNumber}` : ""}{plan.teacherName ? ` | ${plan.teacherName}` : ""}</p>
                      <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{plan.duration} {plan.duration === 1 ? "week" : "weeks"}{plan.createdAt ? ` | Created ${plan.createdAt}` : ""}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => openEditPlan(plan)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 hover:border-[#881337] hover:text-[#881337] dark:border-white/15 dark:text-[#E7E0D6]"><Pencil className="h-3.5 w-3.5" aria-hidden="true" />Edit</button>
                      <button type="button" onClick={() => void handleDelete(plan)} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-rose-200 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-200"><Trash2 className="h-3.5 w-3.5" aria-hidden="true" />Delete</button>
                    </div>
                  </div>
                  {(plan.overview || plan.learningObjectives.length || plan.activities.length || plan.materials || plan.assessment) && <details className="rounded-lg bg-[#FAF8F5] px-3 py-2 dark:bg-[#1C1512]"><summary className="cursor-pointer text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">View details</summary><div className="mt-3 space-y-3 text-xs leading-5 text-stone-600 dark:text-[#A89C90]">
                      {plan.overview && <p>{plan.overview}</p>}
                      {plan.learningObjectives.length > 0 && <div><h4 className="font-semibold text-stone-800 dark:text-[#FDFBF7]">Learning objectives</h4><ul className="mt-1 list-disc space-y-1 pl-5">{plan.learningObjectives.map((item, index) => <li key={`${plan.id}-objective-${index}`}>{item}</li>)}</ul></div>}
                      {plan.activities.length > 0 && <div><h4 className="font-semibold text-stone-800 dark:text-[#FDFBF7]">Lesson activities</h4><ol className="mt-1 list-decimal space-y-1 pl-5">{plan.activities.map((item, index) => <li key={`${plan.id}-activity-${index}`}>{item}</li>)}</ol></div>}
                      {plan.materials && <p><strong>Materials:</strong> {plan.materials}</p>}
                      {plan.assessment && <p><strong>Assessment:</strong> {plan.assessment}</p>}
                    </div></details>}
                </li>)}
              </ul>}
      </section>

      {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) { setModalOpen(false); resetForm(); } }}>
        <section role="dialog" aria-modal="true" aria-labelledby="lesson-dialog-title" className="w-full max-w-2xl rounded-2xl border border-[#E7E0D6] bg-white shadow-2xl dark:border-white/10 dark:bg-[#261E1A]">
          <header className="flex items-start justify-between border-b border-[#E7E0D6] p-5 dark:border-white/10">
            <div><h2 id="lesson-dialog-title" className="text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{editingPlanId ? "Edit lesson plan" : "New lesson plan"}</h2></div>
            <button type="button" onClick={() => { setModalOpen(false); resetForm(); }} className="rounded-md p-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-white/5" aria-label="Close dialog"><X className="h-4 w-4" /></button>
          </header>
          <form onSubmit={handleSave} className="max-h-[75vh] space-y-4 overflow-y-auto p-5">
            <label className="block space-y-1.5"><span className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Plan title</span><input autoFocus required maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="For example, Introduction to cell division" className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5"><span className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Assigned subject</span><select required value={subject} onChange={(event) => setSubject(event.target.value)} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]">{subjects.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</select></label>
              <label className="block space-y-1.5"><span className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Duration in weeks</span><input required type="number" min={1} max={52} value={duration} onChange={(event) => setDuration(Number(event.target.value))} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label>
              <label className="block space-y-1.5"><span className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Curriculum unit <span className="font-normal text-stone-500">(optional)</span></span><input type="number" min={1} max={99} value={unitNumber} onChange={(event) => setUnitNumber(event.target.value)} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label>
            </div>
            <label className="block space-y-1.5"><span className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Overview</span><textarea rows={3} maxLength={3000} value={overview} onChange={(event) => setOverview(event.target.value)} placeholder="Summarize the topic and connect it to prior learning." className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm leading-5 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label>
            <label className="block space-y-1.5"><span className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Learning objectives <span className="font-normal text-stone-500">(one per line)</span></span><textarea rows={3} maxLength={5000} value={objectivesText} onChange={(event) => setObjectivesText(event.target.value)} placeholder={"Explain the key concept\nSolve a representative problem"} className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm leading-5 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label>
            <label className="block space-y-1.5"><span className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Teaching sequence <span className="font-normal text-stone-500">(one activity per line)</span></span><textarea rows={4} maxLength={7000} value={activitiesText} onChange={(event) => setActivitiesText(event.target.value)} placeholder={"Prior knowledge check\nWorked example\nGuided and independent practice"} className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm leading-5 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label>
            <label className="block space-y-1.5"><span className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Materials and references</span><textarea rows={2} maxLength={3000} value={materials} onChange={(event) => setMaterials(event.target.value)} placeholder="Textbook pages, equipment, or links" className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label>
            <label className="block space-y-1.5"><span className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">Assessment and evidence of learning</span><textarea rows={2} maxLength={3000} value={assessment} onChange={(event) => setAssessment(event.target.value)} placeholder="Describe checks for understanding, an assignment, or a rubric." className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label>
            <div className="flex justify-end gap-2 border-t border-[#E7E0D6] pt-4 dark:border-white/10"><button type="button" onClick={() => { setModalOpen(false); resetForm(); }} className="min-h-10 rounded-lg border border-stone-300 px-4 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5">Cancel</button><button type="submit" disabled={saving || !subjects.length} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white hover:bg-[#9F1239] disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}{saving ? "Saving..." : editingPlanId ? "Save changes" : "Create lesson plan"}</button></div>
          </form>
        </section>
      </div>}
    </PortalPage>
  );
}
