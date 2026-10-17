import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { StoryCategoryPlaceholderComponent } from '../shared/story-category-placeholder.component';
import { MagazineService } from '../core/services/magazine.service';

@Component({
  standalone: true,
  imports: [RouterLink, StoryCategoryPlaceholderComponent],
  template: `
    <section class="page-header container">
      <span class="eyebrow">COMMUNITY STORY</span>
      <h1>{{ article()?.title || 'Story' }}</h1>
      <p>{{ article()?.excerpt || 'Read this story from the community magazine.' }}</p>
    </section>

    @if (article(); as article) {
      <section class="container section article-detail">
        <div class="article-detail-meta">
          <span class="tag">{{ article.category }}</span>
          <span>{{ article.month }}</span>
        </div>

        <article class="article-detail-body">
          <jn7-story-category-placeholder [category]="article.category" class="feature" />
          <div class="article-author">
            @if (article.authorImage) {
              <img class="article-author-photo" [src]="article.authorImage" [alt]="article.author">
            } @else {
              <span class="article-author-placeholder" aria-label="Generic author avatar">
                <svg viewBox="0 0 64 64" aria-hidden="true">
                  <circle cx="32" cy="22" r="12"></circle>
                  <path d="M10 58c1-13 10-21 22-21s21 8 22 21"></path>
                </svg>
              </span>
            }
            <div class="article-author-info"><small>Written by</small><strong>{{ article.author }}</strong></div>
          </div>
          <p class="article-detail-intro">{{ article.excerpt }}</p>
          <p>{{ article.content }}</p>
        </article>

        <div class="article-detail-actions">
          <a routerLink="/stories" class="button">← Back to stories</a>
        </div>
      </section>
    } @else if (!magazine.loading()) {
      <section class="container section">
        <p role="status">This story is not available in the current edition.</p>
        <a routerLink="/stories" class="button">← Back to stories</a>
      </section>
    }
  `,
  styles: [`
    .article-detail-body jn7-story-category-placeholder {
      margin-bottom: 26px;
    }

    .article-author {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--line);
    }

    .article-author-photo,
    .article-author-placeholder {
      display: grid;
      flex: 0 0 64px;
      width: 64px;
      height: 64px;
      place-items: center;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 50%;
      background: var(--cream);
      color: var(--accent);
    }

    .article-author-photo {
      object-fit: cover;
    }

    .article-author-placeholder {
      font: 20px 'Playfair Display', serif;
    }

    .article-author-placeholder svg {
      width: 40px;
      height: 40px;
      fill: var(--muted);
    }

    .article-author-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .article-author-info small {
      color: var(--muted);
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .article-author-info strong {
      font-size: 15px;
    }
  `]
})
export class ArticleDetailComponent {
  private readonly route = inject(ActivatedRoute);
  readonly magazine = inject(MagazineService);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  readonly article = computed(() => {
    const id = Number(this.params().get('id'));
    return this.magazine.edition()?.articles.find(item => item.id === id);
  });
}
