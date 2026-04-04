import { Component, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BOXES, BOX_SHORT_LABELS } from '../models/box';
import type { DeckWithStats } from '../models/deck';
import { DeckService } from '../services/deck/deck.service';

@Component({
  selector: 'app-flashcard-main',
  imports: [RouterLink],
  templateUrl: './flashcard-main.html',
  styleUrl: './flashcard-main.scss',
})
export class FlashcardMain {
  private deckService = inject(DeckService);

  readonly boxes = BOXES;
  readonly boxLabels = BOX_SHORT_LABELS;
  readonly error = signal('');

  readonly decks = resource({
    loader: () => {
      return this.deckService.query();
    },
  });

  async delete(id: number) {
    if (!confirm('Delete this deck and all its cards?')) return; // Todo: Use Modal
    try {
      await this.deckService.delete(id);
      this.decks.reload();
    } catch (e: unknown) {
      this.error.set((e as Error).message);
    }
  }
}
