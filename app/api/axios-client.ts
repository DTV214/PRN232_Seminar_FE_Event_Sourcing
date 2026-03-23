"use client";

import axios, { AxiosInstance, AxiosResponse } from "axios";

// 🛠 Production: dùng /api/proxy để tránh Mixed Content (HTTPS→HTTP)
// Local dev: trỏ thẳng tới API Gateway
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/proxy"
    : (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://14.225.207.221:5092");

const axiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 [API Request] ${config.method?.toUpperCase()} - ${config.url}`,
    );
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ [API Response] Success from: ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error("❌ [API Error]", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default axiosClient;
