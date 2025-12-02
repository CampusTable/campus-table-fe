export interface ReissueRequest {
  refreshToken: string;
}

export interface ReissueResponse {
  accessToken: string,
  refreshToken: string,
  maxAge: number;
}