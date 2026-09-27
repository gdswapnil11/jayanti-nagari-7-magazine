import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <section class="page-header container"><span class="eyebrow">PHOTO STORIES</span><h1>Gallery</h1><p>Moments captured by our neighbours.</p></section>
    <section class="container gallery">
      @for (photo of photos; track photo.title) {
        <figure><img [src]="photo.url" [alt]="photo.title"><figcaption><span>{{ photo.category }}</span><strong>{{ photo.title }}</strong></figcaption></figure>
      }
    </section>
  `
})
export class GalleryComponent {
  readonly photos = [
    { title: 'Festival Evening', category: 'Events', url: 'https://images.unsplash.com/photo-1604824718084-1d8f2f8f6f9f?auto=format&fit=crop&w=1000&q=85' },
    { title: 'Together on the Ground', category: 'Community', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=85' },
    { title: 'Young Minds', category: 'Kids', url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85' },
    { title: 'Celebration', category: 'Festivals', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=85' },
    { title: 'Community Together', category: 'Society Life', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85' },
    { title: 'A New Memory', category: 'Moments', url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=85' }
  ];
}