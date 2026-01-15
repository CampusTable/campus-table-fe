import { ShoppingBagIcon } from "@/assets/icons";
import styles from "./Header.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          LOGO
        </div>
        <Link href="/cart">
          <ShoppingBagIcon />
        </Link>
      </div>
    </div>
  );
};