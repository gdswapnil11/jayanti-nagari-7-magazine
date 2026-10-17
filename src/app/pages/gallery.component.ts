import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { GalleryPhoto } from '../core/models/magazine.model';
import { MagazineService } from '../core/services/magazine.service';

@Component({
  standalone: true,
  template: `
    <section class="page-header container">
      <span class="eyebrow">PHOTO STORIES</span>
      <h1>Gallery</h1>
      <p>Moments captured by our neighbours.</p>
    </section>
    <section class="container gallery">
      <nav class="gallery-filters" aria-label="Filter gallery by category">
        @for (category of categories(); track category) {
          <button type="button" [class.selected]="selectedCategory() === category" [attr.aria-pressed]="selectedCategory() === category" (click)="selectedCategory.set(category)">
            {{ category }}
          </button>
        }
      </nav>
      <p class="gallery-count" aria-live="polite">{{ visiblePhotos().length }} {{ visiblePhotos().length === 1 ? 'photo' : 'photos' }}</p>
      <div class="gallery-masonry">
        @for (photo of visiblePhotos(); track photo.title) {
          <figure>
            <button class="gallery-image-button" type="button" [attr.aria-label]="'View ' + photo.title + ' in full size'" (click)="openViewer(photo)">
              <img [src]="photo.url" [alt]="photo.title" loading="lazy">
              <span class="gallery-photo-label">
                <span>{{ photo.category }}</span>
                <strong>{{ photo.title }}</strong>
              </span>
            </button>
          </figure>
        } @empty {
          <p class="gallery-empty">No photos are available in this category.</p>
        }
      </div>
    </section>
    @if (selectedPhoto(); as photo) {
      <div class="gallery-viewer-backdrop" (click)="closeViewer()">
        <section class="gallery-viewer" role="dialog" aria-modal="true" [attr.aria-label]="photo.title" (click)="$event.stopPropagation()">
          <button class="gallery-viewer-close" type="button" aria-label="Close image viewer" (click)="closeViewer()">×</button>
          <button class="gallery-viewer-nav previous" type="button" aria-label="Previous image" (click)="showAdjacentPhoto(-1)">‹</button>
          <img [src]="photo.url" [alt]="photo.title">
          <button class="gallery-viewer-nav next" type="button" aria-label="Next image" (click)="showAdjacentPhoto(1)">›</button>
          <div class="gallery-viewer-caption"><span>{{ photo.category }}</span><strong>{{ photo.title }}</strong><small>{{ selectedPhotoIndex() + 1 }} / {{ visiblePhotos().length }}</small></div>
        </section>
      </div>
    }
  `,
  styles: [`
    .container.gallery {
      padding-top: 45px;
      padding-bottom: 80px;
    }

    .gallery-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 9px;
      margin-bottom: 12px;
    }

    .gallery-filters button {
      padding: 8px 14px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--white);
      color: var(--ink);
      font-size: 13px;
    }

    .gallery-filters button.selected {
      border-color: var(--dark);
      background: var(--dark);
      color: var(--white);
    }

    .gallery-count {
      margin: 0 0 18px;
      color: var(--muted);
      font-size: 13px;
    }

    .gallery-masonry {
      columns: 4 220px;
      column-gap: 16px;
    }

    .gallery-masonry figure {
      display: inline-block;
      width: 100%;
      margin: 0 0 16px;
      overflow: hidden;
      border-radius: 9px;
      background: var(--cream);
      break-inside: avoid;
    }

    .gallery-image-button {
      position: relative;
      display: block;
      width: 100%;
      padding: 0;
      border: 0;
      background: transparent;
      cursor: zoom-in;
    }

    .gallery-image-button img {
      display: block;
      width: 100%;
      height: auto;
      transition: transform 220ms ease;
    }

    .gallery-image-button:hover img,
    .gallery-image-button:focus-visible img {
      transform: scale(1.035);
    }

    .gallery-photo-label {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
      padding: 34px 13px 13px;
      background: linear-gradient(transparent, rgb(0 0 0 / 78%));
      color: #fff;
      text-align: left;
      opacity: 0;
      transition: opacity 180ms ease;
    }

    .gallery-image-button:hover .gallery-photo-label,
    .gallery-image-button:focus-visible .gallery-photo-label {
      opacity: 1;
    }

    .gallery-photo-label span {
      border-radius: 999px;
      padding: 4px 8px;
      background: rgb(255 255 255 / 92%);
      color: var(--accent);
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .gallery-photo-label strong {
      font: 17px 'Playfair Display', serif;
    }

    .gallery-empty {
      color: var(--muted);
    }

    .gallery-viewer-backdrop {
      position: fixed;
      inset: 0;
      z-index: 20;
      display: grid;
      place-items: center;
      padding: 24px;
      background: rgb(0 0 0 / 85%);
    }

    .gallery-viewer {
      position: relative;
      display: flex;
      flex-direction: column;
      width: min(100%, 1100px);
      max-height: 100%;
      overflow: auto;
      border-radius: 8px;
      background: var(--paper);
    }

    .gallery-viewer > img {
      display: block;
      width: 100%;
      max-height: calc(100vh - 130px);
      object-fit: contain;
      background: #111;
    }

    .gallery-viewer-close {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 1;
      width: 42px;
      height: 42px;
      border: 0;
      border-radius: 50%;
      background: rgb(0 0 0 / 70%);
      color: white;
      font-size: 30px;
      line-height: 1;
    }

    .gallery-viewer-nav {
      position: absolute;
      top: 50%;
      z-index: 1;
      width: 44px;
      height: 44px;
      transform: translateY(-50%);
      border: 0;
      border-radius: 50%;
      background: rgb(0 0 0 / 70%);
      color: white;
      font-size: 34px;
      line-height: 1;
    }

    .gallery-viewer-nav.previous { left: 12px; }
    .gallery-viewer-nav.next { right: 12px; }

    .gallery-viewer-caption {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px 16px;
    }

    .gallery-viewer-caption span {
      color: var(--accent);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.3px;
      text-transform: uppercase;
    }

    .gallery-viewer-caption strong {
      font: 20px 'Playfair Display', serif;
    }

    .gallery-viewer-caption small {
      color: var(--muted);
    }

    @media (prefers-reduced-motion: reduce) {
      .gallery-image-button img,
      .gallery-photo-label { transition: none; }
    }
  `]
})
export class GalleryComponent {
  private readonly magazine = inject(MagazineService);
  readonly photos = computed(() => this.magazine.edition()?.gallery ?? []);
  readonly categories = computed(() => ['All', ...new Set(this.photos().map(photo => photo.category))]);
  readonly selectedCategory = signal('All');
  readonly visiblePhotos = computed(() => this.selectedCategory() === 'All'
    ? this.photos()
    : this.photos().filter(photo => photo.category === this.selectedCategory()));
  readonly selectedPhoto = signal<GalleryPhoto | null>(null);

  readonly selectedPhotoIndex = computed(() => this.visiblePhotos().findIndex(photo => photo === this.selectedPhoto()));

  openViewer(photo: GalleryPhoto): void {
    this.selectedPhoto.set(photo);
  }

  showAdjacentPhoto(direction: -1 | 1): void {
    const photos = this.visiblePhotos();
    const index = this.selectedPhotoIndex();
    if (index < 0 || photos.length < 2) return;
    this.selectedPhoto.set(photos[(index + direction + photos.length) % photos.length]);
  }

  closeViewer(): void {
    this.selectedPhoto.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeViewer();
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    if (this.selectedPhoto()) this.showAdjacentPhoto(-1);
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    if (this.selectedPhoto()) this.showAdjacentPhoto(1);
  }
}