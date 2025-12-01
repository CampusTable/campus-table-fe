"use client";

import AdBannerCarousel from "@/features/banner/components/AdBannerCarousel";
import OrderSummaryBar from "@/features/menu/bar/OrderSummaryBar";
import CategoryBar from "@/features/menu/category/CategoryBar";
import MenuList from "@/features/menu/list/components/MenuList";
import { MenuListItem } from "@/features/menu/list/types/menuListType";
import styles from "./page.module.css";

const CATEGORIES = [
  { id: "narutto", label: "나루또" },
  { id: "ajio", label: "아지오" },
  { id: "kimbap", label: "김밥천국" },
  { id: "drinks", label: "음료" },
  { id: "takeout", label: "테이크 아웃" },
];

const ITEMS: MenuListItem[] = [
  { id: "1", imageSrc: "/tmp/menu/menu-1.png", title: "치즈 고구마 돈까스", price: 6000},
  { id: "2", imageSrc: "/tmp/menu/menu-1.png", title: "치즈 고구마 돈까스", price: 6000, rank: 1},
  { id: "3", imageSrc: "/tmp/menu/menu-1.png", title: "치즈 고구마 돈까스", price: 6000, rank: 2},
  { id: "4", imageSrc: "/tmp/menu/menu-1.png", title: "치즈 고구마 돈까스", price: 6000, rank: 3},
  { id: "5", imageSrc: "/tmp/menu/menu-1.png", title: "치즈 고구마 돈까스", price: 6000, rank: 1, soldOut: true},
  { id: "6", imageSrc: "/tmp/menu/menu-1.png", title: "치즈 고구마 돈까스", price: 6000, rank: 2, soldOut: true},
  { id: "7", imageSrc: "/tmp/menu/menu-1.png", title: "치즈 고구마 돈까스", price: 6000, rank: 3, soldOut: true},
];

export default function HakgwanMainPage() {
  return (
    <div className={styles.container}>
      <div className={styles.adBannerWrapper}>
        <AdBannerCarousel />
      </div>

      <div className={styles.categoryBarWrapper}>
        <CategoryBar categories={CATEGORIES} />
      </div>

      <div className={styles.menuListWrapper}>
        <MenuList items={ITEMS} />
      </div>
      <OrderSummaryBar
        totalPrice={15900}
        itemCount={3}
      />
    </div>
  );
};