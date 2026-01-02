export interface CartRequest {
  menuId: number;
  quantity: number;
}

export interface CartItemApiResponse {
  menuName: string;
  quantity: number;
  price: number;
  menuUrl: string;
  cartItemId: number
  menuId: number
}

export interface CartApiResponse {
  items: CartItemApiResponse[];
  totalPrice: number;
  totalQuantity: number;
  cartId: number;
}

export interface CartItemInfo {
  cartItemId: number;
  menuId: number;
  menuName: string;
  quantity: number;
  price: number;
  menuImageSrc: string;
}

export interface CartInfo{
  cartId: number
  cartItems: CartItemInfo[];
  totalPrice: number;
  totalQuantity: number;
}