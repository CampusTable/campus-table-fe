import "server-only";
import { CartApiResponse, CartInfo } from "@/features/cart/types/cartType";
import { getCart } from "@/features/cart/api/cartApi.server";
import { toCartInfo } from "@/features/cart/utils/cartMapper";

export async function getCartInfo():Promise<CartInfo> {
  const cartApiResponse: CartApiResponse = await getCart();
  return toCartInfo(cartApiResponse);
}