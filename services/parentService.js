import api from "./api";
export const getChildren = () => api.get("/parent/children/");
export const getChildProgress = (id) => api.get(`/parent/child/${id}/progress/`);
export const getParentAlerts = () => api.get("/parent/alerts/");
export const messageTeacher = (payload) => api.post("/parent/message-teacher/", payload);
