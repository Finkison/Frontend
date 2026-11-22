import api from "./api";

export interface StudentRosterUploadItem {
  name: string;
  phone: string;
  grade?: string;
  section?: string;
  stream?: string;
  email?: string;
  target_score?: number | null;
}

export interface AssignSchoolExamPayload {
  examTitle?: string;
  title?: string;
  exam_topic?: string;
  targetGrade?: string;
  grade?: string | number;
  targetSection?: string;
  section?: string;
  dueDate?: string;
  due_date?: string;
  assignedBy?: string;
  exam_id?: string;
  examId?: string;
  subject?: string;
  durationMinutes?: string | number;
  duration_minutes?: number;
}

export interface SchoolProfile {
  id?: string;
  name?: string;
  code?: string;
  region?: string;
  country?: string;
  curriculum_type?: string;
  contact_email?: string;
  phone?: string;
  motto?: string;
  logo_url?: string;
  academic_year?: string;
  license_tier?: string;
  max_student_seats?: number | null;
  used_seats?: number | null;
  seats_remaining?: number | null;
  seat_utilization_percent?: number | null;
}

export interface AcademicYearRolloverResult {
  success: boolean;
  message: string;
  previous_year: string;
  new_academic_year: string;
  graduated_alumni_archived: number;
  promoted_11_to_12: number;
  promoted_10_to_11: number;
  promoted_9_to_10: number;
  promoted_by_grade: Record<string, number>;
  total_promoted: number;
  seats_liberated: number;
  current_active_enrolled: number;
  max_seats: number;
  seats_available: number;
  classrooms_created: number;
  teaching_assignments_carried_forward: number;
  students_reassigned: number;
}

export interface SchoolCapacityRequestResult {
  success: boolean;
  request_reference: string;
  message: string;
  max_student_seats: number;
}

export const getSchoolStudents = (assignedOnly: boolean = false, viewAtRisk: boolean = false, sectionId?: string) =>
  api.get("/school/students/", {
    params: {
      ...(assignedOnly ? { assigned_only: true } : {}),
      ...(viewAtRisk ? { view_at_risk: true } : {}),
      ...(sectionId ? { section_id: sectionId } : {}),
    },
  });
export const getSchoolAnalytics = () => api.get("/school/analytics/");
export const getClassData = (grade: number | string, section: string) =>
  api.get(`/school/class/${grade}/${section}/`);
export const assignExam = (payload: AssignSchoolExamPayload) =>
  api.post("/school/assign-exam/", payload);
export const exportReports = (format: "csv" | "pdf" | "xlsx" = "csv") =>
  api.get(`/school/export/?format=${format}`, { responseType: "blob" });
export interface LessonPlanPayload {
  title: string;
  subject: string;
  duration: number;
  unit_number?: number | null;
  overview?: string;
  learning_objectives?: string[];
  activities?: string[];
  materials?: string;
  assessment?: string;
}
export const getLessonPlans = () => api.get("/school/lesson-plans/");
export const createLessonPlan = (payload: LessonPlanPayload) =>
  api.post("/school/lesson-plans/", payload);
export const updateLessonPlan = (planId: string, payload: LessonPlanPayload) =>
  api.put(`/school/lesson-plans/${encodeURIComponent(planId)}/`, payload);
export const deleteLessonPlan = (planId: string) =>
  api.delete(`/school/lesson-plans/${encodeURIComponent(planId)}/`);
export const saveGradeEntries = (entries: Array<{ student_id?: string; name?: string; score: number }>) =>
  api.post("/school/grade-entries/", { entries });

// B2B Enterprise Extensions
export const bulkUploadStudents = (payload: { csv_text?: string; students?: StudentRosterUploadItem[] }) =>
  api.post("/school/students/bulk-upload/", payload);

export const getClassrooms = () => api.get("/school/classrooms/");
export const createClassroom = (payload: { name: string; grade: string; section: string; stream: string; academic_year?: string }) =>
  api.post("/school/classrooms/", payload);

export const getTeachers = () => api.get("/school/teachers/");
export const inviteTeacher = (payload: { name: string; email: string; phone: string; role?: string; department?: string; subject?: string; classroom_ids?: string[] }) =>
  api.post("/school/teachers/", payload);

