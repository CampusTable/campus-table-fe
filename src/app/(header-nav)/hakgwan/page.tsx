import AdBannerCarousel from "@/features/banner/components/AdBannerCarousel";
import styles from "./page.module.css";
import { getHakgwanMenus } from "@/features/menu/services/hakgwanMenuService.server";
import MenuPageContainer from "@/features/menu/components/MenuPageContainer";
import { HakgwanMenuData } from "@/features/menu/types/hakgwanType";

export default async function HakgwanMainPage() {

  const hakgwanMenuData: HakgwanMenuData = await getHakgwanMenus();

  return (
    <div className={styles.container}>
      <div className={styles.adBannerWrapper}>
        <AdBannerCarousel />
      </div>

      <div className={styles.menuWrapper}>
        <MenuPageContainer hakgwanMenuData={hakgwanMenuData} />
      </div>
    </div>
  );
};