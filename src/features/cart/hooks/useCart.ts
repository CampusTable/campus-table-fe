"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartInfo, CartRequest } from "@/features/cart/types/cartType";
import { useCallback, useMemo, useRef } from "react";
import { getCartInfo, upsertCartInfo } from "@/features/cart/services/cartService.client";

interface UseCartReturn {
  cartInfo: CartInfo | undefined,
  isLoading: boolean;
  error: Error | null;
  getMenuQuantity: (menuId: number) => number;
  addToCart: (menuId: number, callbacks?: {
    onSuccess?: () => void;
    onError?: (message: string) => void;
  }) => void;
  removeFromCart: (menuId: number, callbacks?: {
    onSuccess?: () => void;
    onError?: (message: string) => void;
  }) => void;
  isAddingToCart: boolean;
}

export function useCart(): UseCartReturn {
  const queryClient = useQueryClient();

  // 진행 중인 요청 추적
  const pendingRequests = useRef<Map<number, Promise<void>>>(new Map());

  const {
    data: cartInfo,
    isLoading,
    error,
  } = useQuery<CartInfo>({
    queryKey: ["cart"],
    queryFn: getCartInfo,
    retry: 1,
  });

  // menuId 기준으로 순서 정렬
  const sortedCartInfo = useMemo(() => {
    if (!cartInfo) {
      return undefined;
    }

    return {
      ...cartInfo,
      cartItems: [...cartInfo.cartItems].sort((a, b) => a.menuId - b.menuId)
    };
  }, [cartInfo]);

  const upsertCartMutation = useMutation<CartInfo, Error, CartRequest>({
    mutationFn: (request: CartRequest) => upsertCartInfo(request),
    onSuccess: (data: CartInfo) => {
      queryClient.setQueryData(["cart"], data);
    },
    onError: (error) => {
      console.error("장바구니 작업 실패:", error);
    },
  });

  /**
   * 특정 메뉴의 현재 수량 조회
   */
  const getMenuQuantity = useCallback((menuId: number): number => {
    const cartItem = sortedCartInfo?.cartItems.find((item) => item.menuId === menuId);
    return cartItem?.quantity ?? 0;
  }, [sortedCartInfo]);

  /**
   * 메뉴 1개 추가 (기존 수량 + 1)
   * - 버튼 연타 방지
   * - 각 메뉴는 최대 9개까지
   */
  const addToCart = useCallback((
    menuId: number,
    callbacks?: {
      onSuccess?: () => void;
      onError?: (message: string) => void;
    }
  ) => {
    // 중복 요청 방지
    if (pendingRequests.current.has(menuId)) {
      return;
    }

    // 특정 메뉴 수량 조회
    const menuQuantity: number = getMenuQuantity(menuId);
    const newMenuQuantity: number = menuQuantity + 1;

    if (newMenuQuantity > 9) {
      callbacks?.onError?.("각 메뉴는 최대 9개까지만 담을 수 있어요!")
      return
    }

    const requestPromise = new Promise<void>((resolve, reject) => {
      upsertCartMutation.mutate(
        { menuId, quantity: newMenuQuantity },
        {
          onSuccess: () => {
            pendingRequests.current.delete(menuId);
            callbacks?.onSuccess?.();
            resolve();
          },
          onError: (error) => {
            pendingRequests.current.delete(menuId);
            callbacks?.onError?.("장바구니 담기에 실패했어요.");
            reject(error);
          },
        }
      );
    });

    pendingRequests.current.set(menuId, requestPromise);
  }, [getMenuQuantity, upsertCartMutation]);

  /**
   * 메뉴 1개 감소 (기존 수량 - 1)
   * - 수량이 1이면 장바구니에서 삭제 (수량 0으로 설정)
   * - 버튼 연타 방지
   */
  const removeFromCart = useCallback((
    menuId: number,
    callbacks?: {
      onSuccess?: () => void;
      onError?: (message: string) => void;
    }
  ) => {
    // 중복 요청 방지
    if (pendingRequests.current.has(menuId)) {
      return;
    }

    // 특정 메뉴 수량 조회
    const menuQuantity = getMenuQuantity(menuId);

    // 수량이 0이면 실행 중지
    if (menuQuantity === 0) {
      return;
    }

    const newMenuQuantity = menuQuantity - 1;

    const requestPromise = new Promise<void>((resolve, reject) => {
      upsertCartMutation.mutate(
        { menuId, quantity: newMenuQuantity },
        {
          onSuccess: () => {
            pendingRequests.current.delete(menuId);
            callbacks?.onSuccess?.();
            resolve();
          },
          onError: (error) => {
            pendingRequests.current.delete(menuId);
            callbacks?.onError?.("장바구니 수정에 실패했어요. 잠시 후 다시 시도해주세요.");
            reject(error);
          },
        }
      );
    });

    pendingRequests.current.set(menuId, requestPromise);
  }, [getMenuQuantity, upsertCartMutation]);

  return {
    cartInfo: sortedCartInfo,
    isLoading,
    error,
    getMenuQuantity,
    addToCart,
    removeFromCart,
    isAddingToCart: upsertCartMutation.isPending,
  };
}