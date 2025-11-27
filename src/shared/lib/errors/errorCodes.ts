// 백엔드 에러코드 정의

export enum ErrorCode {
  // Global
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',

  // AUTH
  AUTH_FAILED = 'AUTH_FAILED',
}

// 에러 메시지 매핑
export const ERROR_MESSAGE: Record<ErrorCode, string> = {
  [ErrorCode.UNAUTHORIZED]: '로그인이 필요합니다.',
  [ErrorCode.FORBIDDEN]: '잘못된 접근입니다.',
  [ErrorCode.INTERNAL_SERVER_ERROR]: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  [ErrorCode.NETWORK_ERROR]: '네트워크 연결을 확인해주세요.',
  [ErrorCode.TIMEOUT_ERROR]: '요청 시간이 초과되었습니다.',
  [ErrorCode.UNKNOWN_ERROR]: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  [ErrorCode.AUTH_FAILED]: '학번 및 비밀번호를 다시 확인하세요',
}