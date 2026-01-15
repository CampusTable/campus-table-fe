import { RefObject, TouchEvent, useRef, useState } from "react";
import { useTouchDirectionLock } from "@/shared/hooks/useTouchDirectionLock";

interface UseBannerCarouselProps {
  totalCount: number;
}

interface UseBannerCarouselResult {
  bannerNumber: number;
  dragX: number;
  isTransitioning: boolean;
  viewportRef: RefObject<HTMLDivElement | null>;
  handleTouchStart: (event: TouchEvent<HTMLDivElement>) => void;
  handleTouchMove: (event: TouchEvent<HTMLDivElement>) => void;
  handleTouchEnd: () => void;
  handleTransitionEnd: () => void;
}

const SWIPE_THRESHOLD_RATIO: number = 0.25;

export function useBannerCarousel({
  totalCount,
}: UseBannerCarouselProps): UseBannerCarouselResult {
  const [bannerNumber, setBannerNumber] = useState<number>(1); // 배너 번호 (1 ~ totalCount)
  const [dragX, setDragX] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const containerWidthRef = useRef<number>(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const maxBannerNumber: number = totalCount + 1;

  const {
    handleTouchStart: baseTouchStart,
    handleTouchMove: baseTouchMove,
    handleTouchEnd: baseTouchEnd,
  } = useTouchDirectionLock({
    onHorizontalMove: (deltaX: number): void => {
      if (isTransitioning) {
        return;
      }
      setDragX(deltaX);
    },
    onHorizontalEnd: (deltaX: number): void => {
      if (isTransitioning) {
        setDragX(0);
        return;
      }

      const containerWidth: number = containerWidthRef.current;
      if (containerWidth <= 0 || totalCount <= 0) {
        setDragX(0);
        return;
      }

      const threshold: number = containerWidth * SWIPE_THRESHOLD_RATIO;
      const distance: number = deltaX;

      const shouldMoveToNext: boolean = distance <= -threshold;
      const shouldMoveToPrev: boolean = distance >= threshold;

      setIsTransitioning(true);

      setBannerNumber((prev: number) => {
        if (shouldMoveToNext) {
          return prev + 1;
        }
        if (shouldMoveToPrev) {
          return prev - 1;
        }
        return prev;
      });

      setDragX(0);
    },
  });

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>): void => {
    if (isTransitioning || !viewportRef.current) {
      // 화면 동작 중 추가 동작 방지
      return;
    }
    containerWidthRef.current = viewportRef.current.offsetWidth;
    baseTouchStart(event);
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>): void => {
    if (isTransitioning) {
      return;
    }
    baseTouchMove(event);
  };

  const handleTouchEnd = (): void => {
    baseTouchEnd();
  };

  const handleTransitionEnd = (): void => {
    if (totalCount <= 0) {
      setIsTransitioning(false);
      return;
    }

    setIsTransitioning(false);

    setBannerNumber((prev: number) => {
      if (prev === 0) {
        return totalCount;
      }

      if (prev === maxBannerNumber) {
        return 1;
      }

      return prev;
    });
  };

  return {
    bannerNumber,
    dragX,
    isTransitioning,
    viewportRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTransitionEnd,
  };
}