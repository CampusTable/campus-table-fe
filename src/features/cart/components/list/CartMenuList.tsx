import { CartInfo } from "@/features/cart/types/cartType";
import CartMenuCard from "@/features/cart/components/card/CartMenuCard";
import SeparationBar from "@/shared/components/bar/SeparationBar";
import React from "react";
import styles from "./CartMenuList.module.css";

interface CartMenuListProps {
  cartInfo: CartInfo
}

export default function CartMenuList({
  cartInfo,
}: CartMenuListProps) {
  return (
    <div className={styles.container}>
      {cartInfo.cartItems.map((item, index) => (
        <React.Fragment key={item.menuId}>
          <div className={styles.cardWrapper}>
            <CartMenuCard
              menuId={item.menuId}
              imageSrc={item.menuImageSrc}
              title={item.menuName}
              price={item.price}
              quantity={item.quantity}
            />
          </div>
          {index < cartInfo.cartItems.length - 1 && (
            <div className={styles.separatorWrapper}>
              <SeparationBar />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}