import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { StoryCategoryPlaceholderComponent } from '../shared/story-category-placeholder.component';
import { MagazineService } from '../core/services/magazine.service';

@Component({
  standalone: true,
  imports: [RouterLink, StoryCategoryPlaceholderComponent],
  template: `
    @if (edition(); as edition) {
      <section class="page-header container">
        <span class="eyebrow">{{ edition.quarter }} {{ edition.year }} • QUARTERLY EDITION</span>
        <h1>{{ edition.title }}</h1>
        <p>A collection of community stories, events and achievements.</p>
      </section>

      <section class="container section">
        <div class="section-heading"><div><span class="eyebrow">IN THIS EDITION</span><h2>Stories worth sharing</h2></div></div>
        <div class="story-list">
          @for (story of edition.stories; track story.title) {
            <article class="story-list-card">
              <img [src]="story.image" [alt]="story.title">
              <div><span class="tag">{{ story.category }}</span><h2>{{ story.title }}</h2><p>{{ story.excerpt }}</p><small>{{ story.date }} · {{ story.author }}</small></div>
            </article>
          }
        </div>

        <div class="section-heading"><div><span class="eyebrow">FEATURES</span><h2>Stories</h2></div></div>
        <div class="article-grid">
          @for (article of edition.articles; track article.id) {
            <article class="article-grid-card">
              <jn7-story-category-placeholder [category]="article.category" [image]="article.image" />
              <div class="article-card-top"><span class="tag">{{ article.category }}</span><small>{{ article.date }}</small></div>
              <h3>{{ article.title }}</h3><p>{{ article.excerpt }}</p>
              <div class="article-card-footer"><span>By {{ article.author }}</span><a [routerLink]="['/stories', article.id]" class="article-read-link">Read story →</a></div>
            </article>
          }
        </div>
        <a routerLink="/archive" class="button">← Back to archive</a>
      </section>
    } @else if (!magazine.loading()) {
      <section class="page-header container">
        <span class="eyebrow">MAGAZINE ARCHIVE</span>
        <h1>Edition unavailable</h1>
        <p>This edition could not be found. Choose a published edition from the archive.</p>
        <a routerLink="/archive" class="button">Browse archive</a>
      </section>
    }
  `
})
export class EditionViewerComponent {
  readonly magazine = inject(MagazineService);
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  readonly edition = computed(() => {
    const edition = this.magazine.edition();
    return edition?.id === this.params().get('editionId') ? edition : null;
  });

  constructor() {
    effect(() => {
      const id = this.params().get('editionId');
      if (id) {
        this.magazine.loadEdition(id).subscribe();
      }
    });
  }
}
