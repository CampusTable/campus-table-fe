import styles from "./EmptyCartView.module.css";
import { PleadingFaceIcon } from "@/assets/icons";
import Link from "next/link";

export default function EmptyCartView() {
  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>
          아무것도 없어요
        </div>
        <PleadingFaceIcon />
      </div>
      <div className={styles.subTitle}>
        메뉴를 둘러 보고, 먹고 싶은 메뉴를 바로 담아봐요
      </div>


      <div className={styles.buttonWrapper}>
        <Link href="/">
          <div className={styles.homeButton}>
            <div className={styles.homeButtonLabel}>
              인기 순위 보기
            </div>
          </div>
        </Link>

        <Link href="/hakgwan">
          <div className={styles.menuButton}>
            <div className={styles.menuButtonLabel}>
              메뉴 둘러보기
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};