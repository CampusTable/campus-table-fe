"use client";

import AdBannerCarousel from "@/features/banner/components/AdBannerCarousel";
import MenuCard from "@/features/menu/card/MenuCard";
import SeparationBar from "@/features/menu/bar/SeparationBar";
import OrderSummaryBar from "@/features/menu/bar/OrderSummaryBar";
import CategoryBar from "@/features/menu/category/CategoryBar";

const CATEGORIES = [
  { id: "narutto", label: "나루또" },
  { id: "ajio", label: "아지오" },
  { id: "kimbap", label: "김밥천국" },
  { id: "drinks", label: "음료" },
  { id: "takeout", label: "테이크 아웃" },
];

export default function HakgwanMainPage() {
  return (
    <div className="w-full">
      <div>학생회관 메인 페이지</div>
      <AdBannerCarousel />

      <CategoryBar categories={CATEGORIES} />

      <MenuCard
        imageSrc="/tmp/menu/menu-1.png"
        title="치즈 고구마 돈까스"
        price={6000}
      />
      <SeparationBar />
      <MenuCard
        imageSrc="/tmp/menu/menu-1.png"
        title="치즈 고구마 돈까스"
        price={6000}
        rank={1}
      />
      <SeparationBar />
      <MenuCard
        imageSrc="/tmp/menu/menu-1.png"
        title="치즈 고구마 돈까스"
        price={6000}
        rank={2}
      />
      <SeparationBar />
      <MenuCard
        imageSrc="/tmp/menu/menu-1.png"
        title="치즈 고구마 돈까스"
        price={6000}
        rank={3}
      />
      <SeparationBar />
      <MenuCard
        imageSrc="/tmp/menu/menu-1.png"
        title="치즈 고구마 돈까스"
        price={6000}
        soldOut={true}
      />
      <SeparationBar />
      <MenuCard
        imageSrc="/tmp/menu/menu-1.png"
        title="치즈 고구마 돈까스"
        price={6000}
        rank={1}
        soldOut={true}
      />
      <SeparationBar />
      <MenuCard
        imageSrc="/tmp/menu/menu-1.png"
        title="치즈 고구마 돈까스"
        price={6000}
        rank={2}
        soldOut={true}
      />
      <SeparationBar />
      <MenuCard
        imageSrc="/tmp/menu/menu-1.png"
        title="치즈 고구마 돈까스"
        price={6000}
        rank={3}
        soldOut={true}
      />
      <OrderSummaryBar
        totalPrice={15900}
        itemCount={3}
      />
    </div>
  );
};