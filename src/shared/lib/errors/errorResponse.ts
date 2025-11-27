import { ErrorCode } from "@/shared/lib/errors/errorCodes";
import { CustomError } from "@/shared/lib/errors/customError";

export interface ErrorResponse {
  errorCode: ErrorCode;
  errorMessage: string;
}

/**
 * 공통 에러 응답 처리 유틸 메서드
 */
export async function handleErrorResponse(response: Response): Promise<never> {
  let errorResponse: ErrorResponse;
  try {
    errorResponse = await response.json();
  } catch {
    // JSON 파싱 실패 시 기본 에러 응답 사용
    throw new CustomError(ErrorCode.UNKNOWN_ERROR, response.status);
  }

  if (Object.values(ErrorCode).includes(errorResponse.errorCode)) {
    throw new CustomError(errorResponse.errorCode, response.status, errorResponse.errorMessage);
  }

  // 알 수 없는 에러코드인 경우
  throw new CustomError(ErrorCode.UNKNOWN_ERROR, response.status, errorResponse.errorMessage);
}