import { MenuApiResponse, MenuItem } from "@/features/menu/types/menuType";

export function toMenuItem(response: MenuApiResponse): MenuItem {
  return {
    id: response.menuId,
    categoryId: response.categoryId,
    imageSrc: response.menuUrl,
    title: response.name,
    price: response.price,
    // TODO: 추후 rank 연결
    soldOut: !response.available,
  }
}