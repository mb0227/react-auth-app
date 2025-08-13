import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
  broadcastLogout,
} from "./tokenStorage";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5261",
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => {
    const newAccess = response.headers?.["x-new-access-token"];
    const newRefresh = response.headers?.["x-new-refresh-token"];
    if (newAccess) setAccessToken(newAccess);
    if (newRefresh) setRefreshToken(newRefresh);
    return response;
  },
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403 || status === 419 || status === 498) {
      clearTokens();
      broadcastLogout(); 
    }

    return Promise.reject(error);
  }
);

export default API;