import { EyesHideIcon, EyesSeeIcon } from "@/assets/icons";
import styles from "./PasswordVisibleIcon.module.css";

interface PasswordVisibleIconProps {
  onClick: () => void;
  isVisible: boolean;
  disabled?: boolean;
}

export default function PasswordVisibleIcon({
  onClick,
  isVisible,
  disabled = false,
}: PasswordVisibleIconProps) {
  return (
    <button
      type="button"
      className={styles.eyeButton}
      onClick={onClick}
      disabled={disabled}
    >
      {isVisible ? <EyesSeeIcon /> : <EyesHideIcon />}
    </button>
  );
}