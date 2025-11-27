"use client";

import CartToast from "@/features/menu/toast/CartToast";
import { useState } from "react";

export default function CartPage() {
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  const handleClick = (): void => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1500);
  }
  return (
    <div className="w-full">
      장바구니 페이지
      <button
        type="button"
        onClick={handleClick}
      >
        토스트
      </button>
      <CartToast
        visible={toastVisible}
        message="장바구니에 쏙 담았어요!"
      />
    </div>
  );
}