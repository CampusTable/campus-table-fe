"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseToastReturn {
  visible: boolean;
  message: string;
  showToast: (message: string) => void;
}

/**
 * 토스트 메시지 관리 훅
 * - 타이머 충돌 방지
 * - 기존 토스트가 있으면 새로운 토스트로 교체
 */
export function useToast(
  duration: number = 3000,
  animationDuration: number = 200,
): UseToastReturn {
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const visibleRef = useRef<boolean>(false);

  const showToast = useCallback((message: string) => {
    // 기존 타이머 정리
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    // 이미 토스트가 표시중이면 먼저 제거
    if (visibleRef.current) {
      // 기존 토스트 숨김
      setVisible(false);
      visibleRef.current = false;

      // 애니메이션 완료 대기
      hideTimerRef.current = setTimeout(() => {
        setMessage(message);
        setVisible(true);
        visibleRef.current = true;

        // duration 후 토스트 숨김
        timerRef.current = setTimeout(() => {
          setVisible(false);
          visibleRef.current = false;
          timerRef.current = null;
        }, duration);

        hideTimerRef.current = null;
      }, animationDuration);
    } else {
      // 기존 토스트가 없는 경우
      setMessage(message);
      setVisible(true);
      visibleRef.current = true;

      timerRef.current = setTimeout(() => {
        setVisible(false);
        visibleRef.current = false;
        timerRef.current = null;
      }, duration);
    }
  }, [duration, animationDuration]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  return { visible, message, showToast };
}