import LoginForm from "@/features/auth/components/form/LoginForm";
import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      {/* TODO: 추후 로고 삽입 */}
      <div className={styles.logo} />
      <div className={styles.label}>먹고 싶은 학식, 바로 주문해요!</div>
      <LoginForm />
    </div>
  );
};