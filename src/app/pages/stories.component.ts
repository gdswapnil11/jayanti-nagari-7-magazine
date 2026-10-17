import { Component, computed, inject, signal } from '@angular/core';
import { MagazineService } from '../core/services/magazine.service';

@Component({
  standalone: true,
  template: `
    <section class="page-header container"><span class="eyebrow">THE MAGAZINE</span><h1>Stories</h1><p>What is happening, who is inspiring us and the stories that bring our community together.</p></section>
    <section class="container section">
      <div class="filter-row">@for (category of categories(); track category) { <button [class.selected]="selected() === category" (click)="selected.set(category)">{{ category }}</button> }</div>
      <div class="story-list">
        @for (story of filtered(); track story.title) {
          <article class="story-list-card"><img [src]="story.image" [alt]="story.title"><div><span class="tag">{{ story.category }}</span><h2>{{ story.title }}</h2><p>{{ story.excerpt }}</p><small>{{ story.date }} · {{ story.author }}</small><a href="#" (click)="$event.preventDefault()">Read story →</a></div></article>
        }
      </div>
    </section>
  `
})
export class StoriesComponent {
  private readonly magazine = inject(MagazineService);
  readonly stories = computed(() => this.magazine.edition()?.stories ?? []);
  readonly selected = signal('All');
  readonly categories = computed(() => ['All', ...new Set(this.stories().map(story => story.category))]);
  readonly filtered = computed(() => this.selected() === 'All'
    ? this.stories()
    : this.stories().filter(story => story.category === this.selected()));
}