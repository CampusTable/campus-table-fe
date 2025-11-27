import styles from "./AdBannerTag.module.css";

interface AdBannerTagProps {
  currentIndex: number;
  totalCount: number;
}

export default function AdBannerTag({
  currentIndex,
  totalCount,
}: AdBannerTagProps) {
  return (
    <div className={styles.container}>
      <div className={styles.label}>
        {currentIndex + 1} / {totalCount}
      </div>
    </div>
  );
};