import api from "./api";

export const getScholarships = () => api.get("/scholarships/");
export const getMatchedScholarships = () => api.get("/scholarships/matched/");
export const getLeaderboard = (scope = "national") => api.get(`/leaderboard/?scope=${scope}`);
