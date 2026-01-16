import { MenuItem } from "@/features/menu/types/menuType";
import { CategoryItem } from "@/features/menu/types/categoryType";

export interface HakgwanMenuData {
  categoryItems: CategoryItem[];
  menuItems: MenuItem[];
}