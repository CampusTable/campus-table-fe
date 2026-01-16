import "server-only";
import { CartApiResponse } from "@/features/cart/types/cartType";
import { apiServer } from "@/shared/lib/api/apiServer";

/**
 * 장바구니 조회 (SSR)
 * GET /api/cart
 */
export async function getCart(): Promise<CartApiResponse> {
  return await apiServer.get<CartApiResponse>("/api/cart");
}