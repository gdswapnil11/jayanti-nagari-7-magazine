import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MagazineService } from '../core/services/magazine.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-header container"><span class="eyebrow">LOOKING BACK</span><h1>Magazine Archive</h1><p>Past editions of Jayanti Nagari 7 — memories worth keeping.</p></section>
    <section class="container section archive-grid">
      @for (issue of issues(); track issue.id) {
        <article class="issue"><div class="issue-cover"><span>JAYANTI<br><em>NAGARI 7</em></span><strong>{{ issue.quarter }}</strong><small>COMMUNITY MAGAZINE</small></div><div><span class="eyebrow">{{ issue.quarter }} {{ issue.year }}</span><h2>{{ issue.title }}</h2><p>A quarterly collection of community stories, events and achievements.</p><a class="button" [routerLink]="['/editions', issue.id]">Read edition</a></div></article>
      }
      @empty { <p>No published editions are available yet.</p> }
    </section>
  `
})
export class ArchiveComponent {
  private readonly magazine = inject(MagazineService);
  readonly issues = computed(() => this.magazine.availableEditions().filter(issue => issue.published));
}