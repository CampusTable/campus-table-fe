import styles from "./PopularTag.module.css";

type Rank = 1 | 2 | 3;

interface PopularTagProps {
  rank: Rank;
}

export default function PopularTag({
  rank,
}: PopularTagProps) {

  return (
    <div className={styles.container}>
      <div className={styles.label}>
        인기 {rank}위
      </div>
    </div>
  );
};