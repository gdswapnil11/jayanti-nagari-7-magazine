import { Component, computed, inject, signal } from '@angular/core';
import { CommunityOffer, CommunityOfferCategory } from '../core/models/magazine.model';
import { MagazineService } from '../core/services/magazine.service';

@Component({
  standalone: true,
  template: `
    <section class="offers-hero">
      <div class="container offers-hero-inner">
        <span class="eyebrow">GOOD THINGS, CLOSE TO HOME</span>
        <h1>Neighbourhood<br><em>offers for JN-7.</em></h1>
        <p>Discover special offers shared by nearby restaurants, hotels, showrooms and local businesses.</p>
        <a class="explore-link" href="#offers-list">Explore offers <span aria-hidden="true">↓</span></a>
        <span class="hero-stamp" aria-hidden="true">LOCAL<br>LOVE</span>
      </div>
    </section>

    <section class="container section" id="offers-list">
      <div class="disclaimer" role="note">
        <span class="disclaimer-icon" aria-hidden="true">i</span>
        <p><strong>Please note:</strong> Offers are provided by participating businesses, not guaranteed by JN-7. Confirm availability, eligibility, dates, prices and full terms directly with the business before making a purchase. JN-7 is not responsible for changes, fulfilment or disputes. Sample offers are for demonstration only and are not redeemable.</p>
      </div>

      <div class="offers-toolbar">
        <label class="offer-search">
          <span>Find an offer</span>
          <input
            type="search"
            placeholder="Search businesses, deals, categories..."
            [value]="searchTerm()"
            (input)="updateSearch($event)"
          >
        </label>
        <span class="results-count" aria-live="polite">{{ filteredOffers().length }} offers</span>
      </div>

      <nav class="offer-filters" aria-label="Filter offers by business type">
        @for (category of categories; track category) {
          <button
            type="button"
            class="offer-filter"
            [class.active]="selectedCategory() === category"
            [attr.aria-pressed]="selectedCategory() === category"
            (click)="selectCategory(category)"
          >
            <span aria-hidden="true">{{ iconForCategory(category) }}</span>{{ category }}
          </button>
        }
      </nav>

      @if (paginatedOffers().length) {
        <div class="offer-grid">
          @for (offer of paginatedOffers(); track offer.id) {
            <article class="offer-card" [class.expanded]="expandedOfferId() === offer.id">
              <div class="offer-banner" [attr.data-category]="offer.category">
                <div class="offer-banner-top">
                  <span>{{ offer.category }}</span>
                  <span class="demo-tag">DEMO</span>
                </div>
                <div class="offer-banner-content">
                  <div class="business-panel">
                    <small>COMPANY</small>
                    <strong class="banner-business">{{ offer.businessName }}</strong>
                  </div>
                  <div class="banner-copy">
                    <small>JN-7 SPECIAL OFFER</small>
                    <strong class="banner-title">{{ offer.title }}</strong>
                  </div>
                  <strong class="banner-label">{{ offer.offerLabel }}</strong>
                </div>
              </div>
              <div class="offer-copy">
                <p class="offer-description">{{ offer.description }}</p>
              </div>
              @if (expandedOfferId() === offer.id) {
                <div class="offer-terms">
                  <strong>Offer details</strong>
                  <p>{{ offer.terms }}</p>
                </div>
              }
              <button class="offer-action" type="button" (click)="toggleOffer(offer.id)">
                {{ expandedOfferId() === offer.id ? 'Hide details' : 'See offer details' }}
                <span aria-hidden="true">{{ expandedOfferId() === offer.id ? '↑' : '→' }}</span>
              </button>
            </article>
          }
        </div>
      } @else {
        <div class="empty-state">
          @if (offers().length) {
            No offers match your search and category. Try another filter.
          } @else {
            No business offers have been added yet. Check back soon for neighbourhood deals.
          }
        </div>
      }

      @if (totalPages() > 1) {
        <nav class="offer-pagination" aria-label="Offer pages">
          <button type="button" [disabled]="currentPage() === 1" (click)="goToPage(currentPage() - 1)">Previous</button>
          @for (page of pages(); track page) {
            <button
              type="button"
              [class.active]="currentPage() === page"
              [attr.aria-current]="currentPage() === page ? 'page' : null"
              (click)="goToPage(page)"
            >{{ page }}</button>
          }
          <button type="button" [disabled]="currentPage() === totalPages()" (click)="goToPage(currentPage() + 1)">Next</button>
        </nav>
      }
    </section>
  `,
  styles: [`
    .offers-hero {
      overflow: hidden;
      background: var(--dark);
      color: white;
    }

    .offers-hero-inner {
      position: relative;
      padding-top: clamp(52px, 8vw, 96px);
      padding-bottom: clamp(52px, 8vw, 96px);
    }

    .offers-hero .eyebrow {
      color: #e9b58f;
    }

    .offers-hero h1 {
      position: relative;
      z-index: 1;
      margin: 14px 0 18px;
      font-size: clamp(48px, 7vw, 82px);
      line-height: .98;
      letter-spacing: -2px;
    }

    .offers-hero h1 em {
      color: #a8d4c5;
      font-weight: 500;
    }

    .offers-hero p {
      position: relative;
      z-index: 1;
      max-width: 540px;
      margin: 0;
      color: #d4e1da;
      font-size: 17px;
      line-height: 1.7;
    }

    .explore-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-top: 26px;
      padding: 12px 17px;
      background: #e9b58f;
      color: var(--dark);
      font-size: 13px;
      font-weight: 800;
    }

    .hero-stamp {
      position: absolute;
      top: 50%;
      right: 6%;
      display: grid;
      width: clamp(130px, 19vw, 230px);
      aspect-ratio: 1;
      place-content: center;
      border: 1px solid rgba(168, 212, 197, .5);
      border-radius: 50%;
      color: rgba(168, 212, 197, .7);
      font: 600 clamp(24px, 3.8vw, 45px)/.95 'Playfair Display', serif;
      letter-spacing: 2px;
      text-align: center;
      transform: translateY(-50%) rotate(12deg);
    }

    .disclaimer {
      display: flex;
      align-items: flex-start;
      gap: 13px;
      margin-bottom: 34px;
      padding: 16px 18px;
      border: 1px solid #e6d0ad;
      background: #fff8e9;
      color: #5e503d;
    }

    .disclaimer-icon {
      display: grid;
      width: 24px;
      height: 24px;
      flex: 0 0 24px;
      place-items: center;
      border-radius: 50%;
      background: #ead7b5;
      color: #654e2e;
      font-weight: 800;
    }

    .disclaimer p {
      margin: 0;
      font-size: 13px;
      line-height: 1.65;
    }

    .offers-toolbar {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 18px;
      margin-bottom: 18px;
    }

    .offer-search {
      display: grid;
      width: min(100%, 560px);
      gap: 7px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
    }

    .offer-search input {
      width: 100%;
      min-height: 46px;
      padding: 11px 14px;
      border: 1px solid var(--line);
      border-radius: 4px;
      background: var(--paper);
      color: var(--ink);
      font: inherit;
    }

    .offer-search input:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .results-count {
      padding-bottom: 12px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 800;
    }

    .offer-filters {
      display: flex;
      gap: 9px;
      overflow-x: auto;
      padding: 2px 1px 13px;
      margin-bottom: 16px;
    }

    .offer-filter {
      display: inline-flex;
      min-height: 40px;
      flex: 0 0 auto;
      align-items: center;
      gap: 7px;
      padding: 8px 13px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--white);
      color: var(--ink);
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .offer-filter.active {
      border-color: var(--dark);
      background: var(--dark);
      color: white;
    }

    .offer-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }

    .offer-card {
      position: relative;
      display: flex;
      min-width: 0;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: var(--paper);
      box-shadow: 0 8px 22px rgba(22, 59, 58, .06);
      transition: transform .18s ease, box-shadow .18s ease;
    }

    .offer-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 14px 30px rgba(22, 59, 58, .12);
    }

    .demo-tag {
      flex: 0 0 auto;
      padding: 5px 7px;
      border-radius: 3px;
      background: #f4dfc9;
      color: #744922;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: .8px;
    }

    .offer-banner {
      --banner-bg: #dcece7;
      --banner-accent: #17645f;
      --banner-ink: #163b3a;
      position: relative;
      display: flex;
      min-height: 174px;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      isolation: isolate;
      padding: 38px 26px 20px;
      background: var(--banner-bg);
      color: var(--banner-ink);
    }

    .offer-banner::before,
    .offer-banner::after {
      position: absolute;
      inset-block: 0;
      z-index: 0;
      content: '';
      pointer-events: none;
    }

    .offer-banner::before {
      left: 0;
      width: 26%;
      background: var(--banner-accent);
      clip-path: polygon(0 0, 82% 0, 100% 50%, 82% 100%, 0 100%);
    }

    .offer-banner::after {
      right: 18%;
      left: 36%;
      background: rgba(255, 255, 255, .27);
      clip-path: polygon(12% 0, 100% 0, 88% 100%, 0 100%);
    }

    .offer-banner[data-category='Hotels & Resorts'] {
      --banner-bg: #e4e9f3;
      --banner-accent: #345579;
      --banner-ink: #172e48;
    }

    .offer-banner[data-category='Showrooms'] {
      --banner-bg: #f5e2d7;
      --banner-accent: #a34d36;
      --banner-ink: #49271f;
    }

    .offer-banner[data-category='Shopping'] {
      --banner-bg: #f1e4ef;
      --banner-accent: #814574;
      --banner-ink: #42253b;
    }

    .offer-banner[data-category='Health & Wellness'] {
      --banner-bg: #e3ecd7;
      --banner-accent: #56723c;
      --banner-ink: #2c4024;
    }

    .offer-banner[data-category='Other Offers'] {
      --banner-bg: #f3ebce;
      --banner-accent: #876c2d;
      --banner-ink: #463918;
    }

    .offer-banner-top {
      position: absolute;
      z-index: 1;
      top: 12px;
      right: 20px;
      left: calc(26% + 24px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      color: var(--banner-accent);
      font-size: 9px;
      font-weight: 900;
      letter-spacing: .8px;
      text-transform: uppercase;
    }

    .offer-banner-content {
      display: grid;
      grid-template-columns: minmax(170px, .8fr) minmax(0, 2fr) minmax(150px, .75fr);
      align-items: center;
      gap: 24px;
      margin-top: 3px;
    }

    .business-panel,
    .banner-copy {
      display: grid;
      min-width: 0;
      gap: 5px;
    }

    .business-panel {
      position: relative;
      z-index: 1;
      color: white;
    }

    .business-panel small {
      color: rgba(255, 255, 255, .8);
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1px;
    }

    .banner-copy {
      position: relative;
      z-index: 1;
    }

    .banner-copy small {
      color: var(--banner-accent);
      font-size: 8px;
      font-weight: 900;
      letter-spacing: 1.1px;
    }

    .banner-business {
      font: 700 clamp(20px, 2.2vw, 30px)/1.05 'Playfair Display', serif;
      overflow-wrap: anywhere;
    }

    .banner-title {
      color: var(--banner-ink);
      font: 800 clamp(21px, 2.8vw, 36px)/1.08 'Playfair Display', serif;
      text-transform: uppercase;
      overflow-wrap: anywhere;
    }

    .banner-label {
      position: relative;
      z-index: 1;
      justify-self: stretch;
      padding: 13px 11px;
      background: rgba(255, 255, 255, .72);
      color: var(--banner-accent);
      font: 900 clamp(17px, 2.2vw, 30px)/1 'DM Sans', sans-serif;
      text-align: center;
      overflow-wrap: normal;
    }

    .offer-copy {
      flex: 1;
      padding: 16px 20px 10px;
    }

    .offer-description {
      margin: 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.65;
    }

    .offer-terms {
      margin: 0 20px 14px;
      padding: 12px;
      border-left: 3px solid var(--accent);
      background: var(--white);
      color: var(--muted);
      font-size: 12px;
      line-height: 1.6;
    }

    .offer-terms strong {
      color: var(--ink);
    }

    .offer-terms p {
      margin: 5px 0 0;
    }

    .offer-action {
      display: flex;
      min-height: 48px;
      align-items: center;
      justify-content: space-between;
      margin: 0 20px 18px;
      padding: 0 14px;
      border: 0;
      border-radius: 4px;
      background: var(--accent);
      color: white;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
    }

    .offer-action:hover,
    .offer-action:focus-visible {
      background: var(--dark);
    }

    .empty-state {
      padding: 30px;
      border: 1px dashed var(--line);
      background: var(--paper);
      color: var(--muted);
    }

    .offer-pagination {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      margin-top: 28px;
    }

    .offer-pagination button {
      min-width: 40px;
      min-height: 40px;
      padding: 8px 12px;
      border: 1px solid var(--line);
      border-radius: 5px;
      background: var(--paper);
      color: var(--ink);
      font-weight: 700;
      cursor: pointer;
    }

    .offer-pagination button.active {
      border-color: var(--accent);
      background: var(--accent);
      color: white;
    }

    .offer-pagination button:disabled {
      cursor: not-allowed;
      opacity: .45;
    }

    @media (max-width: 700px) {
      .offer-banner {
        min-height: 200px;
        padding: 48px 15px 18px;
      }

      .offer-banner::before {
        width: 100%;
        height: 70px;
        clip-path: none;
      }

      .offer-banner::after {
        right: 0;
        left: 0;
        clip-path: polygon(55% 0, 100% 0, 78% 100%, 38% 100%);
      }

      .offer-banner-top {
        right: 14px;
        left: 14px;
      }

      .offer-banner-content {
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 12px;
        margin-top: 0;
      }

      .business-panel {
        grid-column: 1 / -1;
      }

      .banner-copy small {
        font-size: 7px;
      }

      .banner-title {
        font-size: clamp(18px, 5vw, 25px);
      }

      .banner-label {
        max-width: 130px;
        font-size: clamp(16px, 4vw, 22px);
      }

      .hero-stamp {
        right: -30px;
        opacity: .38;
      }

      .offers-toolbar {
        align-items: stretch;
        flex-direction: column;
      }

      .results-count {
        padding: 0;
      }

      .offer-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OffersComponent {
  private readonly magazine = inject(MagazineService);
  readonly categories: Array<'All' | CommunityOfferCategory> = [
    'All',
    'Restaurants & Cafes',
    'Hotels & Resorts',
    'Showrooms',
    'Shopping',
    'Health & Wellness',
    'Other Offers'
  ];
  readonly selectedCategory = signal<'All' | CommunityOfferCategory>('All');
  readonly searchTerm = signal('');
  readonly expandedOfferId = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly pageSize = signal(4);
  readonly offers = computed(() => this.magazine.edition()?.communityOffers ?? []);
  readonly filteredOffers = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchTerm().trim().toLocaleLowerCase();
    return this.offers().filter(offer => {
      const matchesCategory = category === 'All' || offer.category === category;
      const searchable = [
        offer.businessName,
        offer.category,
        offer.title,
        offer.offerLabel,
        offer.description,
        offer.terms
      ];
      const matchesSearch = !query || searchable.some(value => value.toLocaleLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  });
  readonly totalPages = computed(() => Math.ceil(this.filteredOffers().length / this.pageSize()));
  readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const start = Math.max(1, Math.min(current - 2, total - 4));
    return Array.from({ length: Math.min(total, 5) }, (_, index) => start + index);
  });
  readonly paginatedOffers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredOffers().slice(start, start + this.pageSize());
  });

  iconForCategory(category: 'All' | CommunityOfferCategory): string {
    const icons: Record<CommunityOfferCategory, string> = {
      'Restaurants & Cafes': '☕',
      'Hotels & Resorts': '✧',
      Showrooms: '⌂',
      Shopping: '✦',
      'Health & Wellness': '❋',
      'Other Offers': '＋'
    };
    return category === 'All' ? '✦' : icons[category];
  }

  selectCategory(category: 'All' | CommunityOfferCategory): void {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
  }

  updateSearch(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) return;
    this.searchTerm.set(event.target.value);
    this.currentPage.set(1);
  }

  toggleOffer(id: string): void {
    this.expandedOfferId.set(this.expandedOfferId() === id ? null : id);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) this.currentPage.set(page);
  }

}
