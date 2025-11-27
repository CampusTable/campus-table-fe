import styles from "./LoadingDots.module.css";

export default function LoadingDots() {
  return (
    <span className={styles.loader}>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  );
};