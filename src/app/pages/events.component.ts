import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MagazineService } from '../core/services/magazine.service';

@Component({
  standalone: true,
  imports: [DatePipe],
  template: `
    <section class="page-header container"><span class="eyebrow">CALENDAR</span><h1>Events</h1><p>Celebrations, activities and moments that bring Jayanti Nagari 7 together.</p></section>
    <section class="container section event-page-grid">
      @for (event of events(); track event.title) {
        <article class="large-event" [class.past-event]="isPastEvent(event.date)">
          <div class="large-event-content">
            <div class="event-date"><strong>{{ event.date | date:'dd' }}</strong><span>{{ event.date | date:'MMM yyyy' }}</span></div>
            <span class="tag">{{ event.location }}</span>
            <h2>{{ event.title }}</h2>
            <p>{{ event.description }}</p>
          </div>
        </article>
      }
    </section>
  `,
  styles: [`
    .large-event.past-event {
      background: #ecebe8;
      color: #777;
      filter: grayscale(1);
    }

    .large-event.past-event p,
    .large-event.past-event .tag,
    .large-event.past-event .event-date span {
      color: #777;
    }
  `]
})
export class EventsComponent {
  private readonly magazine = inject(MagazineService);
  readonly events = computed(() => this.magazine.edition()?.events ?? []);

  isPastEvent(date: string): boolean {
    const eventDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  }
}