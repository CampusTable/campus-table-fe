"use client";

import AdBannerCard from "@/features/banner/components/AdBannerCard";
import styles from "./AdBannerCarousel.module.css";
import { Banner, BANNERS } from "@/features/banner/types/banner";
import { useBannerCarousel } from "@/features/banner/hooks/useBannerCarousel";
import AdBannerTag from "@/features/banner/components/AdBannerTag";

const TOTAL_BANNER_COUNT: number = BANNERS.length;

const FIRST_BANNER: Banner = BANNERS[0];
const LAST_BANNER: Banner = BANNERS[TOTAL_BANNER_COUNT - 1];

const RENDER_BANNERS: Banner[] = [
  { ...LAST_BANNER, id: -1 }, // 앞에 붙는 마지막 복제본
  ...BANNERS,
  { ...FIRST_BANNER, id: -2 }, // 뒤에 붙는 첫 번째 복제본
]

export default function AdBannerCarousel() {
  const {
    bannerNumber,
    dragX,
    isTransitioning,
    viewportRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTransitionEnd,
  } = useBannerCarousel({
    totalCount: TOTAL_BANNER_COUNT,
  });

  const translateX: string = `translate3d(calc(${-100 * bannerNumber}% + ${dragX}px), 0, 0)`;

  const trackClassName: string = isTransitioning
    ? `${styles.track} ${styles.trackAnimated}`
    : styles.track;

  const logicalCurrentIndex: number =
    (bannerNumber - 1 + TOTAL_BANNER_COUNT) % TOTAL_BANNER_COUNT;

  return (
    <div className={styles.container}>
      <div
        className={styles.viewport}
        ref={viewportRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={trackClassName}
          style={{ transform: translateX }}
          onTransitionEnd={handleTransitionEnd}
        >
          {RENDER_BANNERS.map((banner: Banner, index: number) => {
            return (
              <div
                key={`${banner.id} - ${index}`}
                className={styles.slide}
              >
                <AdBannerCard
                  imageUrl={banner.imageSrc}
                  alt={banner.alt}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.tagWrapper}>
        <AdBannerTag
          currentIndex={logicalCurrentIndex}
          totalCount={TOTAL_BANNER_COUNT}
        />
      </div>
    </div>
  );
}