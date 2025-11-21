export function isValidSubmit(username: string, password: string): boolean {
  const trimmedUsername: string = username.trim();
  const trimmedPassword: string = password.trim();

  // 임시 에러 username 선언 TODO: 추후 제거 필수
  const errorUsername: boolean = trimmedUsername === "22011315";
  return trimmedUsername.length !== 0 && trimmedPassword.length !== 0 && !errorUsername;
}

export function isDisabled(username: string, password: string, loading: boolean): boolean {
  return username.trim().length === 0 || password.trim().length === 0 || loading;
}