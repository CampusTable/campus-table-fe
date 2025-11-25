import AdBannerTag from "@/features/banner/components/AdBannerTag";
import Image from "next/image";
import styles from "./AdBannerCard.module.css";

interface AdBannerCardProps {
  currentIndex: number;
  totalCount: number;
  imageUrl: string;
  alt?: string;
}

export default function AdBannerCard({
  currentIndex,
  totalCount,
  imageUrl,
  alt = "광고 배너",
}: AdBannerCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="100vw"
          className={styles.image}
        />
      </div>
      <div className={styles.tagWrapper}>
        <AdBannerTag
          currentIndex={currentIndex}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}