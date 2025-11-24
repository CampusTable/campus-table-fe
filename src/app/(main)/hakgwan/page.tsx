import AdBannerCarousel from "@/features/banner/components/AdBannerCarousel";
import PopularTag from "@/features/menu/tags/components/PopularTag";
import SoldOutTag from "@/features/menu/tags/components/SoldOutTag";

export default function HakgwanMainPage() {
  return (
    <>
      <div>학생회관 메인 페이지</div>
      <AdBannerCarousel />
      <div className="h-10"/>
      <PopularTag rank={1}/>
      <div className="h-10"/>
      <PopularTag rank={2}/>
      <div className="h-10"/>
      <PopularTag rank={3}/>
      <div className="h-10"/>
      <SoldOutTag/>
    </>
  );
};