import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <section class="page-header container"><span class="eyebrow">LOOKING BACK</span><h1>Magazine Archive</h1><p>Past editions of Jayanti Nagari 7 — memories worth keeping.</p></section>
    <section class="container section archive-grid">
      @for (issue of issues; track issue.issue) {
        <article class="issue"><div class="issue-cover"><span>JAYANTI<br><em>NAGARI 7</em></span><strong>{{ issue.issue }}</strong><small>COMMUNITY MAGAZINE</small></div><div><span class="eyebrow">{{ issue.date }}</span><h2>{{ issue.title }}</h2><p>{{ issue.summary }}</p><button class="button">Read edition</button></div></article>
      }
    </section>
  `
})
export class ArchiveComponent {
  readonly issues = [
    { issue: '01', date: 'Q3 2026', title: 'Our Society. Our Stories.', summary: 'The launch edition featuring people, events, achievements and community stories.' },
    { issue: 'Coming', date: 'Q4 2026', title: 'The Festival Edition', summary: 'Celebrations, family stories, photographs and the people behind our festive traditions.' },
    { issue: 'Coming', date: 'Q1 2027', title: 'Home & Community', summary: 'Resident businesses, helpful services, kids corner and everyday stories.' }
  ];
}