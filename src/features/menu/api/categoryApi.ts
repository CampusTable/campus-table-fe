import { apiServer } from "@/shared/lib/api/apiServer";
import { CategoryApiResponse } from "@/features/menu/types/categoryType";

export async function getCategoriesByCafeteriaId(id: number): Promise<CategoryApiResponse[]> {
  return await apiServer.get(`/api/cafeterias/${id}/categories`);
}