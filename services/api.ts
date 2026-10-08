import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import useAuthStore from "../store/authStore";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

interface ExtendedConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && token !== "demo-token") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as ExtendedConfig | undefined;

    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    if (
      config &&
      config.method?.toLowerCase() === "get" &&
      !config._retry &&
      (!error.response || (error.response.status >= 500 && error.response.status <= 504))
    ) {
      config._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 400));
      return api(config);
    }

    let userMessage = "An unexpected error occurred. Please try again.";
    if (!error.response) {
      userMessage = "Network connection timeout or server unreachable.";
    } else {
      const data = error.response.data as Record<string, any> | undefined;
      if (data?.message && typeof data.message === "string") {
        userMessage = data.message;
      } else if (data?.detail && typeof data.detail === "string") {
        userMessage = data.detail;
      } else if (error.response.status === 403) {
        userMessage = "Access restricted for this resource.";
      } else if (error.response.status === 404) {
        userMessage = "Requested resource not found.";
      } else if (error.response.status === 429) {
        userMessage = "Too many requests. Please wait a moment.";
      } else if (error.response.status >= 500) {
        userMessage = "Server error. Please retry shortly.";
      }
    }

    (error as any).userMessage = userMessage;
    return Promise.reject(error);
  }
);

export default api;
