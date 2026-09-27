import { Component } from '@angular/core';
import { stories } from '../data';

@Component({
  standalone: true,
  template: `
    <section class="page-header container"><span class="eyebrow">THE MAGAZINE</span><h1>Stories</h1><p>What is happening, who is inspiring us and the stories that bring our community together.</p></section>
    <section class="container section">
      <div class="filter-row">@for (category of categories; track category) { <button [class.selected]="selected === category" (click)="selected = category">{{ category }}</button> }</div>
      <div class="story-list">
        @for (story of filtered; track story.title) {
          <article class="story-list-card"><img [src]="story.image" [alt]="story.title"><div><span class="tag">{{ story.category }}</span><h2>{{ story.title }}</h2><p>{{ story.excerpt }}</p><small>{{ story.date }} · {{ story.author }}</small><a href="#" (click)="$event.preventDefault()">Read story →</a></div></article>
        }
      </div>
    </section>
  `
})
export class StoriesComponent {
  readonly categories = ['All', 'Society Life', 'People', 'Achievements', 'Business Corner', 'Community', 'History'];
  selected = 'All';
  get filtered() { return this.selected === 'All' ? stories : stories.filter(s => s.category === this.selected); }
}