import React, { MouseEventHandler } from "react";
import styles from "./CartButton.module.css";
import RoundedNumber from "@/shared/components/number/RoundedNumber";

interface CartButtonProps {
  quantity: number;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function CartButton({
  quantity,
  onClick,
}: CartButtonProps) {

  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.button}
    >
      <div className={styles.labelWrapper}>
        <div className={styles.icon}>
          <RoundedNumber
            number={quantity}
            filled={false}
          />
        </div>
        <div className={styles.label}>
          장바구니 보기
        </div>
      </div>
    </button>
  );
};