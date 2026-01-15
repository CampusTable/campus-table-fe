import EmptyCartView from "@/features/cart/components/view/EmptyCartView";
import CartMenuCard from "@/features/cart/components/card/CartMenuCard";

export default function CartPage() {
  return (
    // <>
    //   <CartMenuCard menuId={1}
    //                 imageSrc="/tmp/menu/menu-1.png"
    //                 title="김치제육 덮밥"
    //                 price={6000} />
    //   <CartMenuCard menuId={1}
    //                 imageSrc="/tmp/menu/menu-1.png"
    //                 title="김치제육 덮밥"
    //                 rank={1}
    //                 price={6000} />
    // </>
    <EmptyCartView/>
  );
}