import { getAllCafeteria } from "@/features/menu/api/cafeteriaApi.server";
import { getAllMenuByCafeteriaId } from "@/features/menu/api/menuApi.server";
import { getCategoriesByCafeteriaId } from "@/features/menu/api/categoryApi.server";
import { CategoryApiResponse, CategoryItem } from "@/features/menu/types/categoryType";
import { MenuApiResponse, MenuItem } from "@/features/menu/types/menuType";
import { CafeteriaApiResponse } from "@/features/menu/types/cafeteriaType";
import { toCategoryItem } from "@/features/menu/utils/categoryMapper";
import { toMenuItem } from "@/features/menu/utils/menuMapper";

export interface HakgwanMenuData {
  categoryItems: CategoryItem[];
  menuItems: MenuItem[];
}

export async function getHakgwanMenus(): Promise<HakgwanMenuData> {
  const cafeterias: CafeteriaApiResponse[] = await getAllCafeteria();
  const hakgwanCafeteria: CafeteriaApiResponse | undefined = cafeterias.find(
    (cafeteria: CafeteriaApiResponse) => cafeteria.name === "학생회관"
  );
  if (!hakgwanCafeteria) {
    throw new Error("학생회관 식당 정보를 찾을 수 없습니다.");
  }
  const hakgwanCafeteriaId: number = hakgwanCafeteria.id;

  const categoryApiResponses: CategoryApiResponse[] = await getCategoriesByCafeteriaId(hakgwanCafeteriaId);
  const menuApiResponses: MenuApiResponse[] = await getAllMenuByCafeteriaId(hakgwanCafeteriaId);

  const categoryItems: CategoryItem[] = categoryApiResponses.map((response) => toCategoryItem(response));
  const menuItems: MenuItem[] = menuApiResponses.map((response) => toMenuItem(response));

  return { categoryItems, menuItems };
}