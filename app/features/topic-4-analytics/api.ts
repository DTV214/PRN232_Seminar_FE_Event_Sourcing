"use client";

import axios, { AxiosResponse } from "axios";
import axiosClient from "@/app/api/axios-client";

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

const unwrapEnvelope = <T>(response: unknown): ApiEnvelope<T> => {
  if (
    response &&
    typeof response === "object" &&
    "statusText" in response &&
    "headers" in response &&
    "config" in response &&
    "data" in response
  ) {
    return (response as AxiosResponse<ApiEnvelope<T>>).data;
  }

  return response as ApiEnvelope<T>;
};

export const requestRegisterOtp = async (
  payload: RequestOtpPayload,
): Promise<ApiEnvelope<null>> => {
  const response = await axiosClient.post(
    "/auth-service/api/auth/register/request-otp",
    payload,
  );
  return unwrapEnvelope<null>(response);
};

export const verifyRegisterOtp = async (
  payload: VerifyOtpPayload,
): Promise<ApiEnvelope<AuthTokenContainer>> => {
  const response = await axiosClient.post(
    "/auth-service/api/auth/register/verify-otp",
    payload,
  );
  return unwrapEnvelope<AuthTokenContainer>(response);
};

export const loginWithBehavior = async (
  payload: LoginPayload,
): Promise<ApiEnvelope<AuthTokenContainer>> => {
  const response = await axiosClient.post("/auth-service/api/auth/login", payload);
  return unwrapEnvelope<AuthTokenContainer>(response);
};

export const getProfile = async (
  accountId: string,
): Promise<ApiEnvelope<UserProfile>> => {
  const response = await axiosClient.get(
    `/userprofile-service/api/profiles/${accountId}`,
  );
  return unwrapEnvelope<UserProfile>(response);
};

export const updateProfile = async (
  accountId: string,
  payload: UpdateProfilePayload,
): Promise<ApiEnvelope<UserProfile>> => {
  const response = await axiosClient.put(
    `/userprofile-service/api/profiles/${accountId}`,
    payload,
  );
  return unwrapEnvelope<UserProfile>(response);
};

export const getUserBehavior = async (
  userId: string,
): Promise<ApiEnvelope<UserBehavior>> => {
  const response = await axiosClient.get(
    `/userbehavior-service/api/user-behaviors/${userId}`,
  );
  return unwrapEnvelope<UserBehavior>(response);
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
