"use client";

import axios, { AxiosInstance, AxiosResponse } from "axios";

// 🛠 Thay đổi URL này cho khớp với Localhost hoặc Server của Backend C#
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const axiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 giây
});

// 🔍 INTERCEPTORS: Nơi chúng ta "soi" dữ liệu trước khi đến tay UI
axiosClient.interceptors.request.use(
  (config) => {
    // Bạn có thể thêm Token vào đây nếu sau này có phần Login
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
    return response.data; // Trả về data trực tiếp để FE dùng cho gọn
  },
  (error) => {
    // Xử lý lỗi tập trung (VD: Thông báo lỗi từ BE)
    console.error("❌ [API Error]", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default axiosClient;
