"use client";
import { CartApiResponse, CartRequest } from "@/features/cart/types/cartType";
import { apiClient } from "@/shared/lib/api/apiClient";

/**
 * 장바구니 조회
 * GET /api/cart
 */
export async function getCart(): Promise<CartApiResponse> {
  return await apiClient.get<CartApiResponse>("/api/cart");
}

/**
 * 장바구니 메뉴 추가 or 수량 변경
 * POST /api/cart/items
 */
export async function upsertCart(request: CartRequest): Promise<CartApiResponse> {
  return await apiClient.post<CartApiResponse>("/api/cart/items", request);
}