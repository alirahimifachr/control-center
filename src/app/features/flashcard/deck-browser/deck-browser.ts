import { Component, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BOXES, BOX_SHORT_LABELS } from '../../../shared/models/box';
import { DeckService } from '../../../shared/services/deck/deck.service';

@Component({
  selector: 'app-deck-browser',
  imports: [RouterLink],
  templateUrl: './deck-browser.html',
  styleUrl: './deck-browser.scss',
})
export class DeckBrowser {
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
    if (!confirm('Delete this deck and all its cards?')) return;
    try {
      await this.deckService.delete(id);
      this.decks.reload();
    } catch (e: unknown) {
      this.error.set((e as Error).message);
    }
  }
}
