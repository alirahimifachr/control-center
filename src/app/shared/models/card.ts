import { Tag } from './tag';

export interface Card {
  id: number;
  deck_id: number;
  user_id: string;
  box: number;
  front: string;
  back: string;
  created_at: string;
  tags: Tag[];
}
