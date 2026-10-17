import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MagazineService } from '../core/services/magazine.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header container">
      <span class="eyebrow">MAGAZINE FEATURE</span>
      <h1>{{ article()?.title || 'Article' }}</h1>
      <p>{{ article()?.excerpt || 'Read the full article from the community magazine.' }}</p>
    </section>

    @if (article(); as article) {
      <section class="container section article-detail">
        <div class="article-detail-meta">
          <span class="tag">{{ article.category }}</span>
          <span>{{ article.month }}</span>
          <span>By {{ article.author }}</span>
        </div>

        <article class="article-detail-body">
          <p class="article-detail-intro">{{ article.excerpt }}</p>
          <p>{{ article.content }}</p>
        </article>

        <div class="article-detail-actions">
          <a routerLink="/articles" class="button">← Back to articles</a>
        </div>
      </section>
    } @else if (!magazine.loading()) {
      <section class="container section">
        <p role="status">This article is not available in the current edition.</p>
        <a routerLink="/articles" class="button">← Back to articles</a>
      </section>
    }
  `
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
