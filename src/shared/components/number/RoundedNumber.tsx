import styles from "./RoundedNumber.module.css";

interface RoundedNumberProps {
  number: number;
  filled?: boolean;
}

export default function RoundedNumber({
  number,
  filled = true,
}: RoundedNumberProps) {

  const containerClassName = filled
    ? `${styles.container} ${styles.containerFilled}`
    : styles.container;

  const labelClassName = filled
    ? `${styles.label} ${styles.labelFilled}`
    : styles.label;

  return (
    <div className={containerClassName}>
      <div className={labelClassName}>
        {number}
      </div>
    </div>
  );
}