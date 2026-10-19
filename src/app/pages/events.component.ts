import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MagazineService } from '../core/services/magazine.service';

@Component({
  standalone: true,
  imports: [DatePipe],
  template: `
    <section class="page-header container"><span class="eyebrow">CALENDAR</span><h1>Events</h1><p>Celebrations, activities and moments that bring Jayanti Nagari 7 together.</p></section>

    <section class="container section">
      <div class="filter-row" aria-label="Filter events by month">
        <button type="button" class="filter-pill" [class.selected]="selectedMonth() === 'All'" [attr.aria-pressed]="selectedMonth() === 'All'" (click)="selectedMonth.set('All')">All</button>
        @for (month of months(); track month) {
          <button type="button" class="filter-pill" [class.selected]="selectedMonth() === month" [attr.aria-pressed]="selectedMonth() === month" (click)="selectedMonth.set(month)">{{ month }}</button>
        }
      </div>

      <div class="event-page-grid">
        @for (event of filteredEvents(); track event.title) {
          <article class="large-event" [class.past-event]="isPastEvent(event.date)">
            <div class="large-event-content">
              <div class="event-date"><strong>{{ event.date | date:'dd' }}</strong><span>{{ event.date | date:'MMM yyyy' }}</span></div>
              <span class="tag">{{ event.location }}</span>
              <h2>{{ event.title }}</h2>
              <p>{{ event.description }}</p>
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .event-page-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 24px;
    }

    .large-event {
      display: block;
    }

    .large-event-content {
      padding: 28px;
    }

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

    @media (max-width: 1100px) {
      .event-page-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 700px) {
      .event-page-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EventsComponent {
  private readonly magazine = inject(MagazineService);
  readonly events = computed(() => this.magazine.edition()?.events ?? []);
  readonly selectedMonth = signal('All');

  readonly months = computed(() => {
    const uniqueMonths = new Set(
      this.events().map(event => this.formatMonth(event.date))
    );
    return Array.from(uniqueMonths);
  });

  readonly filteredEvents = computed(() => {
    const selectedMonth = this.selectedMonth();
    if (selectedMonth === 'All') {
      return this.events();
    }

    return this.events().filter(event => this.formatMonth(event.date) === selectedMonth);
  });

  private formatMonth(date: string): string {
    const eventDate = new Date(`${date}T00:00:00`);
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(eventDate);
  }

  isPastEvent(date: string): boolean {
    const eventDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  }
}