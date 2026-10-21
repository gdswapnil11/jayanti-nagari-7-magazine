import { DOCUMENT } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { ServiceDirectoryCategory, ServiceDirectoryItem } from '../core/models/magazine.model';
import { MagazineService } from '../core/services/magazine.service';

@Component({
  standalone: true,
  template: `
    <section class="page-header container">
      <span class="eyebrow">LOCAL HELP • IMPORTANT CONTACTS</span>
      <h1>Service Directory</h1>
      <p>Find house help, plumbing, electrical, appliance repair and other useful services around Jayanti Nagari 7.</p>
      <p class="directory-note">Contact details are shared for community convenience. Please verify availability and service terms directly.</p>
    </section>

    <section class="container section">
      <div class="directory-controls">
        <label class="directory-search">
          <span>Search contacts</span>
          <input
            type="search"
            placeholder="Search by name, service, area or phone..."
            [value]="searchTerm()"
            (input)="updateSearch($event)"
          >
        </label>
        <div class="results-count" aria-live="polite">
          {{ resultRange() }} of {{ filteredContacts().length }} contacts
        </div>
      </div>

      <nav class="category-filters" aria-label="Filter service contacts by category">
        @for (category of categories; track category) {
          <button
            type="button"
            class="filter-pill"
            [class.selected]="selectedCategory() === category"
            [attr.aria-pressed]="selectedCategory() === category"
            (click)="selectCategory(category)"
          >{{ category }}</button>
        }
      </nav>

      @if (paginatedContacts().length) {
        <div class="contact-grid">
          @for (contact of paginatedContacts(); track contact.id) {
            <article class="contact-card">
              <div class="contact-card-heading">
                <span class="contact-icon" aria-hidden="true">{{ categoryIcon(contact.category) }}</span>
                <span class="contact-category">{{ contact.category }}</span>
              </div>
              <h2>{{ contact.name }}</h2>
              @if (contact.services.length) {
                <ul class="service-tags" aria-label="Services offered">
                  @for (service of contact.services; track service) {
                    <li>{{ service }}</li>
                  }
                </ul>
              }
              @if (canCall(contact.phone)) {
                <a class="call-button" [href]="phoneUrl(contact.phone)">
                  <span aria-hidden="true">☎</span> {{ contact.phone }}
                </a>
              } @else {
                <span class="call-button masked-contact">
                  <span aria-hidden="true">☎</span> {{ contact.phone }}
                </span>
              }
            </article>
          }
        </div>
      } @else {
        <div class="empty-state">
          @if (filteredContacts().length === 0 && contacts().length > 0) {
            No contacts match your search and category. Try changing your filters.
          } @else {
            The directory is ready for community contacts. Add verified contacts to the edition’s
            <code>serviceDirectory</code> data to list house help, plumbing, electrical, and other services.
          }
        </div>
      }

      @if (totalPages() > 1) {
        <nav class="directory-pagination" aria-label="Service directory pages">
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
    .directory-note {
      margin-top: 12px;
      font-size: 14px !important;
    }

    .directory-controls {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 18px;
      margin-bottom: 22px;
    }

    .directory-search {
      display: grid;
      width: min(100%, 540px);
      gap: 7px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
    }

    .directory-search input {
      width: 100%;
      min-height: 46px;
      padding: 11px 14px;
      border: 1px solid var(--line);
      border-radius: 4px;
      background: var(--paper);
      color: var(--ink);
      font: inherit;
    }

    .directory-search input:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .results-count {
      flex: 0 0 auto;
      padding-bottom: 12px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
    }

    .category-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 9px;
      margin-bottom: 26px;
    }

    .filter-pill {
      padding: 9px 13px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--paper);
      color: var(--ink);
      font-size: 12px;
      font-weight: 700;
    }

    .filter-pill.selected {
      border-color: var(--accent);
      background: var(--accent);
      color: #fff;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }

    .contact-card {
      display: flex;
      min-width: 0;
      flex-direction: column;
      gap: 13px;
      padding: 20px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: var(--paper);
    }

    .contact-card-heading {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .contact-icon {
      display: grid;
      width: 42px;
      height: 42px;
      flex: 0 0 42px;
      place-items: center;
      border-radius: 12px;
      background: var(--cream);
      font-size: 21px;
    }

    .contact-category {
      color: var(--accent);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: .8px;
      text-transform: uppercase;
    }

    .contact-card h2 {
      margin: 0;
      font-size: 22px;
      overflow-wrap: anywhere;
    }

    .service-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .service-tags li {
      padding: 5px 8px;
      border: 1px solid var(--line);
      border-radius: 4px;
      background: var(--white);
      color: var(--muted);
      font-size: 11px;
    }

    .contact-details {
      display: grid;
      gap: 8px;
      margin: 0;
      color: var(--muted);
      font-size: 12px;
    }

    .contact-details div {
      display: flex;
      gap: 8px;
    }

    .contact-details dt {
      flex: 0 0 78px;
      font-weight: 700;
    }

    .contact-details dd {
      min-width: 0;
      margin: 0;
      overflow-wrap: anywhere;
    }

    .call-button {
      display: inline-flex;
      min-height: 40px;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: auto;
      padding: 9px 12px;
      border-radius: 4px;
      background: var(--accent);
      color: white;
      font-size: 13px;
      font-weight: 800;
      overflow-wrap: anywhere;
    }

    .masked-contact {
      background: var(--muted);
      cursor: default;
    }

    .empty-state {
      padding: 28px;
      border: 1px dashed var(--line);
      background: var(--paper);
      color: var(--muted);
      line-height: 1.7;
    }

    .empty-state code {
      color: var(--ink);
      font-weight: 700;
    }

    .directory-pagination {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      margin-top: 28px;
    }

    .directory-pagination button {
      min-width: 40px;
      min-height: 40px;
      padding: 8px 12px;
      border: 1px solid var(--line);
      border-radius: 5px;
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

    @media (max-width: 1100px) {
      .contact-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (max-width: 800px) {
      .contact-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 600px) {
      .directory-controls {
        align-items: stretch;
        flex-direction: column;
      }

      .results-count {
        padding: 0;
      }

      .contact-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ServiceDirectoryComponent {
  private readonly document = inject(DOCUMENT);
  private readonly magazine = inject(MagazineService);
  readonly categories: Array<'All' | ServiceDirectoryCategory> = [
    'All',
    'House Help',
    'Plumbing',
    'Electrical',
    'Appliance Repair',
    'Carpentry',
    'Other Services'
  ];
  readonly selectedCategory = signal<'All' | ServiceDirectoryCategory>('All');
  readonly searchTerm = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = signal(this.getPageSize());
  readonly contacts = computed(() => this.magazine.edition()?.serviceDirectory ?? []);
  readonly filteredContacts = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchTerm().trim().toLocaleLowerCase();
    return this.contacts().filter(contact => {
      const matchesCategory = category === 'All' || contact.category === category;
      const matchesSearch = !query || [
        contact.name,
        contact.category,
        contact.phone,
        ...contact.services
      ].some(value => value.toLocaleLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  });
  readonly totalPages = computed(() => Math.ceil(this.filteredContacts().length / this.pageSize()));
  readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const start = Math.max(1, Math.min(current - 2, total - 4));
    return Array.from({ length: Math.min(total, 5) }, (_, index) => start + index);
  });
  readonly paginatedContacts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredContacts().slice(start, start + this.pageSize());
  });
  readonly resultRange = computed(() => {
    const total = this.filteredContacts().length;
    if (!total) return '0';
    const first = (this.currentPage() - 1) * this.pageSize() + 1;
    return `${first}–${Math.min(first + this.pageSize() - 1, total)}`;
  });

  selectCategory(category: 'All' | ServiceDirectoryCategory): void {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
  }

  updateSearch(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) return;
    this.searchTerm.set(event.target.value);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) this.currentPage.set(page);
  }

  categoryIcon(category: ServiceDirectoryCategory): string {
    const icons: Record<ServiceDirectoryCategory, string> = {
      'House Help': '🧹',
      Plumbing: '🔧',
      Electrical: '💡',
      'Appliance Repair': '🛠️',
      Carpentry: '🪚',
      'Other Services': '🏘️'
    };
    return icons[category];
  }

  phoneUrl(phone: string): string {
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
  }

  canCall(phone: string): boolean {
    return /^\+?\d[\d\s()-]{8,}$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.pageSize.set(this.getPageSize());
    this.currentPage.set(Math.min(this.currentPage(), Math.max(1, this.totalPages())));
  }

  private getPageSize(): number {
    const width = this.document.defaultView?.innerWidth ?? 1200;
    const columns = width > 1100 ? 4 : width > 800 ? 3 : width > 600 ? 2 : 1;
    return columns * 3;
  }
}
