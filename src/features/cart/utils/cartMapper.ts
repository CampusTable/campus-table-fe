import { CartApiResponse, CartInfo, CartItemApiResponse, CartItemInfo } from "@/features/cart/types/cartType";

export function toCartInfo(response: CartApiResponse): CartInfo {
  const cartItems: CartItemInfo[] = response.items.map((item: CartItemApiResponse) => toCartItemInfo(item));

  return {
    cartId: response.cartId,
    cartItems: cartItems,
    totalPrice: response.totalPrice,
    totalQuantity: response.totalQuantity,
  }
}

function toCartItemInfo(response: CartItemApiResponse): CartItemInfo {
  return {
    cartItemId: response.cartItemId,
    menuId: response.menuId,
    menuName: response.menuName,
    quantity: response.quantity,
    price: response.price,
    menuImageSrc: response.menuUrl,
  }
}