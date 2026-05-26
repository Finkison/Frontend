import api from "./api";

export const getScholarships = () => api.get("/scholarships/");
export const getMatchedScholarships = () => api.get("/scholarships/matched/");
export const createScholarshipAlert = (payload) => api.post("/scholarships/alert/", payload);
