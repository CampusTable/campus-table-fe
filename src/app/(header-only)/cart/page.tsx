import EmptyCartView from "@/features/cart/components/view/EmptyCartView";
import CartView from "@/features/cart/components/view/CartView";
import { apiServer } from "@/shared/lib/api/apiServer";
import { CartApiResponse } from "@/features/cart/types/cartType";
import { toCartInfo } from "@/features/cart/utils/cartMapper";

export default async function CartPage() {

  const cartApiResponse: CartApiResponse = await apiServer.get("/api/cart");
  const cartInfo = toCartInfo(cartApiResponse);
  const empty = cartInfo.totalQuantity === 0;

  return empty ? <EmptyCartView /> : <CartView />
}