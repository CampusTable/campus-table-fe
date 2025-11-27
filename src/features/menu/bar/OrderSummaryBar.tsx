"use client";

import styles from "./OrderSummaryBar.module.css";
import { formatNumberWithComma } from "@/shared/utils/number/utils";
import CartButton, { ItemCount } from "@/features/menu/button/CartButton";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";

interface OrderSummaryBarProps {
  totalPrice: number;
  itemCount: ItemCount;
}

export default function OrderSummaryBar({
  totalPrice,
  itemCount,
}: OrderSummaryBarProps) {

  const router = useRouter();

  const handleCartButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    router.replace("/cart");
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.labelWrapper}>
          <div className={styles.label}>
            주문 예정 금액
          </div>
          <div className={styles.totalPrice}>
            {formatNumberWithComma(totalPrice)}원
          </div>
        </div>
        <div className={styles.buttonWrapper}>
          <CartButton
            itemCount={itemCount}
            onClick={handleCartButtonClick}
          />
        </div>
      </div>
    </div>
  );
};