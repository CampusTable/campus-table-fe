import styles from "./menu-card.module.css";
import Image from "next/image";
import { formatNumberWithComma } from "@/shared/utils/number/utils";
import { AddMenuButton } from "@/assets/icons";
import SoldOutTag from "@/features/menu/tags/components/SoldOutTag";
import PopularTag from "@/features/menu/tags/components/PopularTag";

type Rank = 1 | 2 | 3;

interface MenuCardProps {
  imageSrc: string;
  title: string;
  price: number;
  rank?: Rank;
  soldOut?: boolean;
  onClickAdd?: () => void;
}

export default function MenuCard({
  imageSrc,
  title,
  price,
  rank,
  soldOut = false,
  onClickAdd,
}: MenuCardProps) {

  const labelWrapperClassName: string = soldOut || rank
    ? `${styles.labelWrapper} ${styles.labelWrapperWithTag}`
    : styles.labelWrapper;

  const titleClassName: string = soldOut
    ? `${styles.title} ${styles.soldOut}`
    : styles.title;

  const priceClassName: string = soldOut
    ? `${styles.price} ${styles.soldOut}`
    : styles.price;

  const imageClassName: string = soldOut
    ? `${styles.image} ${styles.image}`
    : styles.image;

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <Image
          src={imageSrc}
          alt="메뉴사진"
          fill
          className={imageClassName}
        />
      </div>

      <div className={labelWrapperClassName}>
        {(soldOut || rank) && (
          <div className={styles.tagWrapper}>
            {soldOut && <SoldOutTag />}
            {rank && <PopularTag rank={rank} />}
          </div>
        )}
        <div className={titleClassName}>
          {title}
        </div>
        <div className={priceClassName}>
          {formatNumberWithComma(price)}원
        </div>
      </div>

      {!soldOut && (
        <button
          type="button"
          onClick={onClickAdd}
          className={styles.button}
        >
          <AddMenuButton />
        </button>
      )}
    </div>
  );
}
