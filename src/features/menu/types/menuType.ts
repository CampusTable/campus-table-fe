export type Rank = 1 | 2 | 3;

export interface MenuApiResponse {
  menuId: number;
  categoryId: number;
  name: string;
  price: number;
  menuUrl: string;
  available: boolean;
}

export interface MenuItem {
  id: number;
  categoryId: number;
  imageSrc: string;
  title: string;
  price: number;
  rank?: Rank;
  soldOut?: boolean;
}