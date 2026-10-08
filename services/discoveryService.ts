import api from "./api";

/** Leaderboard */
export const getLeaderboard = (scope: "national" | "region" | "regional" | "school" | string = "national", region?: string) =>
  api.get(`/leaderboard/?scope=${scope}${region ? `&region=${encodeURIComponent(region)}` : ""}`);
