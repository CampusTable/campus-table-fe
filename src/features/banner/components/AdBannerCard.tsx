import Image from "next/image";
import styles from "./AdBannerCard.module.css";

interface AdBannerCardProps {
  imageUrl: string;
  alt?: string;
}

export default function AdBannerCard({
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
    </div>
  );
}