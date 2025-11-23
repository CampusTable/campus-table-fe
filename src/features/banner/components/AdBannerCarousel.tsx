"use client";

import { TouchEvent, useRef, useState } from "react";
import AdBannerCard from "@/features/banner/components/AdBannerCard";
import styles from "./ad-banner-carousel.module.css";
import { Banner, BANNERS } from "@/features/banner/types/banner";

export default function AdBannerCarousel() {
  const totalCount: number = BANNERS.length;

  const [position, setPosition] = useState<number>(1);
  const [dragX, setDragX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const touchStartXRef = useRef<number | null>(null);
  const containerWidthRef = useRef<number>(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>): void => {
    if (!viewportRef.current) {
      return;
    }
    const firstTouch = event.touches[0];
    if (!firstTouch) {
      return;
    }

    containerWidthRef.current = viewportRef.current.offsetWidth;
    touchStartXRef.current = firstTouch.clientX;

    setDragX(0);
    setIsDragging(true);
    setIsTransitioning(false);
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>): void => {
    if (!isDragging || touchStartXRef.current === null) {
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    const deltaX: number = touch.clientX - touchStartXRef.current;
    setDragX(deltaX);
  };

  const handleTouchEnd = (): void => {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);

    const containerWidth: number = containerWidthRef.current;
    if (containerWidth <= 0) {
      setDragX(0);
      return;
    }

    const distance: number = dragX;
    const threshold: number = containerWidth * 0.5;

    let nextPosition: number = position;

    if (Math.abs(distance) >= threshold) {
      // 왼쪽 스와이프(손가락이 왼쪽으로 이동) → 다음 배너
      if (distance < 0) {
        nextPosition = position + 1;
      }
      // 오른쪽 스와이프 → 이전 배너
      else if (distance > 0) {
        nextPosition = position - 1;
      }
    }
    setIsTransitioning(true);
    setPosition(nextPosition);
    setDragX(0);
  };

  const handleTransitionEnd = (): void => {
    let normalizedPosition: number = position;
    const maxPosition: number = totalCount + 1;

    if (position === 0) {
      normalizedPosition = totalCount;
    } else if (position === maxPosition) {
      normalizedPosition = 1;
    }

    setIsTransitioning(false);

    if (normalizedPosition !== position) {
      setPosition(normalizedPosition);
    }
  };

  const translateX: string = `translate3d(calc(${-100 * position}% + ${dragX}px), 0, 0)`;

  const trackClassName: string = !isDragging && isTransitioning
    ? `${styles.track} ${styles.trackAnimated}`
    : styles.track;

  const firstBanner: Banner = BANNERS[0];
  const lastBanner: Banner = BANNERS[totalCount - 1];

  const renderBanners: Banner[] = [
    { ...lastBanner, id: -1 }, // 앞에 붙는 마지막 복제본
    ...BANNERS,
    { ...firstBanner, id: -2 }, // 뒤에 붙는 첫 번째 복제본
  ];

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
          {renderBanners.map((banner: Banner, index: number) => {
            const logicalIndex: number =
              (index - 1 + totalCount) % totalCount;

            return (
              <div
                key={`${banner.id} - ${index}`}
                className={styles.slide}
              >
                <AdBannerCard
                  currentIndex={logicalIndex}
                  totalCount={totalCount}
                  imageUrl={banner.imageSrc}
                  alt={banner.alt}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}