export const getCurriculumHeatmap = () => api.get("/school/analytics/heatmap/");
export const getAtRiskCandidates = () => api.get("/school/analytics/at-risk/");

export const getSchoolProfile = () => api.get<SchoolProfile>("/school/profile/");
export const updateSchoolProfile = (payload: { name?: string; motto?: string; phone?: string; contact_email?: string; academic_year?: string; logo_url?: string }) =>
  api.put<{ success: boolean; message: string; profile: Partial<SchoolProfile> }>("/school/profile/", payload);
export const requestSchoolSeatExpansion = (payload: { additional_seats: number }) =>
  api.post<SchoolCapacityRequestResult>("/school/license/expand/", payload);
export const rolloverAcademicYear = (payload: {
  new_academic_year: string;
  archive_grade_12?: boolean;
  promote_grades?: boolean;
}) => api.post<AcademicYearRolloverResult>("/school/academic-year/rollover/", payload);
export const getSchoolAssignments = () => api.get("/school/assignments/");

export const generateCustomExam = (payload: {
  subject: string;
  grade?: string;
  unit_numbers?: number[];
  difficulty?: string;
  question_count?: number;
  title: string;
  target_grade?: string;
  target_section?: string;
  due_date?: string;
  duration_minutes?: number;
}) => api.post("/school/exams/generate/", payload);

export const getStudentDossier = (studentId: string) =>
  api.get(`/school/student-dossier/${studentId}/`);

export const getSchoolMessages = () =>
  api.get("/school/messages/");

export const replySchoolMessage = (payload: { message_id: string; reply_content: string }) =>
  api.post("/school/messages/reply/", payload);

export const broadcastAnnouncement = (payload: { title: string; message: string; alert_type?: string; target_grade?: string }) =>
  api.post("/school/broadcast-announcement/", payload);

// Enterprise Extensions
export const transferStudent = (studentId: string, payload: { target_grade: string; target_section: string; reason?: string }) =>
  api.post(`/school/students/${studentId}/transfer/`, payload);

export const getTerminalReportCard = (studentId: string) =>
  api.get(`/school/report-card/${studentId}/`);

export const saveReportCardRemarks = (studentId: string, payload: { conduct_grade?: string; remarks?: string; days_absent?: number }) =>
  api.post(`/school/report-card/${studentId}/remarks/`, payload);

export const getActiveProctorSessions = () =>
  api.get("/school/proctor/active-sessions/");

export const performProctorAction = (payload: {
  student_id: string;
  action: string;
  assignment_id?: string;
  extra_minutes?: number;
  reason?: string;
}) => api.post("/school/proctor/session-action/", payload);

// ==========================================
// STANDARDIZED TEACHER ASSIGNMENTS & TOOLS
// ==========================================
export const getAssignmentMatrix = () => api.get("/school/assignments/");

export const assignTeacher = (payload: {
  section_id: string;
  subject_id: string;
  teacher_id: string;
  academic_year?: string;
  is_substitute?: boolean;
  end_date?: string;
  confirm_high_workload?: boolean;
}) => api.post("/school/assignments/", payload);

export const reassignTeacher = (payload: {
  section_id: string;
  subject_id: string;
  new_teacher_id: string;
  academic_year?: string;
}) => api.post("/school/assignments/reassign/", payload);

export const bulkAssignTeachers = (payload: {
  subject_id: string;
  assignments: Array<{ section_id: string; teacher_id: string }>;
  academic_year?: string;
}) => api.post("/school/assignments/bulk/", payload);

export const getAssignments = () => api.get("/school/exam-assignments/");
export const createAssignment = (payload: {
  section_id: string;
  subject_id: string;
  teacher_id: string;
  academic_year?: string;
  is_substitute?: boolean;
  end_date?: string;
  confirm_high_workload?: boolean;
}) => api.post("/school/assignments/", payload);

export const getTeacherAssignedPairs = () => api.get("/teacher/assigned-pairs/");

export interface TeacherExamSummary {
  id: string;
  title: string;
  subject: string;
  status: "Published" | "Draft";
  created_at: string;
  duration_minutes: number;
  total_questions: number;
  candidate_count: number;
  completed_count: number;
  average_percent: number | null;
  sections: Array<{ id: string; name: string; grade: string }>;
}

