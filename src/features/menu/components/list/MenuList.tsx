import styles from "./MenuList.module.css";
import MenuCard from "@/features/menu/components/card/MenuCard";
import SeparationBar from "@/features/menu/components/bar/SeparationBar";
import React from "react";
import { MenuItem } from "@/features/menu/types/menuType";

interface MenuListProps {
  items: MenuItem[];
}

export default function MenuList({
  items,
}: MenuListProps) {
  return (
    <div className={styles.container}>
      {items.map((item: MenuItem, index: number) => (
        <React.Fragment key={item.id}>
          <div className={styles.menuCardWrapper}>
            <MenuCard
              imageSrc={item.imageSrc}
              title={item.title}
              price={item.price}
              rank={item.rank}
              soldOut={item.soldOut}
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