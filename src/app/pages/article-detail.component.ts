import { DOCUMENT } from '@angular/common';
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
          <jn7-story-category-placeholder [category]="article.category" [image]="article.image" class="feature" />
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
          @for (paragraph of paragraphs(article.excerpt); track $index; let first = $first) {
            <p [class.article-detail-intro]="first">{{ paragraph }}</p>
          }
          @for (paragraph of paragraphs(article.content); track $index) {
            <p>{{ paragraph }}</p>
          }
        </article>

        <div class="article-detail-actions">
          <a routerLink="/stories" class="button">← Back to stories</a>
          <a
            class="button whatsapp-share"
            [href]="whatsAppShareUrl()"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share this story on WhatsApp"
          >Share on WhatsApp</a>
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

    .article-detail-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .whatsapp-share {
      border-color: #128c7e;
      background: #128c7e;
      color: #fff;
    }

    .whatsapp-share:hover,
    .whatsapp-share:focus-visible {
      border-color: #075e54;
      background: #075e54;
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
  private readonly document = inject(DOCUMENT);
  readonly magazine = inject(MagazineService);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  readonly article = computed(() => {
    const id = this.params().get('id');
    return this.magazine.edition()?.articles.find(item => String(item.id) === id);
  });
  paragraphs(text: string): string[] {
    return text.split(/\r?\n\s*\r?\n/).map(paragraph => paragraph.trim()).filter(Boolean);
  }

  readonly whatsAppShareUrl = computed(() => {
    const article = this.article();
    if (!article) return '';

    const currentUrl = this.document.location?.href ?? '';
    const message = `${article.title} ${currentUrl}`.trim();
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  });
}
