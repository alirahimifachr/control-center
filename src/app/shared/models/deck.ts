export interface Deck {
  id: number;
  user_id: string;
  name: string;
  description: string;
  new_cards_per_session: number;
  review_cards_per_session: number;
  created_at: string;
}

export interface DeckWithStats extends Deck {
  total: number;
  box_counts: Record<number, number>;
}
