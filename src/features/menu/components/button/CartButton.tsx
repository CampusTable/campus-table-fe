import React, { ComponentType, MouseEventHandler } from "react";
import styles from "./CartButton.module.css";
import {
  RoundedNumber1,
  RoundedNumber2,
  RoundedNumber3,
  RoundedNumber4,
  RoundedNumber5,
  RoundedNumber6,
  RoundedNumber7,
  RoundedNumber8,
  RoundedNumber9
} from "@/assets/icons";

interface CartButtonProps {
  itemCount: ItemCount;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export type ItemCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const IconMap: Record<ItemCount, ComponentType<React.SVGProps<SVGSVGElement>>> = {
  1: RoundedNumber1,
  2: RoundedNumber2,
  3: RoundedNumber3,
  4: RoundedNumber4,
  5: RoundedNumber5,
  6: RoundedNumber6,
  7: RoundedNumber7,
  8: RoundedNumber8,
  9: RoundedNumber9,
};

export default function CartButton({
  itemCount,
  onClick,
}: CartButtonProps) {

  const Icon = IconMap[itemCount];

  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.button}
    >
      <div className={styles.labelWrapper}>
        <Icon className={styles.icon} />
        <div className={styles.label}>
          장바구니 보기
        </div>
      </div>
    </button>
  );
};