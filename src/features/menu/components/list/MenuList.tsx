import styles from "./MenuList.module.css";
import MenuCard from "@/features/menu/components/card/MenuCard";
import SeparationBar from "@/features/menu/components/bar/SeparationBar";
import React from "react";
import { MenuItem } from "@/features/menu/types/menuType";

interface MenuListProps {
  items: MenuItem[];
  onAddToCart?: (menuId: number) => void;
}

export default function MenuList({
  items,
  onAddToCart,
}: MenuListProps) {
  return (
    <div className={styles.container}>
      {items.map((item: MenuItem, index: number) => (
        <React.Fragment key={item.id}>
          <div className={styles.menuCardWrapper}>
            <MenuCard
              menuId={item.id}
              imageSrc={item.imageSrc}
              title={item.title}
              price={item.price}
              rank={item.rank}
              soldOut={item.soldOut}
              onClickAdd={onAddToCart}
            />
          </div>
          {index < items.length - 1 && (
            <div className={styles.separatorWrapper}>
              <SeparationBar />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};