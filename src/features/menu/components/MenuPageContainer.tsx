"use client";

import { HakgwanMenuData } from "@/features/menu/services/hakgwanMenuService";
import CategoryBar from "@/features/menu/components/category/CategoryBar";
import MenuList from "@/features/menu/components/list/MenuList";
import { useMemo, useState } from "react";
import { MenuItem } from "@/features/menu/types/menuType";
import styles from "./MenuPageContainer.module.css";

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

  const filteredMenuItems: MenuItem[] = useMemo(() =>
      hakgwanMenuData.menuItems.filter((item: MenuItem) =>
        item.categoryId === selectedCategoryId
      )
    , [hakgwanMenuData.menuItems, selectedCategoryId]);

  const handleCategoryChange = (categoryId: number): void => {
    setSelectedCategoryId(categoryId);
  }

  return (
    <div className={styles.container}>
      <div className={styles.categoryBarWrapper}>
        <CategoryBar
          categories={hakgwanMenuData.categoryItems}
          onChange={handleCategoryChange}
        />
      </div>

      <div className={styles.menuListWrapper}>
        <MenuList items={filteredMenuItems} />
      </div>
    </div>
  );
}