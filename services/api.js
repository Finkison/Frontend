import axios from "axios";
import useAuthStore from "../store/authStore";
import { mockData } from "./mockData";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL,
  timeout: 15000,
  adapter: async (config) => {
    const token = useAuthStore.getState().token;
    if (token === "demo-token") {
      // Clean up requested path
      const url = config.url.replace(config.baseURL, "").split("?")[0];
      const cleanUrl = url.startsWith("/") ? url : "/" + url;

      let data = null;

      // Handle dynamic parent Child detail progress match: /parent/child/<uuid>/progress/
      if (cleanUrl.match(/^\/parent\/child\/[^/]+\/progress\/?$/)) {
        const parts = cleanUrl.split("/");
        const matchId = parts[3];
        data = mockData[`/parent/child/${matchId}/progress/`] || mockData["/parent/child/child-1/progress/"];
      } 
      // Handle dynamic school class list match: /school/class/<grade>/<section>/
      else if (cleanUrl.match(/^\/school\/class\/[^/]+\/[^/]+\/?$/)) {
        const parts = cleanUrl.split("/");
        const grade = parts[3];
        const section = parts[4];
        data = {
          grade: Number(grade),
          section: section,
          students: [
            { id: "stud-1", user__full_name: "Daniel Finkison" },
            { id: "stud-2", user__full_name: "Betty Girmay" },
            { id: "stud-3", user__full_name: "Naod Yoseph" }
          ]
        };
      } 
      // Handle practice/exam session initiation
      else if (cleanUrl === "/practice/start/" || cleanUrl === "/exam/start/") {
        data = {
          id: "practice-session-uuid",
          session_type: "unit",
          questions: [
            {
              id: "q1",
              question_text_en: "If f(x) = x^2 - 4x + 3, what is the derivative f'(2)?",
              options: [
                { label: "A", text_en: "0" },
                { label: "B", text_en: "1" },
                { label: "C", text_en: "2" },
                { label: "D", text_en: "-1" }
              ],
              correct_label: "A",
              explanation_en: "f'(x) = 2x - 4. Substituting x = 2 gives f'(2) = 2(2) - 4 = 0."
            },
            {
              id: "q2",
              question_text_en: "Which of the following is the unit of electric field intensity?",
              options: [
                { label: "A", text_en: "Newton/Coulomb" },
                { label: "B", text_en: "Volt/meter" },
                { label: "C", text_en: "Joule/Coulomb" },
                { label: "D", text_en: "Both A and B" }
              ],
              correct_label: "D",
              explanation_en: "Electric field intensity E is force per unit charge (N/C) or potential gradient (V/m)."
            },
            {
              id: "q3",
              question_text_en: "Solve for x in the equation log_2(x) + log_2(x-2) = 3.",
              options: [
                { label: "A", text_en: "4" },
                { label: "B", text_en: "-2" },
                { label: "C", text_en: "4 and -2" },
                { label: "D", text_en: "3" }
              ],
              correct_label: "A",
              explanation_en: "log_2(x(x-2)) = 3 => x^2 - 2x = 8 => x^2 - 2x - 8 = 0 => (x-4)(x+2) = 0. Since x must be positive, x = 4."
            }
          ]
        };
      } 
      // Handle practice/exam answer submissions
      else if (cleanUrl === "/practice/answer/" || cleanUrl === "/exam/answer/") {
        data = { status: "success" };
      } 
      // Handle practice/exam completions
      else if (cleanUrl === "/practice/complete/" || cleanUrl === "/exam/submit/") {
        data = {
          score_percent: 100,
          correct_count: 3,
          total_questions: 3,
          duration_seconds: 90
        };
      } 
      // Handle question listing
      else if (cleanUrl === "/questions/list/") {
        data = {
          questions: [
            {
              id: "q1",
              subject: "Mathematics",
              grade: 10,
              unit: 2,
              topic: "Quadratic Equations",
              question_text_en: "Find the roots of x^2 - 5x + 6 = 0.",
              options: [
                { label: "A", text_en: "1 and 6" },
                { label: "B", text_en: "2 and 3" },
                { label: "C", text_en: "-2 and -3" },
                { label: "D", text_en: "No real roots" }
              ]
            }
          ]
        };
      } 
      // Handle scholarships
      else if (cleanUrl === "/scholarships/" || cleanUrl === "/scholarships/matched/") {
        data = mockData[cleanUrl] || mockData[cleanUrl + "/"] || {};
      } 
      // Handle leaderboard
      else if (cleanUrl === "/leaderboard/") {
        data = mockData[cleanUrl] || mockData[cleanUrl + "/"] || {};
      } 
      // Handle progress overview
      else if (cleanUrl === "/progress/overview/") {
        data = { progress: [{ subject: "Mathematics", topic: "Quadratics", accuracy_percent: 72 }] };
      } 
      // Handle notifications
      else if (cleanUrl === "/notifications/") {
        data = { notifications: [{ id: "notif-1", title: "New model exam available", type: "info", read: false }] };
      } 
      // Handle payment status
      else if (cleanUrl === "/payments/status/") {
        data = { status: "free", renewal_date: null };
      } 
      // Handle payment subscribe
      else if (cleanUrl === "/payments/subscribe/") {
        data = { message: "Subscription request received" };
      } 
      // Default mock fallback
      else {
        data = mockData[cleanUrl] || mockData[cleanUrl + "/"] || mockData[cleanUrl.replace(/\/$/, "")] || {};
      }

      // Simulate network delay and resolve
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        data,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        request: {}
      };
    }

    // Default real network transport
    const defaultAdapter = axios.defaults.adapter;
    if (typeof defaultAdapter === "function") {
      return defaultAdapter(config);
    }
    // Simple fetch fallback in case default adapter is undefined
    return fetch(config.url).then(r => r.json());
  }
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
