"use client";
import { CartApiResponse, CartInfo, CartRequest } from "@/features/cart/types/cartType";
import { toCartInfo } from "@/features/cart/utils/cartMapper";
import { getCart, upsertCart } from "@/features/cart/api/cartApi.client";

export async function getCartInfo(): Promise<CartInfo> {
  const cartApiResponse: CartApiResponse = await getCart();
  return toCartInfo(cartApiResponse);
}

export async function upsertCartInfo(request: CartRequest): Promise<CartInfo> {
  const cartApiResponse: CartApiResponse = await upsertCart(request);
  return toCartInfo(cartApiResponse);
}