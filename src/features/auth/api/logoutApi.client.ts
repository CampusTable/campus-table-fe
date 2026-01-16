"use client";
import { apiClient } from "@/shared/lib/api/apiClient";

export async function logout(): Promise<void> {
  await apiClient.post("/api/auth/logout");
}