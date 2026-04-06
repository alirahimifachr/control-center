import { inject, Injectable } from '@angular/core';
import { Auth } from '../../../core/services/auth/auth';
import { Supabase } from '../../../core/services/supabase/supabase';
import { Card } from '../../models/card';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private supabase = inject(Supabase);
  private auth = inject(Auth);

  async query(deckId: number): Promise<Card[]> {
    const { data, error } = await this.supabase.client
      .from('cards')
      .select('*')
      .eq('deck_id', deckId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async get(id: number): Promise<Card> {
    const { data, error } = await this.supabase.client
      .from('cards')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(card: Pick<Card, 'deck_id' | 'front' | 'back'>): Promise<Card> {
    const { data, error } = await this.supabase.client
      .from('cards')
      .insert({ ...card, user_id: this.auth.user()!.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id: number, changes: Partial<Pick<Card, 'front' | 'back' | 'box'>>): Promise<Card> {
    const { data, error } = await this.supabase.client
      .from('cards')
      .update(changes)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase.client.from('cards').delete().eq('id', id);
    if (error) throw error;
  }

  async promote(id: number): Promise<void> {
    const { error } = await this.supabase.client.rpc('promote_card', { p_card_id: id });
    if (error) throw error;
  }

  async demote(id: number): Promise<void> {
    const { error } = await this.supabase.client.rpc('demote_card', { p_card_id: id });
    if (error) throw error;
  }

  async getStudyCards(deckId: number): Promise<Card[]> {
    const { data, error } = await this.supabase.client.rpc('get_study_cards', {
      p_deck_id: deckId,
    });
    if (error) throw error;
    return data;
  }

  async getBoxCards(deckId: number, box: number): Promise<Card[]> {
    const { data, error } = await this.supabase.client.rpc('get_box_cards', {
      p_deck_id: deckId,
      p_box: box,
    });
    if (error) throw error;
    return data;
  }
}
