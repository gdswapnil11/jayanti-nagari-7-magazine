import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { stories, events, people } from '../data';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero container">
      <div class="hero-copy">
        <span class="eyebrow">Q3 2026 • QUARTERLY ISSUE 01</span>
        <h1>Our society.<br><em>Our stories.</em></h1>
        <p class="lead">A digital magazine celebrating the people, moments, achievements and everyday life of Jayanti Nagari 7.</p>
        <a routerLink="/stories" class="button">Explore the stories →</a>
      </div>
      <div class="hero-image">
        <img [src]="featured.image" [alt]="featured.title">
        <div class="image-caption"><span>{{ featured.category }}</span><strong>{{ featured.title }}</strong></div>
      </div>
    </section>

    <section class="ticker">
      <div class="container ticker-inner"><span>THIS QUARTER</span><strong>Community • People • Achievements • Events • Stories</strong></div>
    </section>

    <section class="container section">
      <div class="section-heading"><div><span class="eyebrow">EDITOR'S PICKS</span><h2>Stories worth sharing</h2></div><a routerLink="/stories">View all stories →</a></div>
      <div class="story-grid">
        @for (story of stories.slice(1,4); track story.title) {
          <article class="story-card">
            <img [src]="story.image" [alt]="story.title">
            <div class="story-body"><span class="tag">{{ story.category }}</span><h3>{{ story.title }}</h3><p>{{ story.excerpt }}</p><small>{{ story.date }} · {{ story.author }}</small></div>
          </article>
        }
      </div>
    </section>

    <section class="cream-section">
      <div class="container section">
        <div class="section-heading"><div><span class="eyebrow">WHAT'S HAPPENING</span><h2>Coming up in our society</h2></div><a routerLink="/events">All events →</a></div>
        <div class="events-row">
          @for (event of events; track event.title) {
            <article class="event-card">
              <div class="event-date"><strong>{{ event.date }}</strong><span>{{ event.month }}</span></div>
              <div><span class="tag">{{ event.location }}</span><h3>{{ event.title }}</h3><p>{{ event.description }}</p></div>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="container section">
      <div class="section-heading"><div><span class="eyebrow">PEOPLE OF JAYANTI NAGARI</span><h2>Meet the neighbours</h2></div><a routerLink="/people">Discover people →</a></div>
      <div class="people-grid">
        @for (person of people; track person.name) {
          <article class="person-card"><img [src]="person.image" [alt]="person.name"><div><span class="tag">{{ person.role }}</span><h3>{{ person.name }}</h3><p>{{ person.story }}</p></div></article>
        }
      </div>
    </section>

    <section class="subscribe">
      <div class="container subscribe-inner"><div><span class="eyebrow">NEXT EDITION</span><h2>Have a story to share?</h2><p>Achievements, photographs, resident stories, business news or a community idea — every story belongs here.</p></div><button class="button dark">✦ Contribute to the magazine</button></div>
    </section>
  `
})
export class HomeComponent {
  readonly stories = stories;
  readonly events = events;
  readonly people = people;
  readonly featured = stories[0];
}