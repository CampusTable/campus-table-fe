"use client";

import styles from "./QuantityStepper.module.css";
import { MinusIcon, PlusDisableIcon, PlusIcon, TrashIcon } from "@/assets/icons";
import { useCart } from "@/features/cart/hooks/useCart";
import { useToast } from "@/shared/hooks/useToast";

interface QuantityStepperProps {
  menuId: number;
  quantity: number;
}

export default function QuantityStepper({
  menuId,
  quantity
}: QuantityStepperProps) {
  const { addToCart, removeFromCart, isAddingToCart } = useCart();
  const { showToast } = useToast();

  const handleIncrement = () => {
    if (quantity >= 9) {
      showToast("메뉴는 최대 9개까지만 담을 수 있어요!");
      return;
    }
    addToCart(menuId, {
      onError: (message) => showToast(message)
    });
  }

  const handleDecrement = () => {
    if (quantity <= 0) {
      return;
    }

    removeFromCart(menuId, {
      onError: (message) => showToast(message)
    });
  }

  const decrementIcon = quantity === 1 ? <TrashIcon /> : <MinusIcon />;
  const incrementIcon = quantity !== 9 ? <PlusIcon /> : <PlusDisableIcon />;
  const isPlusDisabled = quantity >= 9

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <button
          onClick={handleDecrement}
          disabled={isAddingToCart}
        >
          {decrementIcon}
        </button>
        <div className={styles.label}>
          {quantity}
        </div>
        <button
          onClick={handleIncrement}
          disabled={isPlusDisabled}
        >
          {incrementIcon}
        </button>
      </div>
    </div>
  );
}