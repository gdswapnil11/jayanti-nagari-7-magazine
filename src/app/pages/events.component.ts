import { Component } from '@angular/core';
import { events } from '../data';

@Component({
  standalone: true,
  template: `
    <section class="page-header container"><span class="eyebrow">CALENDAR</span><h1>Events</h1><p>Celebrations, activities and moments that bring Jayanti Nagari 7 together.</p></section>
    <section class="container section event-page-grid">
      @for (event of events; track event.title) {
        <article class="large-event"><img [src]="event.image" [alt]="event.title"><div class="large-event-content"><div class="event-date"><strong>{{ event.date }}</strong><span>{{ event.month }}</span></div><span class="tag">{{ event.location }}</span><h2>{{ event.title }}</h2><p>{{ event.description }}</p><button class="button">I'm interested</button></div></article>
      }
    </section>
  `
})
export class EventsComponent { readonly events = events; }