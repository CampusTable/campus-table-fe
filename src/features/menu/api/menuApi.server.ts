import "server-only";
import { apiServer } from "@/shared/lib/api/apiServer";
import { MenuApiResponse } from "@/features/menu/types/menuType";

export async function getAllMenuByCafeteriaId(cafeteriaId: number): Promise<MenuApiResponse[]> {
  return await apiServer.get(`/api/menu/cafeteria/${cafeteriaId}`, {
    requireAuth: true,
  });
}