import { MenuApiResponse, MenuItem } from "@/features/menu/types/menuType";

export function toMenuItem(response: MenuApiResponse): MenuItem {
  return {
    id: response.menuId,
    categoryId: response.categoryId,
    // TODO : 추후 imageSrc 연결
    // imageSrc: response.menuUrl,
    imageSrc: "/tmp/menu/menu-1.png",
    title: response.name,
    price: response.price,
    // TODO: 추후 rank 연결
    soldOut: !response.available,
  }
}