import { ShoppingBag } from "@/assets/icons";
import styles from "./header.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          LOGO
        </div>
        <ShoppingBag />
      </div>
    </div>
  );
};