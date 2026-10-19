import { DOCUMENT } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { CommunityCategory, CommunityItem } from '../core/models/magazine.model';
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

      <label class="directory-search">
        <span>Search professionals</span>
        <input
          type="search"
          placeholder="Search names, services, categories, details..."
          [value]="searchTerm()"
          (input)="updateSearch($event)"
        >
      </label>

      @if (filteredCommunity().length === 0) {
        <div class="empty-state">No professionals match your search and category filters. Try another search or category.</div>
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
            <button class="text-button details-button" type="button" (click)="openDetails(item)">
              View details
            </button>
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

    @if (selectedProfile(); as profile) {
      <div class="profile-dialog-backdrop" (click)="closeDetails()">
        <section
          class="profile-dialog"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="'profile-title'"
          (click)="$event.stopPropagation()"
        >
          <button class="profile-dialog-close" type="button" aria-label="Close profile details" (click)="closeDetails()">×</button>
          <div class="community-top">
            <div class="community-icon">{{ profile.icon }}</div>
            <span class="tag">{{ profile.category }}</span>
          </div>
          <h2 id="profile-title">{{ profile.vendor }}</h2>
          <h3>{{ profile.service }}</h3>
          <p>{{ profile.description }}</p>
          <ul class="service-points">
            <li>{{ profile.detail }}</li>
            <li>{{ profile.contact }}</li>
            <li>{{ profile.phone }}</li>
          </ul>
          <a
            class="text-button"
            [href]="getMapsUrl(profile.vendor)"
            target="_blank"
            rel="noopener noreferrer">View on Google Maps →</a>
        </section>
      </div>
    }
  `,
  styles: [`
    .directory-search {
      display: grid;
      max-width: 480px;
      gap: 7px;
      margin: 0 0 24px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
    }

    .directory-search input {
      width: 100%;
      min-height: 42px;
      padding: 10px 12px;
      border: 1px solid var(--line);
      border-radius: 3px;
      background: var(--paper);
      color: var(--ink);
      font: inherit;
    }

    .directory-search input:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .community-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
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

    .details-button {
      align-self: flex-start;
      margin-top: 10px;
    }

    .profile-dialog-backdrop {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: grid;
      place-items: center;
      padding: 20px;
      background: rgb(0 0 0 / 60%);
    }

    .profile-dialog {
      position: relative;
      width: min(100%, 560px);
      max-height: min(90vh, 760px);
      overflow: auto;
      padding: 30px;
      border: 1px solid var(--line);
      background: var(--paper);
      box-shadow: 0 18px 60px rgb(0 0 0 / 25%);
    }

    .profile-dialog-close {
      position: absolute;
      top: 10px;
      right: 12px;
      width: 38px;
      height: 38px;
      border: 1px solid var(--line);
      background: var(--white);
      color: var(--ink);
      font-size: 26px;
      line-height: 1;
    }

    .profile-dialog h2 {
      margin: 16px 42px 6px 0;
      font-size: 30px;
    }

    .profile-dialog h3 {
      margin-bottom: 12px;
      color: var(--accent);
      font: 700 15px 'DM Sans', sans-serif;
    }

    .profile-dialog p {
      color: var(--muted);
      line-height: 1.7;
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

    @media (max-width: 1200px) {
      .community-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (max-width: 900px) {
      .community-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 600px) {
      .community-grid {
        grid-template-columns: 1fr;
      }
    }

  `]
})
export class CommunityComponent {
  private readonly document = inject(DOCUMENT);
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
  readonly searchTerm = signal('');
  readonly currentPage = signal(1);
  readonly selectedProfile = signal<CommunityItem | null>(null);
  readonly pageSize = signal(this.getPageSize());
  readonly filteredCommunity = computed(() => {
    const category = this.selectedFilter();
    const query = this.searchTerm().trim().toLocaleLowerCase();
    return this.community().filter(item => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesSearch = !query || Object.values(item)
        .some(value => String(value).toLocaleLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  });
  readonly totalPages = computed(() => Math.ceil(this.filteredCommunity().length / this.pageSize()));
  readonly pages = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index + 1));
  readonly paginatedCommunity = computed(() => {
    const pageSize = this.pageSize();
    const start = (this.currentPage() - 1) * pageSize;
    return this.filteredCommunity().slice(start, start + pageSize);
  });
  readonly resultRange = computed(() => {
    const total = this.filteredCommunity().length;
    if (total === 0) return '0';
    const pageSize = this.pageSize();
    const first = (this.currentPage() - 1) * pageSize + 1;
    return `${first}–${Math.min(first + pageSize - 1, total)}`;
  });

  selectFilter(filter: 'All' | CommunityCategory): void {
    this.selectedFilter.set(filter);
    this.currentPage.set(1);
  }

  updateSearch(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) return;
    this.searchTerm.set(event.target.value);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  openDetails(profile: CommunityItem): void {
    this.selectedProfile.set(profile);
  }

  closeDetails(): void {
    this.selectedProfile.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDetails();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.pageSize.set(this.getPageSize());
    this.currentPage.set(Math.min(this.currentPage(), Math.max(1, this.totalPages())));
  }

  private getPageSize(): number {
    const width = this.document.defaultView?.innerWidth ?? 1200;
    const columns = width > 1200 ? 4 : width > 900 ? 3 : width > 600 ? 2 : 1;
    return columns * 2;
  }

  getMapsUrl(vendor: string): string {
    const query = `${vendor} near Jayanti Nagari 7`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
}