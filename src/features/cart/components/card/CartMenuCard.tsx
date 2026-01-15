"use client";

import styles from "./CartMenuCard.module.css";
import Image from "next/image";
import PopularTag from "@/features/menu/components/tags/PopularTag";
import { formatNumberWithComma } from "@/shared/utils/number/utils";
import QuantityStepper from "@/features/cart/components/button/QuantityStepper";

type Rank = 1 | 2 | 3;

interface CartMenuCardProps {
  menuId: number;
  imageSrc: string;
  title: string;
  price: number;
  quantity: number;
  rank?: Rank;
  onClickAdd?: (menuId: number) => void;
}

export default function CartMenuCard({
  menuId,
  imageSrc,
  title,
  price,
  quantity,
  rank,
}: CartMenuCardProps) {

  const hasTag = typeof rank !== "undefined";

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <Image
          src={imageSrc}
          alt={"메뉴사진"}
          fill
          className={styles.image}
        />
      </div>

      <div className={styles.labelWrapper}>
        {hasTag && <PopularTag rank={rank} />}
        <div className={styles.title}>
          {title}
        </div>
        <div className={styles.price}>
          {formatNumberWithComma(price)}원
        </div>
      </div>

      <div className={styles.stepperWrapper}>
        <QuantityStepper
          menuId={menuId}
          quantity={quantity}
        />
      </div>
    </div>
  );
}