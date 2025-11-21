import { ErrorCircleFilled } from "@/assets/icons";
import styles from "./login-form-error-label.module.css";

interface LoginFormErrorLabelProps {
  visible?: boolean;
}

export default function LoginFormErrorLabel({
  visible = false,
}: LoginFormErrorLabelProps) {

  const containerClassName: string = visible
    ? styles.container
    : `${styles.container} ${styles.containerHidden}`;

  return (
    <div className={containerClassName}>
      <ErrorCircleFilled />
      <span className={styles.label}>학번 및 비밀번호를 다시 확인하세요</span>
    </div>
  );
}