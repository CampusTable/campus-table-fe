import { ERROR_MESSAGE, ErrorCode } from "@/shared/lib/errors/errorCodes";
import { CustomError } from "@/shared/lib/errors/customError";
import { NextResponse } from "next/server";

export interface ErrorResponse {
  errorCode: string;
  errorMessage: string;
}

function isValidErrorCode(errorCode: string): errorCode is ErrorCode {
  const values: string[] = Object.values(ErrorCode);
  return values.includes(errorCode);
}

/**
 * 공통 에러 핸들러 (throw CustomError)
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
    throw new CustomError(rawErrorCode, response.status);
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

/**
 * 서버에서 발생한 에러를 클라이언트에게 내려줄 JSON 으로 변환
 */
export function createErrorNextResponse(error: unknown): NextResponse {
  console.error("[BFF] 백엔드 API 요청 처리 중 오류:", error);
  if (error instanceof CustomError) {
    return NextResponse.json(
      {
        errorCode: error.errorCode,
        errorMessage: error.errorMessage,
      },
      { status: error.httpStatus },
    );
  }

  console.error("[BFF] 에러 응답 처리 중 알 수 없는 오류:", error);
  return NextResponse.json(
    {
      errorCode: ErrorCode.UNKNOWN_ERROR,
      errorMessage: ERROR_MESSAGE[ErrorCode.UNKNOWN_ERROR],
    },
    { status: 500 },
  );
}