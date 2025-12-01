"use client";

import { TouchEvent, useRef } from "react";

type GestureDirection = "horizontal" | "vertical" | null;

interface UseTouchDirectionLockOptions {
  lockThreshold?: number; // 방향을 확정하기 전 최소 이동 거리 (px)
  onHorizontalMove?: (deltaX: number) => void;
  onHorizontalEnd?: (deltaX: number) => void;
}

interface UseTouchDirectionLockResult {
  handleTouchStart: (event: TouchEvent<HTMLDivElement>) => void;
  handleTouchMove: (event: TouchEvent<HTMLDivElement>) => void;
  handleTouchEnd: () => void;
}

const DEFAULT_LOCK_THRESHOLD: number = 8;

export function useTouchDirectionLock({
  lockThreshold = DEFAULT_LOCK_THRESHOLD,
  onHorizontalMove,
  onHorizontalEnd,
}: UseTouchDirectionLockOptions): UseTouchDirectionLockResult {
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const gestureDirectionRef = useRef<GestureDirection>(null);
  const lastDeltaXRef = useRef<number>(0);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>): void => {
    const firstTouch = event.touches[0];
    if (!firstTouch) {
      return;
    }

    touchStartXRef.current = firstTouch.clientX;
    touchStartYRef.current = firstTouch.clientY;
    gestureDirectionRef.current = null;
    lastDeltaXRef.current = 0;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>): void => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) {
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    const deltaX: number = touch.clientX - touchStartXRef.current;
    const deltaY: number = touch.clientY - touchStartYRef.current;

    if (gestureDirectionRef.current === null) {
      const absDeltaX: number = Math.abs(deltaX);
      const absDeltaY: number = Math.abs(deltaY);

      if (absDeltaX < lockThreshold && absDeltaY < lockThreshold) {
        return;
      }

      if (absDeltaX > absDeltaY) {
        gestureDirectionRef.current = "horizontal";
      } else {
        gestureDirectionRef.current = "vertical";
      }
    }

    if (gestureDirectionRef.current === "vertical") {
      // 세로 제스처 -> 브라우저에게 맡김
      return;
    }

    event.preventDefault();
    lastDeltaXRef.current = deltaX;

    if (onHorizontalMove) {
      onHorizontalMove(deltaX);
    }
  };

  const handleTouchEnd = (): void => {
    const direction: GestureDirection = gestureDirectionRef.current;

    if (direction === "horizontal" && onHorizontalEnd) {
      onHorizontalEnd(lastDeltaXRef.current);
    }

    // 상태 초기화
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    gestureDirectionRef.current = null;
    lastDeltaXRef.current = 0;
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}