"use client";
import { apiClient } from "@/shared/lib/api/apiClient";
import { LoginRequest, LoginResponse } from "@/features/auth/types/loginTypes";

export async function login(request: LoginRequest): Promise<LoginResponse> {
  return await apiClient.post("/api/auth/login", request);
}
