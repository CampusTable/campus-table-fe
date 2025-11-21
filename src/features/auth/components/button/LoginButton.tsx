import styles from "./login-button.module.css";
import LoadingDots from "@/shared/components/loading/dot/LoadingDots";

interface LoginButtonProps {
  label?: string; // 버튼 라벨
  disabled?: boolean; // 활성화/비활성화
  loading?: boolean; // 로딩 중
}

export default function LoginButton({
  label = "로그인",
  disabled = false,
  loading = false,
}: LoginButtonProps) {
  const isDisabled: boolean = disabled || loading;
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={styles.button}
    >
      {loading ? <LoadingDots /> : <span className={styles.label}>{label}</span>}
    </button>
  );
}