import styles from "./ad-banner-tag.module.css";

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
        {currentIndex} / {totalCount}
      </div>
    </div>
  );
};