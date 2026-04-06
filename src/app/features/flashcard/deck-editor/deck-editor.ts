import { Component, inject, linkedSignal, resource, signal } from '@angular/core';
import { form, FormField, min, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Deck } from '../../../shared/models/deck';
import { DeckService } from '../../../shared/services/deck/deck.service';

@Component({
  selector: 'app-deck-editor',
  imports: [FormField, RouterLink],
  templateUrl: './deck-editor.html',
  styleUrl: './deck-editor.scss',
})
export class DeckEditor {
  private deckService = inject(DeckService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly deckId: number | undefined = this.route.snapshot.params['deckId']
    ? +this.route.snapshot.params['deckId']
    : undefined;
  readonly error = signal('');

  readonly deck = resource({
    params: () => (this.deckId ? { id: this.deckId } : undefined),
    loader: ({ params }) => this.deckService.get(params.id),
  });

  readonly deckModel = linkedSignal<Omit<Deck, 'id' | 'user_id' | 'created_at'>>(() => {
    const deck = this.deck.value();
    return {
      name: deck?.name ?? '',
      description: deck?.description ?? '',
      new_cards_per_session: deck?.new_cards_per_session ?? 10,
      review_cards_per_session: deck?.review_cards_per_session ?? 20,
    };
  });

  readonly deckForm = form(this.deckModel, (schemaPath) => {
    required(schemaPath.name);
    min(schemaPath.new_cards_per_session, 1);
    min(schemaPath.review_cards_per_session, 1);
  });

  onSubmit(event: Event) {
    event.preventDefault();
    void submit(this.deckForm, async () => {
      try {
        if (this.deckId) {
          await this.deckService.update(this.deckId, this.deckModel());
        } else {
          await this.deckService.create(this.deckModel());
        }
        this.router.navigateByUrl('/flashcard');
      } catch (e: unknown) {
        this.error.set((e as Error).message);
      }
    });
  }
}
