import { Component, inject, linkedSignal, resource, signal } from '@angular/core';
import { form, FormField, max, min, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MAX_BOX, MIN_BOX, type Box } from '../../../shared/models/box';
import { Card } from '../../../shared/models/card';
import { MarkdownPipe } from '../../../shared/pipes/markdown-pipe';
import { CardService } from '../../../shared/services/card/card.service';
import { TagService } from '../../../shared/services/tag/tag.service';

@Component({
  selector: 'app-card-editor',
  imports: [FormField, RouterLink, MarkdownPipe],
  templateUrl: './card-editor.html',
  styleUrl: './card-editor.scss',
})
export class CardEditor {
  private cardService = inject(CardService);
  private tagService = inject(TagService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly deckId = +this.route.snapshot.params['deckId'];
  readonly cardId: number | undefined = this.route.snapshot.params['cardId']
    ? +this.route.snapshot.params['cardId']
    : undefined;

  readonly MIN_BOX = MIN_BOX;
  readonly MAX_BOX = MAX_BOX;

  readonly showPreview = signal(false);
  readonly next = signal(false);
  readonly error = signal('');

  readonly card = resource({
    params: () => (this.cardId ? { id: this.cardId } : undefined),
    loader: ({ params }) => this.cardService.get(params.id),
  });

  readonly tags = resource({
    loader: () => this.tagService.query(),
  });

  readonly selectedTagIds = linkedSignal<Set<number>>(() => {
    const card = this.card.value();
    return new Set(card?.tags.map((t) => t.id) ?? []);
  });

  readonly cardModel = linkedSignal<
    Omit<Card, 'id' | 'deck_id' | 'user_id' | 'created_at' | 'tags'>
  >(() => {
    const card = this.card.value();
    return {
      front: card?.front ?? '',
      back: card?.back ?? '',
      box: (card?.box ?? MIN_BOX) as Box,
    };
  });

  readonly cardForm = form(this.cardModel, (schemaPath) => {
    required(schemaPath.front);
    required(schemaPath.back);
    min(schemaPath.box, MIN_BOX);
    max(schemaPath.box, MAX_BOX);
  });

  toggleTag(tagId: number) {
    this.selectedTagIds.update((ids) => {
      const next = new Set(ids);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    void submit(this.cardForm, async () => {
      try {
        let savedCardId: number;
        if (this.cardId) {
          await this.cardService.update(this.cardId, this.cardModel());
          savedCardId = this.cardId;
        } else {
          const created = await this.cardService.create({
            deck_id: this.deckId,
            front: this.cardModel().front,
            back: this.cardModel().back,
          });
          savedCardId = created.id;
        }
        await this.tagService.setTags(savedCardId, [...this.selectedTagIds()]);
        if (this.next()) {
          this.next.set(false);
          this.cardModel.set({ front: '', back: '', box: MIN_BOX });
          this.selectedTagIds.set(new Set());
        } else {
          this.router.navigateByUrl('/flashcard/deck/' + this.deckId + '/browse');
        }
      } catch (e: unknown) {
        this.error.set((e as Error).message);
      }
    });
  }
}
