import { ErrorCircleFilled } from "@/assets/icons";
import styles from "./LoginFormErrorLabel.module.css";

interface LoginFormErrorLabelProps {
  visible?: boolean;
  message: string;
}

export default function LoginFormErrorLabel({
  visible = false,
  message,
}: LoginFormErrorLabelProps) {

  const containerClassName: string = visible
    ? styles.container
    : `${styles.container} ${styles.containerHidden}`;

  return (
    <div className={containerClassName}>
      <ErrorCircleFilled />
      <span className={styles.label}>{message}</span>
    </div>
  );
}