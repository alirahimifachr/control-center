import {
  Component,
  computed,
  HostListener,
  inject,
  resource,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Whiteboard } from '../../../shared/directives/whiteboard';
import { BoxLabelPipe } from '../../../shared/pipes/box-label-pipe';
import { MarkdownPipe } from '../../../shared/pipes/markdown-pipe';
import { CardService } from '../../../shared/services/card/card.service';

@Component({
  selector: 'app-study-session',
  imports: [RouterLink, MarkdownPipe, BoxLabelPipe, Whiteboard],
  templateUrl: './study-session.html',
  styleUrl: './study-session.scss',
})
export class StudySession {
  private cardService = inject(CardService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly deckId = +this.route.snapshot.params['deckId'];
  private readonly box: number | undefined = this.route.snapshot.params['box']
    ? +this.route.snapshot.params['box']
    : undefined;

  readonly error = signal('');
  readonly currentIndex = signal(0);
  readonly revealed = signal(false);
  readonly promoted = signal(0);
  readonly demoted = signal(0);

  readonly cards = resource({
    loader: () =>
      this.box != null
        ? this.cardService.getBoxCards(this.deckId, this.box)
        : this.cardService.getStudyCards(this.deckId),
  });

  readonly currentCard = computed(() => this.cards.value()?.[this.currentIndex()]);
  readonly progress = computed(() => {
    const total = this.cards.value()?.length ?? 0;
    if (total) {
      return this.currentIndex()
        ? Math.round(((this.currentIndex() + 1) / total) * 100)
        : Math.round((1 / total) * 100);
    } else {
      return 0;
    }
  });
  readonly done = computed(() => {
    const cards = this.cards.value();
    return cards != null && (cards.length === 0 || this.currentIndex() >= cards.length);
  });

  readonly drawMode = signal(false);
  readonly whiteboard = viewChild(Whiteboard);

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (this.cards.isLoading() || this.done()) return;
    if (event.code === 'Space') {
      event.preventDefault();
      if (!this.revealed()) this.revealed.set(true);
    } else if (event.code === 'ArrowRight' && this.revealed()) {
      this.promote();
    } else if (event.code === 'ArrowLeft' && this.revealed()) {
      this.demote();
    } else if (event.code === 'ArrowDown') {
      this.skip();
    } else if (event.code === 'ArrowUp') {
      this.editCard();
    }
  }

  skip() {
    this.nextCard();
  }

  editCard() {
    const card = this.currentCard();
    if (!card) return;
    this.router.navigate(['/flashcard/deck', this.deckId, 'card', card.id]);
  }

  async promote() {
    const card = this.currentCard();
    if (!card) return;
    try {
      await this.cardService.promote(card.id);
      this.promoted.update((n) => n + 1);
      this.nextCard();
    } catch (e: unknown) {
      this.error.set((e as Error).message);
    }
  }

  async demote() {
    const card = this.currentCard();
    if (!card) return;
    try {
      await this.cardService.demote(card.id);
      this.demoted.update((n) => n + 1);
      this.nextCard();
    } catch (e: unknown) {
      this.error.set((e as Error).message);
    }
  }

  private nextCard() {
    this.currentIndex.update((i) => i + 1);
    this.revealed.set(false);
  }
}
