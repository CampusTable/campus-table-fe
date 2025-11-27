// 인증이 필요없는 페이지
const AUTH_WHITELIST: string[] = [
  "/login",
  "/privacy",
];

// 인증된 상태에서는 접근할 수 없는 페이지
const AUTH_PAGE: string[] = [
  "/login",
];

export { AUTH_WHITELIST, AUTH_PAGE };