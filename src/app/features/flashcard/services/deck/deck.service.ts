import { inject, Injectable } from '@angular/core';
import { Auth } from '../../../../core/services/auth/auth';
import { Supabase } from '../../../../core/services/supabase/supabase';
import { Deck, DeckWithStats } from '../../models/deck';

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  private supabase = inject(Supabase);
  private auth = inject(Auth);

  async query(): Promise<DeckWithStats[]> {
    const { data, error } = await this.supabase.client.rpc('get_decks_with_stats');
    if (error) throw error;
    return data;
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase.client.from('decks').delete().eq('id', id);
    if (error) throw error;
  }

  async get(id: number): Promise<Deck> {
    const { data, error } = await this.supabase.client
      .from('decks')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async update(
    id: number,
    changes: Partial<
      Pick<Deck, 'name' | 'description' | 'new_cards_per_session' | 'review_cards_per_session'>
    >,
  ): Promise<Deck> {
    const { data, error } = await this.supabase.client
      .from('decks')
      .update(changes)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async create(
    deck: Pick<Deck, 'name' | 'description' | 'new_cards_per_session' | 'review_cards_per_session'>,
  ): Promise<Deck> {
    const { data, error } = await this.supabase.client
      .from('decks')
      .insert({ ...deck, user_id: this.auth.user()!.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
