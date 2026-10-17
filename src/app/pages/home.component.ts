import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MagazineService } from '../core/services/magazine.service';

@Component({
  standalone: true,
  imports: [DatePipe, RouterLink],
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
          @for (event of events(); track event.title) {
            <article class="event-card" [class.past-event]="isPastEvent(event.date)">
              <div class="event-date"><strong>{{ event.date | date:'dd' }}</strong><span>{{ event.date | date:'MMM yyyy' }}</span></div>
              <div><span class="tag">{{ event.location }}</span><h3>{{ event.title }}</h3><p>{{ event.description }}</p></div>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="subscribe">
      <div class="container subscribe-inner"><div><span class="eyebrow">NEXT EDITION • Q4 2026</span><h2>Releasing January 1, 2027</h2><p>Have a story to share? Achievements, photographs, resident stories, business news or a community idea — every story belongs here.</p></div><button class="button dark">✦ Contribute to the magazine</button></div>
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

    .event-card.past-event {
      background: #ecebe8;
      color: #777;
      filter: grayscale(1);
    }

    .event-card.past-event p,
    .event-card.past-event .tag,
    .event-card.past-event .event-date span {
      color: #777;
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
  readonly events = computed(() => this.magazine.edition()?.events ?? []);
  readonly featured = computed(() => this.stories()[0]);

  isPastEvent(date: string): boolean {
    const eventDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  }
}