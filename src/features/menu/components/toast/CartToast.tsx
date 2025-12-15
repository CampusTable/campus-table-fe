import styles from "./CartToast.module.css";

interface CartToastProps {
  visible: boolean;
  message: string;
}

export default function CartToast({
  visible,
  message,
}: CartToastProps) {

  const containerClassName: string = visible
    ? `${styles.container} ${styles.visible}`
    : styles.container;

  return (
    <div className={containerClassName}>
      <div className={styles.label}>
        {message}
      </div>
    </div>
  );
};