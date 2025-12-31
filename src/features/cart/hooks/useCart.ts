"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartInfo, CartRequest } from "@/features/cart/types/cartType";
import { getCartInfo, upsertCartInfo } from "@/features/cart/services/cartService";
import { useCallback, useRef } from "react";

interface UseCartReturn {
  cartInfo: CartInfo | undefined,
  isLoading: boolean;
  error: Error | null;
  getMenuQuantity: (menuId: number) => void;
  addToCart: (menuId: number) => void;
  updateMenuQuantity: (menuId: number, quantity: number) => void;
  removeFromCart: (menuId: number) => void;
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
    const cartItem = cartInfo?.cartItems.find((item) => item.cartItemId === menuId);
    return cartItem?.quantity ?? 0;
  }, [cartInfo]);

  /**
   * 메뉴 1개 추가 (기존 수량 + 1)
   * - 버튼 연타 방지
   */
  const addToCart = useCallback((menuId: number) => {
    // 중복 요청 방지
    if (pendingRequests.current.has(menuId)) {
      return;
    }

    // 현재 수량 조회
    const currentQuantity: number = getMenuQuantity(menuId);
    const newQuantity = currentQuantity + 1;

    const requestPromise = new Promise<void>((resolve, reject) => {
      upsertCartMutation.mutate(
        { menuId, quantity: newQuantity },
        {
          onSuccess: () => {
            pendingRequests.current.delete(menuId);
            resolve();
          },
          onError: (error) => {
            pendingRequests.current.delete(menuId);
            reject(error);
          },
        }
      );
    });

    pendingRequests.current.set(menuId, requestPromise);
  }, [getMenuQuantity, upsertCartMutation]);

  /**
   * 메뉴 수량 직접 설정
   */
  const updateMenuQuantity = useCallback((menuId: number, quantity: number) => {
    if (quantity < 0 || quantity > 9) {
      console.error("수량은 0 이상 9 이하로 설정해야합니다.");
      return;
    }

    // 중복 요청 방지
    if (pendingRequests.current.has(menuId)) {
      return;
    }

    const requestPromise = new Promise<void>((resolve, reject) => {
      upsertCartMutation.mutate(
        { menuId, quantity },
        {
          onSuccess: () => {
            pendingRequests.current.delete(menuId);
            resolve();
          },
          onError: (error) => {
            pendingRequests.current.delete(menuId);
            reject(error);
          },
        }
      );
    });
    pendingRequests.current.set(menuId, requestPromise);
  }, [upsertCartMutation]);

  /**
   * 메뉴 삭제 (수량 0)
   */
  const removeFromCart = useCallback((menuId: number) => {
    updateMenuQuantity(menuId, 0);
  }, [updateMenuQuantity]);

  return {
    cartInfo,
    isLoading,
    error,
    getMenuQuantity,
    addToCart,
    updateMenuQuantity,
    removeFromCart,
    isAddingToCart: upsertCartMutation.isPending,
  };
}