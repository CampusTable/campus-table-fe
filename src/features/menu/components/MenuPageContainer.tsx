"use client";

import { HakgwanMenuData } from "@/features/menu/services/hakgwanMenuService";
import CategoryBar from "@/features/menu/components/category/CategoryBar";
import MenuList from "@/features/menu/components/list/MenuList";
import { useMemo, useState } from "react";
import { MenuItem } from "@/features/menu/types/menuType";
import styles from "./MenuPageContainer.module.css";
import { useCart } from "@/features/cart/hooks/useCart";
import OrderSummaryBar from "@/features/menu/components/bar/OrderSummaryBar";
import CartToast from "@/features/menu/components/toast/CartToast";
import { useToast } from "@/shared/hooks/useToast";

interface MenuPageContainerProps {
  hakgwanMenuData: HakgwanMenuData;
}

export default function MenuPageContainer({
  hakgwanMenuData
}: MenuPageContainerProps) {

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(() => {
    if (hakgwanMenuData.categoryItems.length > 0) {
      return hakgwanMenuData.categoryItems[0].id;
    }
    return 0;
  });

  const { visible: toastVisible, message: toastMessage, showToast } = useToast(3000);

  const { cartInfo, addToCart } = useCart();

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
        showToast("장바구니에 쏙 담았어요!");
      },
      onError: (message) => {
        showToast(message);
      }
    });
  };

  const totalQuantity: number = cartInfo?.totalQuantity ?? 0;
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
          quantity={totalQuantity}
        />
      )}
    </div>
  );
}