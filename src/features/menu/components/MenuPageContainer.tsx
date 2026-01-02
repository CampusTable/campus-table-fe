"use client";

import { HakgwanMenuData } from "@/features/menu/services/hakgwanMenuService";
import CategoryBar from "@/features/menu/components/category/CategoryBar";
import MenuList from "@/features/menu/components/list/MenuList";
import { useMemo, useState } from "react";
import { MenuItem } from "@/features/menu/types/menuType";
import styles from "./MenuPageContainer.module.css";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/hooks/useCart";
import OrderSummaryBar from "@/features/menu/components/bar/OrderSummaryBar";
import { ItemCount } from "@/features/menu/components/button/CartButton";
import CartToast from "@/features/menu/components/toast/CartToast";

interface MenuPageContainerProps {
  hakgwanMenuData: HakgwanMenuData;
}

export default function MenuPageContainer({
  hakgwanMenuData
}: MenuPageContainerProps) {
  const router = useRouter();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(() => {
    if (hakgwanMenuData.categoryItems.length > 0) {
      return hakgwanMenuData.categoryItems[0].id;
    }
    return 0;
  });

  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const { cartInfo, addToCart, isAddingToCart } = useCart();

  const filteredMenuItems: MenuItem[] = useMemo(() =>
      hakgwanMenuData.menuItems.filter((item: MenuItem) =>
        item.categoryId === selectedCategoryId
      )
    , [hakgwanMenuData.menuItems, selectedCategoryId]);

  const handleCategoryChange = (categoryId: number): void => {
    setSelectedCategoryId(categoryId);
  }

  /**
   * 장바구니 메뉴 추가
   */
  const handleAddToCart = (menuId: number): void => {
    addToCart(menuId, {
      onSuccess: () => {
        setToastMessage("장바구니에 쏙 담았어요!");
        setToastVisible(true);
        setTimeout(() => {
          setToastVisible(false);
        }, 3000);
      },
      onError: (message) => {
        setToastMessage(message);
        setToastVisible(true);
        setTimeout(() => {
          setToastVisible(false);
        }, 3000);
      }
    });
  };

  const totalQuantity: number = cartInfo?.totalQuantity ?? 0;
  const cartItemCount: ItemCount = Math.min(Math.max(totalQuantity, 1), 9) as ItemCount;
  const hasCartItems: boolean = totalQuantity > 0;

  const menuListWrapperClassName = hasCartItems
    ? `${styles.menuListWrapper} ${styles.menuListWrapperWithOrderSummaryBar}`
    : styles.menuListWrapper;

  return (
    <div className={styles.container}>
      <div className={styles.categoryBarWrapper}>
        <CategoryBar
          categories={hakgwanMenuData.categoryItems}
          onChange={handleCategoryChange}
        />
      </div>

      <div className={menuListWrapperClassName}>
        <MenuList
          items={filteredMenuItems}
          onAddToCart={handleAddToCart}
        />
      </div>

      <div className={styles.toastWrapper}>
        <CartToast
          visible={toastVisible}
          message={toastMessage}
        />
      </div>

      {hasCartItems && cartInfo && (
        <OrderSummaryBar
          totalPrice={cartInfo.totalPrice}
          itemCount={cartItemCount}
        />
      )}
    </div>
  );
}