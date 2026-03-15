"use client";

import axios, { AxiosResponse } from "axios";

export interface ApiEnvelope<T> {
  status: number;
  msg: string;
  data: T | null;
}

export interface RequestOtpPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  loggedInAt: string;
  sessionDurationMinutes: number;
}

export interface AuthTokenPayload {
  accountId: string;
  email: string;
  status: string;
  loggedInAt?: string;
  sessionDurationMinutes?: number;
  message?: string;
}

export interface AuthTokenContainer {
  token: AuthTokenPayload;
}

export interface UserProfile {
  accountId: string;
  email: string;
  fullName: string | null;
  dob: string | null;
  gender: string | null;
  address: string | null;
  id: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface UpdateProfilePayload {
  fullName?: string | null;
  dob?: string | null;
  gender?: string | null;
  address?: string | null;
}

export interface UserBehavior {
  userId: string;
  email: string;
  currentStatus: string;
  loginCount: number;
  firstLoginAt: string | null;
  lastLoginAt: string | null;
  profileUpdateCount: number;
  lastProfileUpdatedAt: string | null;
  preferredLoginHour: number | null;
  mostActiveWeekday: string | null;
  averageDaysBetweenLogins: number;
  estimatedActiveDaysSpan: number;
  averageSessionDurationMinutes: number;
}

const GATEWAY_BASE_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://14.225.207.221:5092";

const authClient = axios.create({
  baseURL: GATEWAY_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const profileClient = axios.create({
  baseURL: GATEWAY_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const behaviorClient = axios.create({
  baseURL: GATEWAY_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const requestRegisterOtp = async (
  payload: RequestOtpPayload,
): Promise<ApiEnvelope<null>> => {
  const response: AxiosResponse<ApiEnvelope<null>> = await authClient.post(
    "/auth-service/api/auth/register/request-otp",
    payload,
  );
  return response.data;
};

export const verifyRegisterOtp = async (
  payload: VerifyOtpPayload,
): Promise<ApiEnvelope<AuthTokenContainer>> => {
  const response: AxiosResponse<ApiEnvelope<AuthTokenContainer>> =
    await authClient.post("/auth-service/api/auth/register/verify-otp", payload);
  return response.data;
};

export const loginWithBehavior = async (
  payload: LoginPayload,
): Promise<ApiEnvelope<AuthTokenContainer>> => {
  const response: AxiosResponse<ApiEnvelope<AuthTokenContainer>> =
    await authClient.post("/auth-service/api/auth/login", payload);
  return response.data;
};

export const getProfile = async (
  accountId: string,
): Promise<ApiEnvelope<UserProfile>> => {
  const response: AxiosResponse<ApiEnvelope<UserProfile>> = await profileClient.get(
    `/userprofile-service/api/profiles/${accountId}`,
  );
  return response.data;
};

export const updateProfile = async (
  accountId: string,
  payload: UpdateProfilePayload,
): Promise<ApiEnvelope<UserProfile>> => {
  const response: AxiosResponse<ApiEnvelope<UserProfile>> = await profileClient.put(
    `/userprofile-service/api/profiles/${accountId}`,
    payload,
  );
  return response.data;
};

export const getUserBehavior = async (
  userId: string,
): Promise<ApiEnvelope<UserBehavior>> => {
  const response: AxiosResponse<ApiEnvelope<UserBehavior>> = await behaviorClient.get(
    `/userbehavior-service/api/user-behaviors/${userId}`,
  );
  return response.data;
};

export const getErrorMessage = (
  error: unknown,
  fallback: string = "Có lỗi xảy ra. Vui lòng thử lại.",
): string => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { msg?: string; message?: string; title?: string }
      | undefined;
    return (
      responseData?.msg ??
      responseData?.message ??
      responseData?.title ??
      error.message ??
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
