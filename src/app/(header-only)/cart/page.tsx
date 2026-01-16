import EmptyCartView from "@/features/cart/components/view/EmptyCartView";
import CartView from "@/features/cart/components/view/CartView";
import { getCartInfo } from "@/features/cart/services/cartService.server";

export default async function CartPage() {

  const cartInfo = await getCartInfo();
  const empty = cartInfo.totalQuantity === 0;

  return empty ? <EmptyCartView /> : <CartView />
}