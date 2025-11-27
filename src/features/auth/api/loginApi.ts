import { apiClient } from "@/shared/lib/api/apiClient";

export interface LoginRequest {
  sejongPortalId: string;
  sejongPortalPw: string;
}

export async function login(request: LoginRequest):Promise<void> {
  return await apiClient.post("/api/auth/login", request);
}
