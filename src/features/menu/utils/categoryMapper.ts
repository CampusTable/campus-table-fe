import { CategoryApiResponse, CategoryItem } from "@/features/menu/types/categoryType";

export function toCategoryItem(response: CategoryApiResponse): CategoryItem {
  return { id: response.categoryId, label: response.categoryName };
}