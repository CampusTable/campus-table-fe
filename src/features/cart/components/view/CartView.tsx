"use client";

import CartMenuList from "@/features/cart/components/list/CartMenuList";
import styles from "./CartView.module.css";
import PaymentBar from "@/features/cart/components/bar/PaymentBar";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/hooks/useCart";
import EmptyCartView from "@/features/cart/components/view/EmptyCartView";

export default function CartView() {

  const router = useRouter();
  const { cartInfo } = useCart();

  const handleClick = () => {
    router.replace("/order");
  }

  if (!cartInfo) {
    return null;
  }

  // 장바구니가 비어있으면 EmptyCartView 표시
  if (cartInfo.totalQuantity === 0) {
    return <EmptyCartView />;
  }

  return (
    <div className={styles.container}>
      <CartMenuList cartInfo={cartInfo} />

      <div className={styles.paymentBarWrapper}>
        <PaymentBar
          totalPrice={cartInfo.totalPrice}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}