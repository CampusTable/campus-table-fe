export interface LoginRequest {
  sejongPortalId: string,
  sejongPortalPw: string,
}

export interface LoginApiResponse {
  studentNumber: string;
  studentName: string;
  accessToken: string;
  refreshToken: string;
  maxAgeSeconds: number;
  newUser: boolean;
}

export interface LoginResponse {
  studentNumber: string;
  studentName: string;
  newUser: boolean;
}