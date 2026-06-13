// src/utils/axios.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_PROD_LINK || import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;
