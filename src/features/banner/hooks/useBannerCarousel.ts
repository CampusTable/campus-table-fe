import { RefObject, TouchEvent, useRef, useState } from "react";

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

const SWIPE_THRESHOLD_RATIO: number = 0.5;

export function useBannerCarousel({
  totalCount,
}: UseBannerCarouselProps): UseBannerCarouselResult {
  const [bannerNumber, setBannerNumber] = useState<number>(1); // 배너 번호 (1 ~ totalCount)
  const [dragX, setDragX] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const touchStartXRef = useRef<number | null>(null); // touch 시작 x 위치
  const containerWidthRef = useRef<number>(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const maxBannerNumber: number = totalCount + 1;

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>): void => {
    if (isTransitioning || !viewportRef.current) {
      // 화면 동작 중 추가 동작 방지
      return;
    }

    const firstTouch = event.touches[0];
    if (!firstTouch) {
      return;
    }

    containerWidthRef.current = viewportRef.current.offsetWidth;
    touchStartXRef.current = firstTouch.clientX;

    setDragX(0);
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>): void => {
    if (touchStartXRef.current === null || isTransitioning) {
      // touch 시작 Ref 가 없거나 Transition이 진행중인경우
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
    if (touchStartXRef.current === null) {
      return;
    }

    touchStartXRef.current = null;

    const containerWidth: number = containerWidthRef.current;
    if (containerWidth <= 0 || totalCount <= 0) {
      setDragX(0);
      return;
    }

    const distance: number = dragX;
    const threshold: number = containerWidth * SWIPE_THRESHOLD_RATIO; // container 넓이의 50%

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

      // 임계값 미만이면 같은 위치로 전환 애니메이션
      return prev;
    });

    setDragX(0);
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