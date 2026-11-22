import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { getClassSchedule, getSchoolTasks, getTeacherAssignedPairs, type ClassScheduleEntry } from "../../services/schoolService";
import WaitingForAssignmentView from "./WaitingForAssignmentView";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";
import { useI18n } from "../../i18n";
import { 
  Layers, 
  FileCheck, 
  BookOpen,
  ChevronRight,
  CalendarCheck,
  Calendar,
  ListChecks,
  FileSpreadsheet,
  MessageSquare,
} from "lucide-react";

export default function TeacherDashboard(): React.ReactElement {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user } = useAuthStore();
  const subject = user?.subject || t("appNavigation.roles.teacher");

  const [loading, setLoading] = useState(true);
  const [assignedSections, setAssignedSections] = useState<any[]>([]);
  const [assignmentLoadError, setAssignmentLoadError] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState(false);
  const [tasksRefreshKey, setTasksRefreshKey] = useState(0);
  const [todaySchedule, setTodaySchedule] = useState<ClassScheduleEntry[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState(false);
  const [scheduleRefreshKey, setScheduleRefreshKey] = useState(0);

  useEffect(() => {
    getTeacherAssignedPairs()
      .then((res) => {
        const pairs = res.data?.pairs || (Array.isArray(res.data) ? res.data : []);
        setAssignedSections(pairs);
        setAssignmentLoadError(false);
      })
      .catch(() => {
        setAssignedSections([]);
        setAssignmentLoadError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setTasksLoading(true);
    setTasksError(false);
    getSchoolTasks()
      .then((response) => {
        const items = response.data?.tasks || [];
        setTasks(Array.isArray(items) ? items : []);
      })
      .catch(() => { setTasks([]); setTasksError(true); })
      .finally(() => setTasksLoading(false));
  }, [tasksRefreshKey]);

  useEffect(() => {
    setScheduleError(false);
    setScheduleLoading(true);
    const weekday = (new Date().getDay() + 6) % 7;
    getClassSchedule(weekday)
      .then((response) => setTodaySchedule(response.data?.entries || []))
      .catch(() => { setTodaySchedule([]); setScheduleError(true); })
      .finally(() => setScheduleLoading(false));
  }, [scheduleRefreshKey]);

  const needsReviewCount = tasks.reduce((total, task) => total + (Number(task.needs_review_count ?? task.submitted_count) || 0), 0);

  if (loading) {
      return <PortalPage className="max-w-4xl"><div role="status" className="rounded-2xl border border-[#E7E0D6] bg-white p-8 text-center text-sm text-stone-500 dark:border-white/10 dark:bg-[#261E1A] dark:text-[#A89C90]">{t("teacherDashboard.loadingClasses")}</div></PortalPage>;
  }

  if (assignedSections.length === 0) {
    if (assignmentLoadError) {
      return (
        <PortalPage className="max-w-lg"><div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
          <h1 className="text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("teacherDashboard.loadErrorTitle")}</h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-[#E7E0D6]">{t("teacherDashboard.loadErrorDescription")}</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-4 min-h-11 rounded-lg bg-[#881337] px-4 py-2 text-sm font-semibold text-white">{t("teacherDashboard.refresh")}</button>
        </div></PortalPage>
      );
    }
    return <WaitingForAssignmentView />;
  }

  return (
    <PortalPage className="animate-fade-in text-start">

      <PageHeader
        title={t("teacherDashboard.title")}
        description={t("teacherDashboard.description")}
        badge={{ text: subject, variant: "brand" }}
        secondaryActions={[
          { label: t("teacherDashboard.takeAttendance"), href: "/teacher/attendance", icon: CalendarCheck },
          { label: t("teacherDashboard.createAssignment"), href: "/teacher/tasks", icon: ListChecks },
        ]}
        primaryAction={{ label: t("teacherDashboard.buildAssessment"), href: "/teacher/assessment-builder", icon: FileCheck }}
      />

      <section className="rounded-2xl border border-[#E7E0D6] bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A]" aria-labelledby="teacher-schedule-heading">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#881337]" aria-hidden="true" />
            <h2 id="teacher-schedule-heading" className="text-xs font-bold uppercase tracking-wider text-[#261E1A] dark:text-[#FDFBF7]">{t("teacherDashboard.todaySchedule")}</h2>
          </div>
          <button type="button" onClick={() => navigate("schedule")} className="min-h-9 rounded-lg px-3 text-xs font-semibold text-[#881337] hover:bg-[#FFF1F2] dark:text-[#FBBF24] dark:hover:bg-white/5">{t("teacherDashboard.viewTimetable")}</button>
        </div>
        {scheduleLoading ? (
          <p role="status" className="mt-3 rounded-xl bg-[#FAF8F5] px-4 py-5 text-center text-sm text-stone-500 dark:bg-[#1C1512] dark:text-[#A89C90]">{t("teacherDashboard.loadingSchedule")}</p>
        ) : scheduleError ? (
          <div className="mt-3 flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between">
            <p role="alert">{t("teacherDashboard.scheduleLoadError")}</p>
            <button type="button" onClick={() => setScheduleRefreshKey((value) => value + 1)} className="min-h-9 self-start rounded-lg border border-rose-300 px-3 text-xs font-semibold hover:bg-rose-100 dark:border-rose-800 sm:self-auto">{t("teacherDashboard.retrySchedule")}</button>
          </div>
        ) : todaySchedule.length ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{todaySchedule.slice(0, 6).map((entry) => <article key={entry.id} className="rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] p-4 dark:border-white/10 dark:bg-[#1C1512]"><p className="font-mono text-xs font-semibold text-[#881337] dark:text-[#FBBF24]">{entry.start_time}–{entry.end_time}</p><h3 className="mt-1 text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{entry.subject_name}</h3><p className="mt-1 text-xs text-stone-600 dark:text-[#A89C90]">{entry.section_name} · {t("teacherDashboard.gradeLabel", { grade: entry.grade })}</p>{entry.room && <p className="mt-1 text-[11px] text-stone-500 dark:text-[#A89C90]">{t("teacherDashboard.roomLabel", { room: entry.room })}</p>}</article>)}</div>
        ) : (
          <div className="mt-3 rounded-xl border border-dashed border-stone-300 bg-[#FAF8F5] px-5 py-6 text-center dark:border-white/15 dark:bg-[#1C1512]"><p className="text-sm font-semibold text-stone-800 dark:text-[#FDFBF7]">{t("teacherDashboard.noClassesToday")}</p><p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("teacherDashboard.scheduleEmpty")}</p></div>
        )}
      </section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-1 rounded-2xl border border-[#E7E0D6] bg-white p-4 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]">
            <span className="font-medium">{t("teacherDashboard.myClasses")}</span>
            <Layers className="h-4 w-4 text-[#881337]" aria-hidden="true" />
          </div>
          <p className="font-mono text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{new Set(assignedSections.map((pair) => String(pair.section_id))).size}</p>
          <p className="text-[11px] text-stone-500 dark:text-[#A89C90]">{t("teacherDashboard.classesAssigned")}</p>
        </div>
        <div className="space-y-1 rounded-2xl border border-[#E7E0D6] bg-white p-4 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]">
            <span className="font-medium">{t("teacherDashboard.teachingAssignments")}</span>
            <BookOpen className="h-4 w-4 text-[#881337]" aria-hidden="true" />
          </div>
          <p className="font-mono text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{assignedSections.length}</p>
          <p className="text-[11px] text-stone-500 dark:text-[#A89C90]">{t("teacherDashboard.classSubjectCombinations")}</p>
        </div>
        <div className="space-y-1 rounded-2xl border border-[#E7E0D6] bg-white p-4 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]">
            <span className="font-medium">{t("teacherDashboard.assignedTasks")}</span>
            <ListChecks className="h-4 w-4 text-[#881337]" aria-hidden="true" />
          </div>
          <p className="font-mono text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{tasksLoading || tasksError ? "—" : tasks.length}</p>
          <p className="text-[11px] text-stone-500 dark:text-[#A89C90]">{t("teacherDashboard.createdByYou")}</p>
        </div>
        <div className="space-y-1 rounded-2xl border border-[#E7E0D6] bg-white p-4 shadow-xs dark:border-white/10 dark:bg-[#261E1A]">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-[#A89C90]">
            <span className="font-medium">{t("teacherDashboard.needsReview")}</span>
            <FileCheck className="h-4 w-4 text-[#881337]" aria-hidden="true" />
          </div>
          <p className="font-mono text-2xl font-semibold tabular-nums text-stone-900 dark:text-[#FDFBF7]">{tasksLoading || tasksError ? "—" : needsReviewCount}</p>
          <p className="text-[11px] text-stone-500 dark:text-[#A89C90]">{t("teacherDashboard.waitingForFeedback")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <section className="lg:col-span-7 overflow-hidden rounded-2xl border border-[#E7E0D6] bg-white shadow-xs dark:border-white/10 dark:bg-[#261E1A]" aria-labelledby="teacher-classwork-heading">
          <div className="flex items-center justify-between gap-4 border-b border-[#E7E0D6] px-5 py-4 dark:border-white/10">
            <div>
              <h2 id="teacher-classwork-heading" className="text-sm font-bold text-[#261E1A] dark:text-[#FDFBF7]">{t("teacherDashboard.recentClasswork")}</h2>
              <p className="mt-0.5 text-xs text-[#5C5046] dark:text-[#E7E0D6]">{t("teacherDashboard.recentClassworkDescription")}</p>
            </div>
            <button type="button" onClick={() => navigate("tasks")} className="min-h-10 shrink-0 rounded-lg px-3 text-xs font-semibold text-[#881337] hover:bg-[#FFF1F2] dark:text-[#FBBF24] dark:hover:bg-white/5">{t("teacherDashboard.viewTasks")}</button>
          </div>

          {tasksLoading ? (
            <p role="status" className="p-8 text-center text-sm text-stone-500 dark:text-[#A89C90]">{t("teacherDashboard.loadingTasks")}</p>
          ) : tasksError ? (
            <div className="flex flex-col gap-3 p-6 text-sm text-rose-800 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between"><p role="alert">{t("teacherDashboard.tasksLoadError")}</p><button type="button" onClick={() => setTasksRefreshKey((value) => value + 1)} className="min-h-9 self-start rounded-lg border border-rose-300 px-3 text-xs font-semibold hover:bg-rose-100 dark:border-rose-800 sm:self-auto">{t("teacherDashboard.retryTasks")}</button></div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold text-stone-800 dark:text-[#FDFBF7]">{t("teacherDashboard.noTasksTitle")}</p>
              <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">{t("teacherDashboard.noTasksDescription")}</p>
              <button type="button" onClick={() => navigate("tasks")} className="mt-3 min-h-10 rounded-lg bg-[#881337] px-3 text-xs font-semibold text-white hover:bg-[#9F1239]">{t("teacherDashboard.createTask")}</button>
            </div>
          ) : (
            <div className="divide-y divide-[#E7E0D6] dark:divide-white/10">
              {tasks.slice(0, 4).map((task) => (
                <article key={task.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{task.title || t("teacherAssignments.untitledAssignment")}</h3>
                    <p className="mt-1 text-xs text-stone-500 dark:text-[#A89C90]">
                      {[task.subject, Array.isArray(task.sections) ? task.sections.join(", ") : ""].filter(Boolean).join(" · ") || t("teacherDashboard.classworkTask")}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                    <span className="text-xs text-stone-600 dark:text-[#E7E0D6]">{t("teacherDashboard.submissionCount", { count: Number(task.submitted_count) || 0 })}</span>
                    <span className="text-xs text-stone-500 dark:text-[#A89C90]">{task.due_date || t("teacherAssignments.noDueDate")}</span>
                    {Number(task.needs_review_count ?? task.submitted_count) > 0 && (
                      <button
                        type="button"
                        onClick={() => navigate(`tasks?task=${encodeURIComponent(String(task.id))}`)}
                        className="min-h-9 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 hover:border-[#881337] hover:text-[#881337] dark:border-white/15 dark:text-[#E7E0D6] dark:hover:border-[#FBBF24] dark:hover:text-[#FBBF24]"
                      >
                        {t("teacherDashboard.reviewSubmissions")}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        <aside className="lg:col-span-5 rounded-2xl border border-[#E7E0D6] bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A]" aria-labelledby="teacher-shortcuts-heading">
          <h2 id="teacher-shortcuts-heading" className="text-sm font-bold text-stone-900 dark:text-[#FDFBF7]">{t("teacherDashboard.shortcuts")}</h2>
          <p className="mt-1 text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t("teacherDashboard.shortcutsDescription")}</p>
          <div className="mt-4 space-y-2">
            {[
              { label: t("teacherDashboard.openGradebook"), route: "gradebook", icon: FileSpreadsheet },
              { label: t("teacherDashboard.takeAttendance"), route: "attendance", icon: CalendarCheck },
              { label: t("teacherDashboard.openMessages"), route: "messages", icon: MessageSquare },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.route} type="button" onClick={() => navigate(item.route)} className="flex min-h-11 w-full items-center justify-between rounded-xl border border-stone-200 px-3 text-left text-sm font-semibold text-stone-700 transition-colors hover:border-[#881337]/30 hover:bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#881337] dark:border-white/10 dark:text-[#E7E0D6] dark:hover:bg-white/5">
                  <span className="inline-flex items-center gap-2"><Icon className="h-4 w-4 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-stone-400 dark:text-[#A89C90]" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </PortalPage>
  );
}
