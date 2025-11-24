/**
 * 숫자를 "6,000", "13,500" 처럼 천 단위 콤마가 들어간 문자열로 변환
 */
export function formatNumberWithComma(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: 0
  }).format(value);
}
