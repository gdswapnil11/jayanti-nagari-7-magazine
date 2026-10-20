import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article, Story } from '../core/models/magazine.model';
import { MagazineService } from '../core/services/magazine.service';
import { StoryCategoryPlaceholderComponent } from '../shared/story-category-placeholder.component';

@Component({
  standalone: true,
  imports: [DatePipe, RouterLink, StoryCategoryPlaceholderComponent],
  template: `
    <section class="hero container">
      <div class="hero-copy">
        <span class="eyebrow">Q3 2026 • QUARTERLY ISSUE 01</span>
        <h1>Our society.<br><em>Our stories.</em></h1>
        <p class="lead">A digital magazine celebrating the people, moments, achievements and everyday life of Jayanti Nagari 7.</p>
        <a routerLink="/stories" class="button">Read stories →</a>
      </div>
      @if (featured(); as featured) {
        <div class="hero-image">
          <img [src]="featured.image" [alt]="featured.title">
          <div class="image-caption"><span>{{ featured.category }}</span></div>
        </div>
      }
    </section>

    <section class="ticker">
      <div class="container ticker-inner"><span>THIS QUARTER</span><strong>Community • Achievements • Events • Magazine</strong></div>
    </section>

    <section class="cream-section">
      <div class="container section">
        <div class="section-heading"><div><span class="eyebrow">WHAT'S HAPPENING</span><h2>Coming up in our society</h2></div><a routerLink="/events">All events →</a></div>
        <div class="events-row">
          @for (event of upcomingEvents(); track event.title) {
            <article class="event-card">
              <div class="event-date"><strong>{{ event.date | date:'dd' }}</strong><span>{{ event.date | date:'MMM yyyy' }}</span></div>
              <div><span class="tag">{{ event.location }}</span><h3>{{ event.title }}</h3><p>{{ event.description }}</p></div>
            </article>
          } @empty {
            <p class="home-empty-state">No upcoming events have been announced yet.</p>
          }
        </div>
      </div>
    </section>

    <section class="container section achievements-section">
      <div class="section-heading">
        <div><span class="eyebrow">CELEBRATING OUR PEOPLE</span><h2>Latest achievements</h2></div>
        <a routerLink="/stories">All stories →</a>
      </div>
      <div class="achievement-grid">
        @for (achievement of latestAchievements(); track achievement.title) {
          <article class="achievement-card">
            <jn7-story-category-placeholder
              class="achievement-banner"
              [category]="achievement.category"
            />
            <span class="eyebrow">{{ achievement.category }}</span>
            <h3>{{ achievement.title }}</h3>
            <p>{{ achievement.excerpt }}</p>
            <div class="achievement-footer">
              <small>{{ achievement.date }}</small>
              <a [routerLink]="achievement.link">Read story →</a>
            </div>
          </article>
        } @empty {
          <p class="home-empty-state">No achievements have been published yet.</p>
        }
      </div>
      @if (latestAchievements().length > 0 && latestAchievements().length < 3) {
        <p class="achievement-note">Showing {{ latestAchievements().length }} published achievement{{ latestAchievements().length === 1 ? '' : 's' }}. Add more achievement stories to display three here.</p>
      }
    </section>

    <section class="subscribe">
      <div class="container subscribe-inner"><div><span class="eyebrow">FIRST RELEASE • Q4 2026</span><h2>Launching January 1, 2027</h2><p>This is the beta version. The first quarterly edition covers Q4 2026, with a new edition released every quarter. Have a story to share? Send us achievements, photographs, resident stories, business news or a community idea.</p></div><button class="button dark">✦ Contribute to the magazine</button></div>
    </section>
  `,
  styles: [`
    .hero {
      align-items: center;
    }

    .hero-copy {
      align-items: flex-start;
    }

    .hero-copy .button {
      display: inline-flex;
      align-items: center;
      align-self: flex-start;
      width: auto;
    }

    .hero-image {
      min-height: 0;
    }

    .hero-image img {
      display: block;
      width: 100%;
      height: auto;
      object-fit: contain;
    }

    .achievement-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }

    .achievement-card {
      display: flex;
      min-width: 0;
      flex-direction: column;
      min-height: 220px;
      padding: 22px;
      border: 1px solid var(--line);
      background: var(--paper);
      overflow: hidden;
    }

    .achievement-banner {
      display: block;
      width: calc(100% + 44px);
      margin: -22px -22px 18px;
      overflow: hidden;
    }

    .achievement-card h3 {
      display: -webkit-box;
      min-width: 0;
      overflow: hidden;
      overflow-wrap: anywhere;
      margin: 10px 0;
      font-size: 23px;
      line-height: 1.25;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }

    .achievement-card p {
      display: -webkit-box;
      min-width: 0;
      overflow: hidden;
      overflow-wrap: anywhere;
      margin: 0 0 18px;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.65;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      line-clamp: 3;
    }

    .achievement-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-top: auto;
      padding-top: 14px;
      border-top: 1px solid var(--line);
      font-size: 12px;
    }

    .achievement-footer a {
      flex: 0 0 auto;
    }

    .achievement-footer small,
    .achievement-note,
    .home-empty-state {
      color: var(--muted);
    }

    .achievement-footer a {
      color: var(--accent);
      font-weight: 800;
    }

    .achievement-note,
    .home-empty-state {
      line-height: 1.6;
    }

    .achievement-note {
      margin: 16px 0 0;
      font-size: 12px;
    }

    @media (max-width: 900px) {
      .achievement-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 600px) {
      .achievement-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 800px) {
      .hero-copy {
        width: 100%;
      }

      .hero-copy .button {
        width: auto;
      }
    }
  `]
})
export class HomeComponent {
  private readonly magazine = inject(MagazineService);
  readonly stories = computed(() => this.magazine.edition()?.stories ?? []);
  readonly articles = computed(() => this.magazine.edition()?.articles ?? []);
  readonly events = computed(() => this.magazine.edition()?.events ?? []);
  readonly featured = computed(() => this.stories()[0]);
  readonly upcomingEvents = computed(() => this.events()
    .filter(event => !this.isPastEvent(event.date))
    .sort((left, right) => left.date.localeCompare(right.date))
    .slice(0, 3));
  readonly latestAchievements = computed(() => {
    const storyHighlights = this.stories()
      .filter(story => this.isAchievementOrRecognition(story.category, story.title, story.excerpt))
      .map(story => this.toAchievementHighlight(story));
    const articleHighlights = this.articles()
      .filter(article => this.isAchievementOrRecognition(article.category, article.title, article.excerpt))
      .map(article => this.toAchievementHighlight(article));

    return [...storyHighlights, ...articleHighlights]
      .sort((left, right) => this.parseDate(right.date) - this.parseDate(left.date))
      .slice(0, 3);
  });

  isPastEvent(date: string): boolean {
    const eventDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  }

  private toAchievementHighlight(item: Story | Article): {
    title: string;
    category: string;
    excerpt: string;
    date: string;
    image?: string;
    link: string[];
  } {
    return {
      title: item.title,
      category: item.category,
      excerpt: item.excerpt,
      date: item.date,
      image: item.image ? this.resolveImageUrl(item.image) : undefined,
      link: 'id' in item ? ['/stories', String(item.id)] : ['/stories', this.toSlug(item.title)]
    };
  }

  private resolveImageUrl(image: string): string {
    const driveId = image.match(/drive\.google\.com\/(?:open\?id=|file\/d\/)([^/?&]+)/)?.[1];
    return driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1200` : image;
  }

  private toSlug(title: string): string {
    return title
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private parseDate(date: string): number {
    const timestamp = Date.parse(date);
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  private isAchievementOrRecognition(category: string, title: string, excerpt: string): boolean {
    return category.toLowerCase().includes('achievement')
      || /\b(recognis\w*|award\w*|winner\w*|topper\w*)\b/i.test(`${title} ${excerpt}`);
  }
}