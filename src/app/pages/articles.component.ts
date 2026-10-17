import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MagazineService } from '../core/services/magazine.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header container">
      <span class="eyebrow">QUARTERLY EDITION</span>
      <h1>Articles</h1>
      <p>Read the latest community stories from Jayanti Nagari 7.</p>
    </section>

    <section class="container section">
      <div class="article-grid">
        @for (article of articles(); track article.id) {
          <article class="article-grid-card">
            <div class="article-card-top">
              <span class="tag">{{ article.category }}</span>
              <small>{{ article.date }}</small>
            </div>
            <h3>{{ article.title }}</h3>
            <p>{{ article.excerpt }}</p>
            <div class="article-card-footer">
              <span>By {{ article.author }}</span>
              <a [routerLink]="['/articles', article.id]" class="article-read-link">Read full article →</a>
            </div>
          </article>
        }
      </div>
    </section>
  `
})
export class ArticlesComponent {
  private readonly magazine = inject(MagazineService);
  readonly articles = computed(() => this.magazine.edition()?.articles ?? []);
}
