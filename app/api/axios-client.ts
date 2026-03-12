"use client";

import axios, { AxiosInstance, AxiosResponse } from "axios";

// 🛠 Mặc định trỏ về API Gateway dùng chung của cả nhóm (Cổng 5092)
// Nếu ai muốn dùng port riêng thì sẽ cấu hình ghi đè ở file API của người đó
const BASE_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:5092";

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
