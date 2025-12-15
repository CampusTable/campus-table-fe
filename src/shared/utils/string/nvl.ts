export type NullableString = string | null | undefined;

function isNullLikeString(value: NullableString): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  const trimmed: string = value.trim();

  if (trimmed.length === 0) {
    // "" 또는 "  " 인 경우
    return true;
  }

  if (trimmed.toLowerCase() === "null") {
    return true;
  }

  return false;
}

export function nvl(value: NullableString): string;
export function nvl(value: NullableString, defaultValue: string): string;

export function nvl(value: NullableString, defaultValue?: string): string {
  const fallback: string = defaultValue !== undefined ? defaultValue : "";

  if (isNullLikeString(value)) {
    return fallback;
  }

  if (typeof value === "string") {
    return value;
  }

  return fallback;
}