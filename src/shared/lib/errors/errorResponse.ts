import { ErrorCode } from "@/shared/lib/errors/errorCodes";
import { CustomError } from "@/shared/lib/errors/customError";

export interface ErrorResponse {
  errorCode: string;
  errorMessage: string;
}

function isValidErrorCode(errorCode: string): errorCode is ErrorCode {
  const values: string[] = Object.values(ErrorCode);
  return values.includes(errorCode);
}

/**
 * 공통 에러 응답 처리 유틸 메서드
 */
export async function handleErrorResponse(response: Response): Promise<never> {
  let errorResponse: ErrorResponse;
  try {
    errorResponse = (await response.json()) as ErrorResponse;
  } catch {
    // JSON 파싱 실패 시 기본 에러 응답 사용
    throw new CustomError(ErrorCode.UNKNOWN_ERROR, response.status);
  }

  const rawErrorCode: string | undefined = errorResponse.errorCode;

  // 명시된 ErrorCode 인 경우
  if (rawErrorCode && isValidErrorCode(rawErrorCode)) {
    throw new CustomError(rawErrorCode, response.status, errorResponse.errorMessage);
  }

  // 명시되지 않은 ErrorCode 인 경우
  if (response.status === 400) {
    throw new CustomError(ErrorCode.BAD_REQUEST, response.status);
  }

  if (response.status === 401) {
    throw new CustomError(ErrorCode.UNAUTHORIZED, response.status);
  }

  if (response.status === 403) {
    throw new CustomError(ErrorCode.FORBIDDEN, response.status);
  }

  if (response.status >= 500) {
    throw new CustomError(ErrorCode.INTERNAL_SERVER_ERROR, response.status);
  }

  // 알 수 없는 에러코드인 경우
  throw new CustomError(ErrorCode.UNKNOWN_ERROR, response.status);
}