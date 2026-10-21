import { DOCUMENT } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Story } from '../core/models/magazine.model';
import { StoryCategoryPlaceholderComponent } from '../shared/story-category-placeholder.component';
import { MagazineService } from '../core/services/magazine.service';

@Component({
  standalone: true,
  imports: [RouterLink, StoryCategoryPlaceholderComponent],
  template: `
    <section class="page-header container">
      <span class="eyebrow">COMMUNITY STORY</span>
      <h1>{{ article()?.title || story()?.title || 'Story' }}</h1>
      <p>{{ article()?.excerpt || story()?.excerpt || 'Read this story from the community magazine.' }}</p>
    </section>

    @if (article(); as article) {
      <section class="container section article-detail">
        <div class="article-detail-meta">
          <span class="tag">{{ article.category }}</span>
          <span>{{ article.month }}</span>
        </div>

        <article class="article-detail-body">
          <jn7-story-category-placeholder [category]="article.category" [image]="article.image" [imageAlt]="article.title" class="feature" />
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
          <div class="article-rich-content article-detail-intro" [innerHTML]="richContent(article.excerpt)"></div>
          <div class="article-rich-content" [innerHTML]="richContent(article.content)"></div>
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
    } @else if (story(); as story) {
      <section class="container section article-detail">
        <div class="article-detail-meta">
          <span class="tag">{{ story.category }}</span>
          <span>{{ story.date }}</span>
        </div>

        <article class="article-detail-body">
          <jn7-story-category-placeholder [category]="story.category" [image]="story.image" [imageAlt]="story.title" class="feature" />
          <div class="article-author">
            <span class="article-author-placeholder" aria-label="Generic author avatar">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="22" r="12"></circle>
                <path d="M10 58c1-13 10-21 22-21s21 8 22 21"></path>
              </svg>
            </span>
            <div class="article-author-info"><small>Written by</small><strong>{{ story.author }}</strong></div>
          </div>
          <div class="article-rich-content article-detail-intro" [innerHTML]="richContent(story.excerpt)"></div>
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
      display: block;
      width: min(100%, 560px);
      margin: 0 auto 28px;
      border: 1px solid var(--line);
      background: var(--cream);
    }

    .article-detail-body {
      width: min(100%, 980px);
      margin: 0 auto;
      padding: clamp(20px, 4vw, 48px);
    }

    .article-detail-meta {
      width: min(100%, 980px);
      margin: 0 auto;
    }

    .article-detail-body .article-author,
    .article-detail-body > .article-rich-content {
      width: min(100%, 740px);
      margin-right: auto;
      margin-left: auto;
    }

    .article-detail-body > .article-rich-content + .article-rich-content {
      margin-top: 20px;
    }

    .article-detail-actions {
      display: flex;
      flex-wrap: wrap;
      width: min(100%, 980px);
      margin: 0 auto;
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

  readonly story = computed(() => {
    const slug = this.params().get('id');
    if (!slug) return undefined;
    return this.magazine.edition()?.stories.find(item => this.toSlug(item.title) === slug);
  });

  richContent(text: string): string {
    if (/<\/?[a-z][\w:-]*(?:\s[^<>]*)?\s*\/?>/i.test(text)) return text;

    return text.split(/\r?\n\s*\r?\n/)
      .map(paragraph => paragraph.trim())
      .filter(Boolean)
      .map(paragraph => `<p>${paragraph.split(/\r?\n/).map(line => this.escapeHtml(line)).join('<br>')}</p>`)
      .join('');
  }

  private escapeHtml(text: string): string {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, character => entities[character]);
  }

  readonly whatsAppShareUrl = computed(() => {
    const item = this.article() ?? this.story();
    if (!item) return '';

    const currentUrl = this.document.location?.href ?? '';
    const message = `${item.title} ${currentUrl}`.trim();
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  });

  private toSlug(title: string): string {
    return title
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
