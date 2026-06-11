import axios from "axios";

export const api = axios.create({ baseURL: "" });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ld_admin_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("ld_admin_token") : null;

export const setToken = (token: string) =>
  typeof window !== "undefined" && localStorage.setItem("ld_admin_token", token);

export const clearToken = () =>
  typeof window !== "undefined" && localStorage.removeItem("ld_admin_token");
