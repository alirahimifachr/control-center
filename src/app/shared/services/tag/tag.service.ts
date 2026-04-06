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
    const { data, error } = await this.supabase.client
      .from('tags')
      .select('*')
      .order('name');
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
