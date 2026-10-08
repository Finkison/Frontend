import api from "./api";

export const requestOtp = (payload: { phone?: string; email?: string }) =>
  api.post("/auth/request-otp/", payload);

export const verifyOtp = (payload: { phone?: string; email?: string; otp: string; role?: string; full_name?: string }) =>
  api.post("/auth/verify-otp/", payload);

export const logout = () => api.post("/auth/logout/");

export const forgotPassword = (payload: { identifier: string }) =>
  api.post("/auth/forgot-password/", payload);

export const resetPassword = (payload: { identifier: string; otp: string; new_password: string }) =>
  api.post("/auth/reset-password/", payload);

