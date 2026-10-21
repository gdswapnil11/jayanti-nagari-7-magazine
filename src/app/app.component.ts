import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, take } from 'rxjs';
import { MagazineService } from './core/services/magazine.service';

@Component({
  selector: 'jn7-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="topline">
        <span>JAYANTI NAGARI 7 • BETA VERSION</span>
        <span>COMMUNITY MAGAZINE • {{ magazine.edition()?.quarter || 'QUARTERLY EDITION' }} {{ magazine.edition()?.year || '' }}</span>
      </div>
      <div class="masthead">
        <a routerLink="/" class="brand">Jayanti <em>Nagari 7</em></a>
        <p>Our Society. Our Stories.</p>
        <button class="contribute" (click)="showContribute = true">✦ Contribute</button>
      </div>
      <nav class="nav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
        <a routerLink="/stories" routerLinkActive="active">Stories</a>
        <a routerLink="/events" routerLinkActive="active">Events</a>
        <a routerLink="/gallery" routerLinkActive="active">Gallery</a>
        <a routerLink="/move-in-corner" routerLinkActive="active">Move-In Corner</a>
        <a routerLink="/community" routerLinkActive="active">Professionals</a>
        <a routerLink="/service-directory" routerLinkActive="active">Service Directory</a>
        <a routerLink="/offers" routerLinkActive="active">JN-7 Offers</a>
      </nav>
    </header>

    @if (magazine.loading()) {
      <p class="container section" role="status">Loading magazine content…</p>
    }
    @if (magazine.loadError(); as error) {
      <div class="container section" role="alert">
        <p>{{ error }}</p>
        <button class="button" (click)="loadMagazine()">Try again</button>
      </div>
    }
    <main><router-outlet /></main>

    <footer class="footer">
      <div>
        <strong>Jayanti Nagari 7</strong>
        <p>A digital magazine by the community, for the community.</p>
        <p>Copyright © Swapnil Muley (Jayanti Nagari - 7)</p>
      </div>
      <div class="footer-links">
        <a routerLink="/stories">Stories</a>
        <a routerLink="/gallery">Gallery</a>
        <a routerLink="/move-in-corner">Move-In Corner</a>
        <a routerLink="/community">Professionals</a>
        <a routerLink="/service-directory">Service Directory</a>
        <a routerLink="/offers">JN-7 Offers</a>
      </div>
    </footer>

    @if (showContribute) {
      <div class="modal-backdrop" (click)="showContribute = false">
        <section class="modal" (click)="$event.stopPropagation()">
          <button class="close" (click)="showContribute = false">×</button>
          <span class="eyebrow">CONTRIBUTE</span>
          <h2>Be part of the next edition.</h2>
          <p>Share a story, achievement or another contribution with your neighbours.</p>
          <div class="contribute-options">
            <a href="https://forms.gle/cWJ4kDQqAEBRAXMb6" target="_blank" rel="noopener noreferrer">📰 Submit a story</a>
            <a href="https://forms.gle/cWJ4kDQqAEBRAXMb6" target="_blank" rel="noopener noreferrer">🏆 Share an achievement</a>
            <a href="https://forms.gle/cWJ4kDQqAEBRAXMb6" target="_blank" rel="noopener noreferrer">✦ Other contribution</a>
          </div>
        </section>
      </div>
    }
  `,
  styles: [`
    .nav {
      flex-wrap: wrap;
      overflow: visible;
    }

    .nav a {
      white-space: nowrap;
    }

    @media (max-width: 800px) {
      .nav {
        gap: 8px 20px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  readonly magazine = inject(MagazineService);
  private readonly router = inject(Router);
  showContribute = false;

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      take(1)
    ).subscribe(event => {
      if (!event.urlAfterRedirects.startsWith('/editions/')) {
        this.loadMagazine();
      }
    });
  }

  loadMagazine(): void {
    this.magazine.load().subscribe();
  }
}