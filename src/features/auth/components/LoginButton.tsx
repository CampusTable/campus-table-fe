import styles from "./login-button.module.css";

interface LoginButtonProps {
  label?: string; // 버튼 라벨
  disabled?: boolean; // 활성화/비활성화
}

export default function LoginButton({
  label = "로그인",
  disabled = false,
}: LoginButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={styles.button}
    >
      <span className={styles.label}>{label}</span>
    </button>
  );
}