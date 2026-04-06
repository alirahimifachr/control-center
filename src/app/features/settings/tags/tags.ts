import { Component, inject, resource, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { TagService } from '../../../shared/services/tag/tag.service';

@Component({
  selector: 'app-tags',
  imports: [FormField],
  templateUrl: './tags.html',
  styleUrl: './tags.scss',
})
export class Tags {
  private tagService = inject(TagService);

  readonly error = signal('');
  readonly editingTagId = signal<number | null>(null);
  readonly editName = signal('');

  readonly tags = resource({
    loader: () => this.tagService.query(),
  });

  readonly tagModel = signal({ name: '' });

  readonly tagForm = form(this.tagModel, (s) => {
    required(s.name);
  });

  onSubmit(event: Event) {
    event.preventDefault();
    void submit(this.tagForm, async () => {
      try {
        const name = this.tagModel().name.trim();
        if (!name) return;
        await this.tagService.create(name);
        this.tagModel.set({ name: '' });
        this.tags.reload();
      } catch (e: unknown) {
        this.error.set((e as Error).message);
      }
    });
  }

  edit(tag: { id: number; name: string }) {
    this.editingTagId.set(tag.id);
    this.editName.set(tag.name);
  }

  onEditInput(event: Event) {
    this.editName.set((event.target as HTMLInputElement).value);
  }

  cancel() {
    this.editingTagId.set(null);
    this.editName.set('');
  }

  async save(id: number) {
    const name = this.editName().trim();
    if (!name) return;
    try {
      await this.tagService.update(id, name);
      this.editingTagId.set(null);
      this.editName.set('');
      this.tags.reload();
    } catch (e: unknown) {
      this.error.set((e as Error).message);
    }
  }

  async delete(id: number) {
    if (!confirm('Delete this tag?')) return;
    try {
      await this.tagService.delete(id);
      this.tags.reload();
    } catch (e: unknown) {
      this.error.set((e as Error).message);
    }
  }
}
