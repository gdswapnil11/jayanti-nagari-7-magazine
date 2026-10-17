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
      @for (photo of photos(); track photo.title) {
        <figure>
          <div class="gallery-image-frame">
            <button class="gallery-image-button" type="button" [attr.aria-label]="'Open image: ' + photo.title" (click)="openViewer(photo)">
              <img [src]="photo.url" [alt]="photo.title">
            </button>
          </div>
          <figcaption><span>{{ photo.category }}</span><strong>{{ photo.title }}</strong></figcaption>
        </figure>
      } @empty {
        <p class="gallery-empty">No photos are available in this edition yet.</p>
      }
    </section>
    @if (selectedPhoto(); as photo) {
      <div class="gallery-viewer-backdrop" (click)="closeViewer()">
        <section class="gallery-viewer" role="dialog" aria-modal="true" [attr.aria-label]="photo.title" (click)="$event.stopPropagation()">
          <button class="gallery-viewer-close" type="button" aria-label="Close image viewer" (click)="closeViewer()">×</button>
          <img [src]="photo.url" [alt]="photo.title">
          <div class="gallery-viewer-caption"><span>{{ photo.category }}</span><strong>{{ photo.title }}</strong></div>
        </section>
      </div>
    }
  `,
  styles: [`
    .container.gallery {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      align-items: start;
      gap: 14px;
      padding-top: 45px;
      padding-bottom: 80px;
    }

    .container.gallery figure {
      display: flex;
      flex-direction: column;
      min-width: 0;
      margin: 0;
      border: 1px solid var(--line);
      background: var(--paper);
    }

    .gallery-image-frame {
      width: 100%;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      background: var(--cream);
    }

    .container.gallery img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .gallery-image-button {
      display: block;
      width: 100%;
      height: 100%;
      padding: 0;
      border: 0;
      background: transparent;
      cursor: zoom-in;
    }

    .container.gallery figcaption {
      position: static;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-height: 58px;
      padding: 9px 11px 10px;
      color: var(--ink);
      background: var(--paper);
    }

    .container.gallery figcaption span {
      font-size: 9px;
      letter-spacing: 1.3px;
      text-transform: uppercase;
      color: var(--accent);
    }

    .container.gallery figcaption strong {
      font: 16px 'Playfair Display', serif;
    }

    .gallery-empty {
      grid-column: 1 / -1;
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

    @media (max-width: 800px) {
      .container.gallery {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 520px) {
      .container.gallery {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `]
})
export class GalleryComponent {
  private readonly magazine = inject(MagazineService);
  readonly photos = computed(() => this.magazine.edition()?.gallery ?? []);
  readonly selectedPhoto = signal<GalleryPhoto | null>(null);

  openViewer(photo: GalleryPhoto): void {
    this.selectedPhoto.set(photo);
  }

  closeViewer(): void {
    this.selectedPhoto.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeViewer();
  }
}