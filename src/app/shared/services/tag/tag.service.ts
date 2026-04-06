import { inject, Injectable } from '@angular/core';
import { Auth } from '../../../core/services/auth/auth';
import { Supabase } from '../../../core/services/supabase/supabase';
import { Tag } from '../../models/tag';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private supabase = inject(Supabase);
  private auth = inject(Auth);

  async query(): Promise<Tag[]> {
    const { data, error } = await this.supabase.client.from('tags').select('*').order('name');
    if (error) throw error;
    return data;
  }

  async update(id: number, name: string): Promise<Tag> {
    const { data, error } = await this.supabase.client
      .from('tags')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase.client.from('tags').delete().eq('id', id);
    if (error) throw error;
  }

  async setTags(cardId: number, tagIds: number[]): Promise<void> {
    const { error: deleteError } = await this.supabase.client
      .from('card_tags')
      .delete()
      .eq('card_id', cardId);
    if (deleteError) throw deleteError;

    if (tagIds.length > 0) {
      const rows = tagIds.map((tag_id) => ({ card_id: cardId, tag_id }));
      const { error: insertError } = await this.supabase.client.from('card_tags').insert(rows);
      if (insertError) throw insertError;
    }
  }

  async removeTag(cardId: number, tagId: number): Promise<void> {
    const { error } = await this.supabase.client
      .from('card_tags')
      .delete()
      .eq('card_id', cardId)
      .eq('tag_id', tagId);
    if (error) throw error;
  }

  async create(name: string): Promise<Tag> {
    const { data, error } = await this.supabase.client
      .from('tags')
      .insert({ name, user_id: this.auth.user()!.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
