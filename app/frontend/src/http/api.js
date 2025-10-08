import axios from "axios";

export const authAPI = axios.create({
  baseURL: `http://localhost:8000/auth`,
});
authAPI.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

export const appAPI = axios.create({
  baseURL: `http://localhost:8000/app`,
});
appAPI.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});
