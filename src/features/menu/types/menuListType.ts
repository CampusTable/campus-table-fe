export type Rank = 1 | 2 | 3;

export interface MenuListItem {
  id: string;
  imageSrc: string;
  title: string;
  price: number;
  rank?: Rank;
  soldOut?: boolean;
}