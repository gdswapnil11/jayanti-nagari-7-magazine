import { Component, computed, inject, signal } from '@angular/core';
import { MagazineService } from '../core/services/magazine.service';

@Component({
  standalone: true,
  template: `
    <section class="page-header container">
      <span class="eyebrow">MEMBER BOARD</span>
      <h1>Move-In Corner</h1>
      <p>Direct property listings from residents. No broker fee, no platform fee, no middlemen.</p>
      <div class="notice-box">
        <strong>Internal listing only:</strong> This is a society-only board. Please do not post properties outside Jayanti Nagari 7, and brokers are not entertained. Keep it within the community.
      </div>
    </section>

    <section class="container section">
      <div class="filter-row" aria-label="Filter property listings">
        @for (type of listingTypes(); track type) {
          <button
            type="button"
            class="filter-pill"
            [class.selected]="selectedType() === type"
            [attr.aria-pressed]="selectedType() === type"
            (click)="selectedType.set(type)"
          >
            {{ type }}
          </button>
        }
      </div>

      @if (filteredListings().length) {
        <div class="listing-grid">
          @for (listing of filteredListings(); track listing.id) {
            <article class="listing-card">
              <div class="listing-header">
                <span class="listing-badge" [class.sale]="listing.type === 'For Sale'" [class.rent]="listing.type === 'For Rent'">
                  {{ listing.type }}
                </span>
                <strong>{{ listing.price }}</strong>
              </div>

              <h2>{{ listing.title }}</h2>
              <p class="listing-location">{{ listing.location }}</p>

              <ul class="listing-meta">
                <li>{{ listing.area }}</li>
                <li>{{ listing.bedrooms }}</li>
              </ul>

              <p class="listing-description">{{ listing.description }}</p>

              <div class="listing-footer">
                <span>No broker</span>
                <strong>{{ maskedContact(listing.contact) }}</strong>
              </div>
            </article>
          }
        </div>
      } @else {
        <div class="empty-state">No property listings match this category right now.</div>
      }
    </section>
  `,
  styles: [`
    .notice-box {
      margin-top: 18px;
      padding: 14px 18px;
      border: 1px solid var(--line);
      background: var(--cream);
      color: var(--ink);
      line-height: 1.6;
      font-size: 14px;
    }

    .notice-box strong {
      color: var(--accent);
    }

    .listing-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 22px;
    }

    .listing-card {
      display: flex;
      flex-direction: column;
      gap: 18px;
      padding: 24px;
      background: var(--paper);
      border: 1px solid var(--line);
    }

    .listing-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .listing-badge {
      display: inline-flex;
      align-items: center;
      padding: 7px 10px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      border-radius: 999px;
      background: #e3ede8;
      color: var(--accent);
    }

    .listing-badge.sale {
      background: #e5ebe1;
      color: #426454;
    }

    .listing-badge.rent {
      background: #d8eae4;
      color: #17645f;
    }

    .listing-header strong {
      font-size: 18px;
      color: var(--ink);
    }

    .listing-card h2 {
      margin: 0;
      font-size: 28px;
      line-height: 1.2;
    }

    .listing-location {
      margin: 0;
      color: var(--muted);
      font-weight: 700;
    }

    .listing-meta {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .listing-meta li {
      padding: 7px 10px;
      background: #edf2ec;
      border: 1px solid var(--line);
      font-size: 12px;
      font-weight: 700;
      color: var(--ink);
    }

    .listing-description {
      margin: 0;
      color: var(--muted);
      line-height: 1.7;
    }

    .listing-footer {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      font-size: 12px;
      color: var(--muted);
      border-top: 1px solid var(--line);
      padding-top: 14px;
    }

    .listing-footer strong {
      font-size: 12px;
      color: var(--ink);
    }

    @media (max-width: 1200px) {
      .listing-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 700px) {
      .listing-grid {
        grid-template-columns: 1fr;
      }
    }

  `]
})
export class MoveInCornerComponent {
  private readonly magazine = inject(MagazineService);

  readonly selectedType = signal('All');

  maskedContact(contact: string): string {
    return contact.replace(/\+91\s+\d{5}\s+\d{5}/g, '+91 98XXX XXXXX');
  }

  readonly listingTypes = computed(() => {
    const options = ['All'];
    const types = this.magazine.edition()?.moveInCorner.map(item => item.type) ?? [];
    return [...new Set([...options, ...types])];
  });

  readonly filteredListings = computed(() => {
    const type = this.selectedType();
    const listings = this.magazine.edition()?.moveInCorner ?? [];
    return type === 'All' ? listings : listings.filter(item => item.type === type);
  });
}