export interface TeacherExamResult {
  student_id: string;
  student_name: string;
  grade: string;
  section: string;
  score: number;
  max_score: number;
  score_percent: number | null;
  submitted_at: string;
  duration_minutes: number | null;
}

export const getTeacherExams = () => api.get<{ success: boolean; exams: TeacherExamSummary[] }>("/teacher/exams/");
export const getTeacherExamResults = (examId: string) => api.get<{ success: boolean; exam_id: string; results: TeacherExamResult[] }>(`/teacher/exams/${encodeURIComponent(examId)}/results/`);

export interface StudentSchoolJoinRequest {
  id: string;
  status: "pending" | "approved" | "declined" | "cancelled";
  created_at: string;
  reviewed_at?: string | null;
  review_note?: string;
  school: { id: string; name: string; code: string; region: string };
  student?: { id: string; name: string; grade: string; stream: string; region: string; phone: string; email: string };
}

export interface ClassScheduleEntry {
  id: string;
  section_id: string;
  section_name: string;
  grade: string;
  stream: string;
  subject_id: string;
  subject_name: string;
  teacher_id: string;
  teacher_name: string;
  weekday: number;
  weekday_name: string;
  start_time: string;
  end_time: string;
  room: string;
  academic_year: string;
}

export interface ClassScheduleInput {
  section_id: string;
  subject_id: string;
  teacher_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  room?: string;
}

export interface TeachingAssignmentOption {
  id: string;
  section_id: string;
  section_name: string;
  grade: string;
  teacher_id: string;
  teacher_name: string;
  subject_id: string;
  subject_name: string;
}

export const getStudentSchoolJoinRequests = () => api.get<{ success: boolean; requests: StudentSchoolJoinRequest[] }>("/student/school-join-requests/");
export const requestStudentSchoolJoin = (school_code: string) => api.post<{ success: boolean; message: string; request: StudentSchoolJoinRequest }>("/student/school-join-requests/", { school_code });
export const cancelStudentSchoolJoinRequest = (requestId: string) => api.post(`/student/school-join-requests/${encodeURIComponent(requestId)}/cancel/`);
export const getSchoolJoinRequests = () => api.get<{ success: boolean; requests: StudentSchoolJoinRequest[] }>("/school/join-requests/");
export const decideSchoolJoinRequest = (requestId: string, payload: { decision: "approved" | "declined"; classroom_id?: string; note?: string }) =>
  api.post(`/school/join-requests/${encodeURIComponent(requestId)}/decision/`, payload);

export const getClassSchedule = (weekday?: number) => api.get<{ success: boolean; entries: ClassScheduleEntry[] }>("/school/schedule/", { params: weekday === undefined ? {} : { weekday } });
export const getScheduleTeachingAssignments = () => api.get<{ success: boolean; assignments: TeachingAssignmentOption[] }>("/school/schedule/teaching-assignments/");
export const createClassScheduleEntry = (payload: ClassScheduleInput) => api.post("/school/schedule/", payload);
export const updateClassScheduleEntry = (entryId: string, payload: ClassScheduleInput) => api.put(`/school/schedule/${encodeURIComponent(entryId)}/`, payload);
export const deleteClassScheduleEntry = (entryId: string) => api.delete(`/school/schedule/${encodeURIComponent(entryId)}/`);

export interface AttendanceRosterStudent {
  id: string;
  name: string;
  grade: string;
  status: "unmarked" | "present" | "absent" | "late" | "excused";
  note: string;
}

export const getTeacherAttendanceRoster = (sectionId: string, subjectId: string, attendanceDate: string) =>
  api.get<{ success: boolean; attendance_date: string; students: AttendanceRosterStudent[] }>("/teacher/attendance/roster/", {
    params: { section_id: sectionId, subject_id: subjectId, attendance_date: attendanceDate },
  });
export const saveTeacherAttendance = (payload: { section_id: string; subject_id: string; attendance_date: string; attendance: Array<{ student_id: string; status: string; note?: string }> }) =>
  api.post<{ success: boolean; saved_count: number; attendance_date: string }>("/teacher/attendance/", payload);
export const getStudentAttendance = () => api.get<{ success: boolean; summary: { attendance_rate: number | null; recorded_sessions: number }; records: Array<{ id: string; date: string; subject: string; classroom: string; status: string; note: string }> }>("/student/attendance/");

