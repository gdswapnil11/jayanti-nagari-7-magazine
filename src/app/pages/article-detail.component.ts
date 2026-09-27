import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { magazineArticles } from '../data';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header container">
      <span class="eyebrow">MAGAZINE FEATURE</span>
      <h1>{{ article?.title || 'Article' }}</h1>
      <p>{{ article?.excerpt || 'Read the full article from the community magazine.' }}</p>
    </section>

    @if (article) {
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
    }
  `
})
export class ArticleDetailComponent {
  readonly articles = magazineArticles;
  article: (typeof magazineArticles)[number] | undefined;

  constructor(private route: ActivatedRoute) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.article = this.articles.find(item => item.id === id);
  }
}
