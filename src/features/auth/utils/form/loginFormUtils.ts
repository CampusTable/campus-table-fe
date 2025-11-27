export function isValidSubmit(username: string, password: string): boolean {
  const trimmedUsername: string = username.trim();
  const trimmedPassword: string = password.trim();

  return trimmedUsername.length !== 0 && trimmedPassword.length !== 0;
}

export function isDisabled(username: string, password: string, loading: boolean): boolean {
  return username.trim().length === 0 || password.trim().length === 0 || loading;
}