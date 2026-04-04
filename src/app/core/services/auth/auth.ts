import { computed, inject, Injectable, signal } from '@angular/core';
import type { User } from '@supabase/supabase-js';
import { Supabase } from '../supabase/supabase';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private supabase = inject(Supabase);
  user = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.user());

  readonly ready = this.supabase.client.auth.getSession().then(({ data }) => {
    this.user.set(data.session?.user ?? null);
  });

  private _sub = this.supabase.client.auth.onAuthStateChange((_event, session) => {
    this.user.set(session?.user ?? null);
  });

  async signIn(email: string, password: string) {
    const { error } = await this.supabase.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async signOut() {
    await this.supabase.client.auth.signOut();
  }
}
