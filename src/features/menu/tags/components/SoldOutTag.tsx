import styles from "./sold-out-tag.module.css";

export default function SoldOutTag() {
  return (
    <div className={styles.container}>
      <div className={styles.label}>
        품절
      </div>
    </div>
  );
}