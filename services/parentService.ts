import api from "./api";

export const getChildren = () => api.get("/parent/children/");
export const getChildProgress = (id: string) => api.get(`/parent/child/${id}/progress/`);
export const getParentAlerts = () => api.get("/parent/alerts/");
export const messageTeacher = (payload: { teacher?: string; teacher_id?: string; child_id?: string; message: string; subject?: string; senderName?: string; teacherRole?: string; childId?: string }) =>
  api.post("/parent/message-teacher/", payload);

export const linkChild = (payload: { student_id: string; relationship?: string }) =>
  api.post("/parent/link-child/", payload);

export const getParentMessages = () =>
  api.get("/parent/messages/");
