import api from "./api";

export const requestOtp = (payload) => api.post("/auth/request-otp/", payload);
export const verifyOtp = (payload) => api.post("/auth/verify-otp/", payload);
export const logout = () => api.post("/auth/logout/");
