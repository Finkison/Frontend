import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import useAuthStore, { type User } from "../store/authStore";
import i18n from "../i18n";

function resolveApiBaseURL(): string {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
  if (
    import.meta.env.PROD &&
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    (!envUrl || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(envUrl))
  ) {
    return "/api";
  }
  return envUrl || "/api";
}

const configuredBaseURL = resolveApiBaseURL().replace(/\/+$/, "");
const baseURL = configuredBaseURL.endsWith("/v1") ? configuredBaseURL : `${configuredBaseURL}/v1`;

interface ExtendedConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshedTokens {
  accessToken: string;
}

interface ApiErrorWithUserMessage extends AxiosError<unknown> {
  userMessage?: string;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function firstString(record: Record<string, unknown> | undefined, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
}

function getUserMessage(error: AxiosError<unknown>): string {
  if (!error.response) return i18n.t("errors.network");

  const data = asRecord(error.response.data);
  const directMessage = firstString(data, ["message", "detail", "error"]);
  if (directMessage && !/^[a-z0-9]+(?:_[a-z0-9]+)+$/i.test(directMessage)) return directMessage;

  const details = data?.detail;
  if (Array.isArray(details) && details.length > 0) {
    const firstDetail = asRecord(details[0]);
    return firstString(firstDetail, ["msg", "message"]) || i18n.t("errors.validation");
  }

  if ([400, 422].includes(error.response.status)) return i18n.t("errors.validation");
  if (error.response.status === 403) return i18n.t("errors.accessRestricted");
  if (error.response.status === 404) return i18n.t("errors.notFound");
  if (error.response.status === 429) return i18n.t("errors.tooManyRequests");
  if (error.response.status >= 500) return i18n.t("errors.server");
  return i18n.t("errors.unexpected");
}

export function getApiErrorMessage(error: unknown): string | undefined {
  if (axios.isAxiosError<unknown>(error)) {
    return (error as ApiErrorWithUserMessage).userMessage || getUserMessage(error);
  }
  return error instanceof Error ? error.message : undefined;
}

let refreshPromise: Promise<RefreshedTokens> | null = null;

async function refreshAuthTokens(): Promise<RefreshedTokens> {
  if (!refreshPromise) {
    const refreshUrl = `${baseURL.replace(/\/$/, "")}/auth/refresh/`;
    const legacyRefreshToken = useAuthStore.getState().legacyRefreshToken;
    refreshPromise = axios
      .post<unknown>(
        refreshUrl,
        legacyRefreshToken ? { refresh_token: legacyRefreshToken } : {},
        { timeout: 20000, withCredentials: true }
      )
      .then((response) => {
        const responseBody = asRecord(response.data);
        const data = asRecord(responseBody?.data) || responseBody;
        const accessToken = firstString(data, ["access_token", "accessToken", "token"]);
        if (!accessToken) throw new Error("The refresh response did not include an access token.");
        useAuthStore.getState().clearLegacyRefreshToken();
        useAuthStore.getState().setTokens(accessToken);
        return { accessToken };
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

const api = axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<unknown>) => {
    if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    const config = error.config as ExtendedConfig | undefined;

    if (error.response?.status === 401 && config) {
      const url = config.url || "";
      const isAuthRequest = /\/auth\/(login|register|refresh|verify-otp|request-otp)/i.test(url);
      if (!isAuthRequest) {
        const authState = useAuthStore.getState();
        if (!config._retry && authState.sessionInitialized && authState.isAuthenticated) {
          config._retry = true;
          try {
            const tokens = await refreshAuthTokens();
            config.headers.Authorization = `Bearer ${tokens.accessToken}`;
            return api(config);
          } catch {
            useAuthStore.getState().logout();
          }
        } else {
          useAuthStore.getState().logout();
        }
      }
    }

    if (
      config &&
      config.method?.toLowerCase() === "get" &&
      !config._retry &&
      (!error.response || [500, 502, 503, 504].includes(error.response.status))
    ) {
      config._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 400));
      return api(config);
    }

    (error as ApiErrorWithUserMessage).userMessage = getUserMessage(error);
    return Promise.reject(error);
  }
);

export async function authenticatedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const url = `${baseURL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
  const headers = new Headers(init.headers);
  const token = useAuthStore.getState().token;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response = await fetch(url, { ...init, headers, credentials: "include" });
  if (response.status !== 401 || init.signal?.aborted) return response;

  const authState = useAuthStore.getState();
  if (!authState.sessionInitialized || !authState.isAuthenticated) {
    useAuthStore.getState().logout();
    return response;
  }

  try {
    const tokens = await refreshAuthTokens();
    headers.set("Authorization", `Bearer ${tokens.accessToken}`);
    response = await fetch(url, { ...init, headers, credentials: "include" });
  } catch {
    useAuthStore.getState().logout();
    return response;
  }

  if (response.status === 401) useAuthStore.getState().logout();
  return response;
}

let sessionInitializationPromise: Promise<void> | null = null;

export function initializeAuthSession(): Promise<void> {
  const authState = useAuthStore.getState();
  if (authState.sessionInitialized) return Promise.resolve();
  if (!authState.user && !authState.legacyRefreshToken) {
    authState.setSessionInitialized(true);
    return Promise.resolve();
  }
  if (sessionInitializationPromise) return sessionInitializationPromise;

  sessionInitializationPromise = (async () => {
    try {
      const tokens = await refreshAuthTokens();
      const response = await api.get<unknown>("/auth/me/");
      const responseBody = asRecord(response.data);
      const data = asRecord(responseBody?.data) || responseBody;
      const user = asRecord(data?.user) || asRecord(data?.profile);
      const role = firstString(user, ["role"]);
      if (!user || !role) throw new Error("The current account profile could not be restored.");
      useAuthStore.getState().login(user as unknown as User, role, tokens.accessToken);
    } catch {
      useAuthStore.getState().logout();
    } finally {
      useAuthStore.getState().setSessionInitialized(true);
      sessionInitializationPromise = null;
    }
  })();

  return sessionInitializationPromise;
}

export default api;
