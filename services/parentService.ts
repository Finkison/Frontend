import api from "./api";

export interface ParentChildSummary {
  id: string | number;
  name?: string;
  full_name?: string;
  user__full_name?: string;
  grade?: number | string;
  grade_display?: string;
  stream?: string;
  school?: string;
  region?: string;
  latest_exam_score?: number | null;
  latest_exam_max_score?: number | null;
  target_score?: number | null;
  has_custom_target?: boolean;
  pending_classwork_count?: number;
  streak_days?: number;
}

export const getChildren = () => api.get<ParentChildSummary[]>("/parent/children/");
export const getChildProgress = (id: string) => api.get(`/parent/child/${id}/progress/`);
export interface ParentAlert {
  id: string;
  type: string;
  title: string;
  message: string;
  context?: { status?: string; subject?: string; date?: string };
  student_name: string;
  is_read: boolean;
  created_at: string;
}

export interface ParentAlertsResponse {
  success: boolean;
  results: ParentAlert[];
  count: number;
  unread_count: number;
  next_offset: number | null;
}

export const getParentAlerts = (offset = 0, limit = 20) =>
  api.get<ParentAlertsResponse>("/parent/alerts/", { params: { offset, limit } });
export const markParentAlertRead = (alertId: string) =>
  api.post<{ success: boolean; id: string; is_read: boolean }>(`/parent/alerts/${encodeURIComponent(alertId)}/read/`);
export const messageTeacher = (payload: { teacher?: string; teacher_id?: string; child_id?: string; message: string; subject?: string; senderName?: string; teacherRole?: string; childId?: string }) =>
  api.post("/parent/message-teacher/", payload);

export const linkChild = (payload: { student_id: string; relationship?: string }) =>
  api.post("/parent/link-child/", payload);

export const getParentMessages = () =>
  api.get("/parent/messages/");
