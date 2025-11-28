import styles from "./CategoryButton.module.css";

interface CategoryButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function CategoryButton({
  label,
  active,
  onClick
}: CategoryButtonProps) {

  const containerClassName: string = active ? `${styles.container} ${styles.containerActive}` : styles.container;
  const labelClassName: string = active ? `${styles.label} ${styles.labelActive}` : styles.label;

  const handleClick = (): void => {
    if (active) {
      return;
    }
    onClick();
  }

  return (
    <button
      type="button"
      disabled={active}
      onClick={handleClick}
      className={containerClassName}
    >
      <div className={labelClassName}>
        {label}
      </div>
    </button>
  );
};