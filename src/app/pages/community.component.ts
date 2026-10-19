import { Component, computed, inject, signal } from '@angular/core';
import { CommunityCategory } from '../core/models/magazine.model';
import { MagazineService } from '../core/services/magazine.service';

@Component({
  standalone: true,
  template: `
    <section class="page-header container">
      <span class="eyebrow">CONNECT LOCALLY</span>
      <h1>Professional Directory</h1>
      <p>Find trusted doctors, IT professionals, wellness experts, chefs, and coaches for music, football, badminton, drawing and more from within Jayanti Nagari 7.</p>
    </section>

    <section class="container section">
      <div class="community-toolbar">
        <div class="filter-pills">
          <button type="button" class="filter-pill" [class.active]="selectedFilter() === 'All'" (click)="selectFilter('All')">All</button>
          @for (category of categories(); track category) {
            <button type="button" class="filter-pill" [class.active]="selectedFilter() === category" (click)="selectFilter(category)">{{ category }}</button>
          }
        </div>
        <div class="results-count">{{ resultRange() }} of {{ filteredCommunity().length }} profiles</div>
      </div>

      @if (filteredCommunity().length === 0) {
        <div class="empty-state">No professionals match this category yet. Please try another filter.</div>
      }

      <div class="community-grid">
        @for (item of paginatedCommunity(); track item.vendor) {
          <article class="community-card">
            <div class="community-top">
              <div class="community-icon">{{ item.icon }}</div>
              <span class="tag">{{ item.category }}</span>
            </div>
            <div class="vendor-meta">
              <h2>{{ item.vendor }}</h2>
              <span>{{ item.service }}</span>
            </div>
            <p>{{ item.description }}</p>
            <ul class="service-points">
              <li>{{ item.detail }}</li>
              <li>{{ item.contact }}</li>
              <li>{{ item.phone }}</li>
            </ul>
            <a
              class="text-button"
              [href]="getMapsUrl(item.vendor)"
              target="_blank"
              rel="noopener noreferrer">View on Google Maps →</a>
          </article>
        }
      </div>

      @if (totalPages() > 1) {
        <nav class="directory-pagination" aria-label="Professional directory pages">
          <button type="button" [disabled]="currentPage() === 1" (click)="goToPage(currentPage() - 1)">Previous</button>
          @for (page of pages(); track page) {
            <button
              type="button"
              [class.active]="currentPage() === page"
              [attr.aria-current]="currentPage() === page ? 'page' : null"
              [attr.aria-label]="'Page ' + page"
              (click)="goToPage(page)">{{ page }}</button>
          }
          <button type="button" [disabled]="currentPage() === totalPages()" (click)="goToPage(currentPage() + 1)">Next</button>
        </nav>
      }
    </section>
  `,
  styles: [`
    .community-grid {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
      gap: 14px;
    }

    .community-card {
      min-height: 0;
      padding: 16px;
    }

    .community-top {
      margin-bottom: 10px;
    }

    .community-icon {
      width: 40px;
      height: 40px;
      border-radius: 11px;
      font-size: 21px;
    }

    .vendor-meta {
      margin-bottom: 8px;
    }

    .vendor-meta h2 {
      font-size: 21px;
      margin-bottom: 4px;
    }

    .vendor-meta span {
      font-size: 12px;
    }

    .community-card p {
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 10px;
    }

    .service-points {
      gap: 4px;
      font-size: 12px;
      line-height: 1.45;
      margin-bottom: 12px;
    }

    .directory-pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 24px;
    }

    .directory-pagination button {
      min-width: 38px;
      min-height: 38px;
      padding: 8px 12px;
      border: 1px solid var(--line);
      background: var(--paper);
      color: var(--ink);
      font-weight: 700;
    }

    .directory-pagination button.active {
      border-color: var(--accent);
      background: var(--accent);
      color: white;
    }

    .directory-pagination button:disabled {
      cursor: not-allowed;
      opacity: .45;
    }

  `]
})
export class CommunityComponent {
  private readonly magazine = inject(MagazineService);
  readonly community = computed(() => this.magazine.edition()?.community ?? []);
  readonly categories = computed(() => [...new Set<CommunityCategory>([
    'Doctors',
    'IT Professionals',
    'Health & Wellness',
    'Cooking & Nutrition',
    'Yoga & Fitness',
    'Coaching & Tuition',
    'Home Services',
    'Other Professionals',
    ...this.community().map(item => item.category)
  ])]);
  readonly selectedFilter = signal<'All' | CommunityCategory>('All');
  readonly currentPage = signal(1);
  readonly filteredCommunity = computed(() => this.selectedFilter() === 'All'
    ? this.community()
    : this.community().filter(item => item.category === this.selectedFilter()));
  readonly pageSize = 6;
  readonly totalPages = computed(() => Math.ceil(this.filteredCommunity().length / this.pageSize));
  readonly pages = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index + 1));
  readonly paginatedCommunity = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredCommunity().slice(start, start + this.pageSize);
  });
  readonly resultRange = computed(() => {
    const total = this.filteredCommunity().length;
    if (total === 0) return '0';
    const first = (this.currentPage() - 1) * this.pageSize + 1;
    return `${first}–${Math.min(first + this.pageSize - 1, total)}`;
  });

  selectFilter(filter: 'All' | CommunityCategory): void {
    this.selectedFilter.set(filter);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getMapsUrl(vendor: string): string {
    const query = `${vendor} near Jayanti Nagari 7`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
}