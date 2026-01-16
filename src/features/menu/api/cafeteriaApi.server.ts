import "server-only";
import { apiServer } from "@/shared/lib/api/apiServer";
import { CafeteriaApiResponse } from "@/features/menu/types/cafeteriaType";

export async function getAllCafeteria(): Promise<CafeteriaApiResponse[]> {
  return await apiServer.get("/api/cafeterias");
}