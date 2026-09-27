import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'jn7-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="topline">
        <span>JAYANTI NAGARI 7</span>
        <span>COMMUNITY MAGAZINE • QUARTERLY EDITION • Q3 2026</span>
      </div>
      <div class="masthead">
        <a routerLink="/" class="brand">Jayanti <em>Nagari 7</em></a>
        <p>Our Society. Our Stories. Our People.</p>
        <button class="contribute" (click)="showContribute = true">✦ Contribute</button>
      </div>
      <nav class="nav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
        <a routerLink="/stories" routerLinkActive="active">Stories</a>
        <a routerLink="/articles" routerLinkActive="active">Articles</a>
        <a routerLink="/events" routerLinkActive="active">Events</a>
        <a routerLink="/gallery" routerLinkActive="active">Gallery</a>
        <a routerLink="/people" routerLinkActive="active">People</a>
        <a routerLink="/community" routerLinkActive="active">Professionals</a>
      </nav>
    </header>

    <main><router-outlet /></main>

    <footer class="footer">
      <div>
        <strong>Jayanti Nagari 7</strong>
        <p>A digital magazine by the community, for the community.</p>
        <p>Copyright © Swapnil Muley (Jayanti Nagari - 7)</p>
      </div>
      <div class="footer-links">
        <a routerLink="/stories">Stories</a>
        <a routerLink="/articles">Articles</a>
        <a routerLink="/gallery">Gallery</a>
        <a routerLink="/community">Professionals</a>
      </div>
    </footer>

    @if (showContribute) {
      <div class="modal-backdrop" (click)="showContribute = false">
        <section class="modal" (click)="$event.stopPropagation()">
          <button class="close" (click)="showContribute = false">×</button>
          <span class="eyebrow">CONTRIBUTE</span>
          <h2>Be part of the next edition.</h2>
          <p>Share a story, achievement, event, photograph, business or career opportunity with your neighbours.</p>
          <div class="contribute-options">
            <button>📰 Submit a story</button><button>🏆 Share an achievement</button>
            <button>📸 Submit photos</button><button>💼 Post an opportunity</button>
          </div>
        </section>
      </div>
    }
  `
})
export class AppComponent {
  showContribute = false;
}