export const getSubjectExamLimits = () => api.get("/exam/config/limits/");

export const generateStandardExam = (payload: {
  subject_id: string;
  section_ids: string[];
  scope: string;
  question_count: number;
  difficulty_mix?: { easy: number; medium: number; hard: number };
  duration_minutes?: number;
  marks?: number;
  context?: string;
  source?: string;
  cognitive_mix?: Record<string, number>;
  include_explanations?: boolean;
  shuffle?: boolean;
  exclude_recent_exams_count?: number;
}) => api.post("/exam/generate/", payload);

export const approveAndPublishExam = (payload: {
  exam_id: string;
  section_ids?: string[];
}) => api.post("/exam/approve-publish/", payload);

export const uploadPastPaperQuestionSet = (payload: {
  subject_id: string;
  year: string;
  source: string;
  rights_confirmed: boolean;
  questions: Array<{
    question_text: string;
    options: string[];
    correct_answer: number;
    unit: number;
    topic?: string;
    explanation?: string;
    marks?: number;
  }>;
  source_file?: File | null;
}) => {
  const formData = new FormData();
  formData.append("subject_id", payload.subject_id);
  formData.append("year", payload.year);
  formData.append("source", payload.source);
  formData.append("rights_confirmed", String(payload.rights_confirmed));
  formData.append("questions_json", JSON.stringify(payload.questions));
  if (payload.source_file) formData.append("source_file", payload.source_file);
  return api.post("/school/past-papers/question-sets/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getSchoolPastPaperUploads = () => api.get("/school/past-papers/uploads/");

export const downloadSchoolPastPaperFile = async (uploadId: string, fileName: string) => {
  const response = await api.get(`/school/past-papers/uploads/${encodeURIComponent(uploadId)}/file/`, {
    responseType: "blob",
  });
  const objectUrl = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName || "past-paper.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
};

export const getStudentPastPapers = (subjectId?: string, year?: string) =>
  api.get("/student/past-papers/", { params: { ...(subjectId ? { subject_id: subjectId } : {}), ...(year ? { year } : {}) } });

export const getStudentPastPaperYears = (subjectId?: string) =>
  api.get("/student/past-papers/years/", { params: subjectId ? { subject_id: subjectId } : {} });

export interface StudentSchoolTask {
  id: string;
  title: string;
  type: string;
  subject: string;
  teacher: string;
  due_date: string;
  late_policy: "accept_late" | "no_late";
  status: "Assigned" | "Overdue" | "Submitted" | "Graded";
  submitted_late: boolean;
  max_marks: number;
  score: number | null;
  instructions: string;
  topic: string;
  attachment_url: string;
  submission_id: string | null;
  submission_text: string;
  submission_attachment_url: string;
  has_submission_file: boolean;
  submission_file_name: string;
  submission_file_size: number;
  draft_saved_at: string | null;
  submitted_at: string | null;
  feedback: string;
}

export interface SchoolTaskSubmission {
  id: string;
  student_id: string;
  student_name: string;
  classroom: string;
  status: "Assigned" | "Overdue" | "Submitted" | "Graded";
  submitted_late: boolean;
  submission_text: string;
  attachment_url: string;
  has_file: boolean;
  file_name: string;
  file_size: number;
  submitted_at: string | null;
  mark: number | null;
  feedback: string;
}

export const createSchoolTask = (payload: {
  title: string;
  task_type: string;
  subject_id: string;
  section_ids: string[];
  unit_number?: number;
  topic?: string;
  instructions?: string;
  attachment_url?: string;
  due_date: string;
  max_marks?: number;
  late_policy?: "accept_late" | "no_late";
}) => api.post("/school/tasks/", payload);

export const getSchoolTasks = () => api.get("/school/tasks/");
export const saveSchoolTaskDraft = (taskId: string, payload: { submission_text?: string; attachment_url?: string }) =>
  api.put(`/school/tasks/${encodeURIComponent(taskId)}/draft/`, payload);
export const uploadSchoolTaskDraftFile = (taskId: string, file: File) => {
  const formData = new FormData();
  formData.append("uploaded_file", file);
  return api.post(`/school/tasks/${encodeURIComponent(taskId)}/draft-file/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const removeSchoolTaskDraftFile = (taskId: string) =>
  api.delete(`/school/tasks/${encodeURIComponent(taskId)}/draft-file/`);
export const submitSchoolTask = (taskId: string, payload: { submission_text?: string; attachment_url?: string }) =>
  api.post(`/school/tasks/${encodeURIComponent(taskId)}/submit/`, payload);
export const getSchoolTaskSubmissions = (taskId: string) =>
  api.get<{ success: boolean; task: { id: string; title: string; max_marks: number }; submissions: SchoolTaskSubmission[] }>(
    `/school/tasks/${encodeURIComponent(taskId)}/submissions/`,
  );
export const gradeSchoolTaskSubmission = (taskId: string, submissionId: string, payload: { mark: number; feedback?: string }) =>
  api.post(`/school/tasks/${encodeURIComponent(taskId)}/submissions/${encodeURIComponent(submissionId)}/grade/`, payload);

export const downloadSchoolTaskSubmissionFile = async (taskId: string, submissionId: string, fileName: string) => {
  const response = await api.get(
    `/school/tasks/${encodeURIComponent(taskId)}/submissions/${encodeURIComponent(submissionId)}/file/`,
    { responseType: "blob" },
  );
  const objectUrl = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName || "coursework-file";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
};

export const getAITeachingTools = () => api.get("/teacher/ai-tools/");

export const executeAITeachingTool = (payload: {
  tool_id: string;
  subject_id: string;
  section_id: string;
  unit_number?: number;
  context?: string;
  language_level?: string;
}) => api.post("/teacher/ai-tools/execute/", payload);

export interface TeacherTeachingResource {
  id: string;
  tool_type: string;
  title: string;
  content_markdown: string;
  subject: string;
  section: string;
  unit_number: number;
  status: "draft" | "published" | "archived";
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}
export const getTeacherTeachingResources = (params: { page?: number; page_size?: number; status?: string; search?: string } = {}) =>
  api.get<{ success: boolean; resources: TeacherTeachingResource[]; page: number; page_size: number; total_count: number; has_more: boolean }>("/teacher/teaching-resources/", { params });
export const updateTeacherTeachingResource = (resourceId: string, payload: { title: string; content_markdown: string }) =>
  api.put(`/teacher/teaching-resources/${encodeURIComponent(resourceId)}/`, payload);
export const archiveTeacherTeachingResource = (resourceId: string) =>
  api.post(`/teacher/teaching-resources/${encodeURIComponent(resourceId)}/archive/`);
export const restoreTeacherTeachingResource = (resourceId: string) =>
  api.post(`/teacher/teaching-resources/${encodeURIComponent(resourceId)}/restore/`);
export const publishTeacherTeachingResource = (resourceId: string) =>
  api.post(`/teacher/teaching-resources/${encodeURIComponent(resourceId)}/publish/`);

export interface StudentLearningResource {
  id: string;
  title: string;
  content_markdown: string;
  subject: string;
  section: string;
  teacher: string;
  unit_number: number;
  published_at: string;
}
export const getStudentLearningResources = () =>
  api.get<{ success: boolean; access: "school" | "independent"; resources: StudentLearningResource[] }>(
    "/student/learning-resources/",
  );

export const getInvitations = () => api.get("/school/invitations/");
export const sendInvitation = (payload: { email: string; subject?: string; section_ids?: string[] }) =>
  api.post("/school/invitations/", payload);
export const resendInvitation = (id: string) =>
  api.post(`/school/invitations/${id}/resend/`);
export const revokeInvitation = (id: string) =>
  api.post(`/school/invitations/${id}/revoke/`);
export const getAuditLogs = () =>
  api.get("/school/audit-log/");

export interface AccountSession {
  token_id: string;
  session_id: string;
  created_at: number | null;
  expires_at: number | null;
  is_current: boolean;
  device_info?: { ip?: string; user_agent?: string };
}
export const getAccountSessions = () => api.get<{ success: boolean; sessions: AccountSession[] }>("/auth/sessions/");
export const revokeAccountSession = (tokenId: string) =>
  api.post(`/auth/sessions/revoke/${encodeURIComponent(tokenId)}/`);

export const changeSchoolPassword = (payload: { current_password: string; new_password: string }) =>
  api.post("/school/security/change-password/", payload);

export const revokeSchoolSessions = () =>
  api.post("/school/security/revoke-sessions/");
