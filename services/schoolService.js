import api from "./api";
export const getSchoolStudents = () => api.get("/school/students/");
export const getSchoolAnalytics = () => api.get("/school/analytics/");
export const getClassData = (grade, section) => api.get(`/school/class/${grade}/${section}/`);
export const assignExam = (payload) => api.post("/school/assign-exam/", payload);
export const exportReports = (format = "csv") => api.get(`/school/export/?format=${format}`);
