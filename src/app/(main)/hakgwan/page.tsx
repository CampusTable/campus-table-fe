import AdBannerCarousel from "@/features/banner/components/AdBannerCarousel";
import MenuCard from "@/features/menu/card/MenuCard";
import SeparationBar from "@/features/menu/card/SeparationBar";

export default function HakgwanMainPage() {
  return (
    <div className="w-full">
      <div>학생회관 메인 페이지</div>
      <AdBannerCarousel />
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
    </div>
  );
};