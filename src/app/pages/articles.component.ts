import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoryCategoryPlaceholderComponent } from '../shared/story-category-placeholder.component';
import { MagazineService } from '../core/services/magazine.service';

@Component({
  standalone: true,
  imports: [RouterLink, StoryCategoryPlaceholderComponent],
  template: `
    <section class="page-header container">
      <span class="eyebrow">COMMUNITY STORIES</span>
      <h1>Stories</h1>
      <p>Read reflections, ideas and experiences from Jayanti Nagari 7.</p>
    </section>

    <section class="container section">
      <div class="filter-row" aria-label="Story categories">
        @for (category of categories(); track category) {
          <button
            type="button"
            class="filter-pill"
            [class.selected]="selectedCategory() === category"
            [attr.aria-pressed]="selectedCategory() === category"
            (click)="selectedCategory.set(category)"
          >
            {{ category }}
          </button>
        }
      </div>

      @if (filteredArticles().length) {
        <div class="article-grid">
          @for (article of filteredArticles(); track article.id) {
            <article class="article-grid-card">
              <jn7-story-category-placeholder [category]="article.category" [image]="article.image" />
              <div class="article-card-top">
                <span class="tag">{{ article.category }}</span>
                <small>{{ article.date }}</small>
              </div>
              <h3>{{ article.title }}</h3>
              <p class="article-card-excerpt">{{ article.excerpt }}</p>
              <div class="article-card-footer">
                <span>By {{ article.author }}</span>
                <a [routerLink]="['/stories', article.id]" class="article-read-link">Read story →</a>
              </div>
            </article>
          }
        </div>
      } @else {
        <div class="empty-state">No stories are available in this category yet.</div>
      }
    </section>
  `,
  styles: [`
    .article-grid-card h3 {
      display: -webkit-box;
      min-width: 0;
      overflow: hidden;
      overflow-wrap: anywhere;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      line-clamp: 3;
    }

    .article-card-excerpt {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }
  `]
})
export class ArticlesComponent {
  private readonly magazine = inject(MagazineService);
  readonly articles = computed(() => this.magazine.edition()?.articles ?? []);
  readonly selectedCategory = signal('All');
  readonly categories = computed(() => ['All', ...new Set(this.articles().map(article => article.category))]);
  readonly filteredArticles = computed(() => {
    const category = this.selectedCategory();
    return category === 'All'
      ? this.articles()
      : this.articles().filter(article => article.category === category);
  });
}
