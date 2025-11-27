"use client";

import styles from "./MenuCard.module.css";
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

  const hasTag: boolean = soldOut || typeof rank !== "undefined";

  const labelWrapperClassName: string = hasTag
    ? `${styles.labelWrapper} ${styles.labelWrapperWithTag}`
    : styles.labelWrapper;

  const titleClassName: string = soldOut
    ? `${styles.title} ${styles.soldOut}`
    : styles.title;

  const priceClassName: string = soldOut
    ? `${styles.price} ${styles.soldOut}`
    : styles.price;

  const imageClassName: string = soldOut
    ? `${styles.image} ${styles.soldOut}`
    : styles.image;

  const handleOnClickAdd = ():void => {
    if (soldOut) {
      return;
    }
    // TODO: 임시 버튼 이벤트 (추후 교체)
    // onClickAdd();
    alert("버튼클릭~");
  }

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
        {hasTag && (
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
          onClick={handleOnClickAdd}
          className={styles.button}
        >
          <AddMenuButton />
        </button>
      )}
    </div>
  );
}
