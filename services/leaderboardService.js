import api from "./api";

export const getLeaderboard = (scope = "national") => api.get(`/leaderboard/?scope=${scope}`);
