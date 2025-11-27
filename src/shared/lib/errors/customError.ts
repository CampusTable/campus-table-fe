import { ERROR_MESSAGE, ErrorCode } from "@/shared/lib/errors/errorCodes";

export class CustomError extends Error {
  public readonly errorCode: ErrorCode;
  public readonly httpStatus: number;
  public readonly errorMessage: string;

  constructor(
    errorCode: ErrorCode,
    httpStatus: number,
    errorMessage?: string
  ) {
    const message: string = ERROR_MESSAGE[errorCode] || "알 수 없는 오류가 발생했습니다.";
    super(message);

    this.name = "CustomError";
    this.errorCode = errorCode;
    this.httpStatus = httpStatus;
    this.errorMessage = message;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}