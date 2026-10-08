import api from "./api";

export const getSchoolStudents = (assignedOnly: boolean = false) => 
  api.get(`/school/students/${assignedOnly ? "?assigned_only=true" : ""}`);
export const getSchoolAnalytics = () => api.get("/school/analytics/");
export const getClassData = (grade: number | string, section: string) =>
  api.get(`/school/class/${grade}/${section}/`);
export const assignExam = (payload: { 
  grade?: number | string; 
  section?: string; 
  exam_id?: string; 
  exam_topic?: string; 
  due_date?: string; 
  examTitle?: string; 
  targetGrade?: string; 
  targetSection?: string; 
  dueDate?: string; 
  assignedBy?: string;
  subject?: string;
  durationMinutes?: string | number;
  notes?: string;
  [key: string]: any;
}) =>
  api.post("/school/assign-exam/", payload);
export const exportReports = (format: "csv" | "pdf" | "xlsx" = "csv") =>
  api.get(`/school/export/?format=${format}`, { responseType: "blob" });
export const getLessonPlans = () => api.get("/school/lesson-plans/");
export const createLessonPlan = (payload: { title: string; subject: string; duration: number }) =>
  api.post("/school/lesson-plans/", payload);
export const saveGradeEntries = (entries: Array<{ student_id?: string; name?: string; score: number }>) =>
  api.post("/school/grade-entries/", { entries });

// B2B Enterprise Extensions
export const bulkUploadStudents = (payload: { csv_text?: string; students?: any[] }) =>
  api.post("/school/students/bulk-upload/", payload);

export const getClassrooms = () => api.get("/school/classrooms/");
export const createClassroom = (payload: { name: string; grade: string; section: string; stream: string; academic_year?: string }) =>
  api.post("/school/classrooms/", payload);

export const getTeachers = () => api.get("/school/teachers/");
export const inviteTeacher = (payload: { name: string; email: string; phone: string; role?: string; department?: string; subject?: string; classroom_ids?: string[] }) =>
  api.post("/school/teachers/", payload);

export const getCurriculumHeatmap = () => api.get("/school/analytics/heatmap/");
export const getAtRiskCandidates = () => api.get("/school/analytics/at-risk/");

export const getSchoolProfile = () => api.get("/school/profile/");
export const updateSchoolProfile = (payload: { name?: string; motto?: string; phone?: string; contact_email?: string; academic_year?: string; logo_url?: string }) =>
  api.put("/school/profile/", payload);
export const expandSchoolLicense = (payload: { additional_seats: number; payment_method?: string; reference_note?: string }) =>
  api.post("/school/license/expand/", payload);

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

export const rolloverAcademicYear = (payload: {
  new_academic_year: string;
  archive_grade_12?: boolean;
  promote_grades?: boolean;
}) => api.post("/school/academic-year/rollover/", payload);

