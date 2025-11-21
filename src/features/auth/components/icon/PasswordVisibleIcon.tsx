import { EyesHideIcon, EyesSeeIcon } from "@/assets/icons";
import styles from "./password-visible-icon.module.css";

interface PasswordVisibleIconProps {
  onClick: () => void;
  isVisible: boolean;
}

export default function PasswordVisibleIcon({
  onClick,
  isVisible,
}: PasswordVisibleIconProps) {
  return (
    <button
      type="button"
      className={styles.eyeButton}
      onClick={onClick}
    >
      {isVisible ? <EyesSeeIcon /> : <EyesHideIcon />}
    </button>
  );
}