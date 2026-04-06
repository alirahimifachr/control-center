import { Component, computed, inject, resource, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BOXES, type Box } from '../../../shared/models/box';
import { BoxLabelPipe } from '../../../shared/pipes/box-label-pipe';
import { MarkdownPipe } from '../../../shared/pipes/markdown-pipe';
import { CardService } from '../../../shared/services/card/card.service';
import { DeckService } from '../../../shared/services/deck/deck.service';

@Component({
  selector: 'app-card-browser',
  imports: [RouterLink, MarkdownPipe, BoxLabelPipe],
  templateUrl: './card-browser.html',
  styleUrl: './card-browser.scss',
})
export class CardBrowser {
  private deckService = inject(DeckService);
  private cardService = inject(CardService);
  private route = inject(ActivatedRoute);

  readonly deckId = +this.route.snapshot.params['deckId'];
  readonly boxes: readonly (Box | undefined)[] = [undefined, ...BOXES];

  readonly selectedBox = signal<Box | undefined>(undefined);
  readonly filter = signal('');
  readonly error = signal('');

  readonly deck = resource({
    params: () => ({ id: this.deckId }),
    loader: ({ params }) => this.deckService.get(params.id),
  });

  readonly cards = resource({
    params: () => ({ deckId: this.deckId, box: this.selectedBox() }),
    loader: ({ params }) =>
      params.box != null
        ? this.cardService.getBoxCards(params.deckId, params.box)
        : this.cardService.query(params.deckId),
  });

  readonly filteredCards = computed(() => {
    const q = this.filter().toLowerCase().trim();
    return (this.cards.value() ?? []).filter((c) => !q || c.front.toLowerCase().includes(q));
  });

  async deleteCard(id: number) {
    if (!confirm('Delete this card?')) return;
    try {
      await this.cardService.delete(id);
      this.cards.reload();
    } catch (e: unknown) {
      this.error.set((e as Error).message);
    }
  }
}
