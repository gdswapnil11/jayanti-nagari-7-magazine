import { Component } from '@angular/core';

@Component({
  selector: 'jn7-maintenance',
  standalone: true,
  template: `
    <main class="maintenance-page">
      <section class="maintenance-card" aria-labelledby="maintenance-title">
        <img class="brand-icon" src="assets/jn7-icon.svg" alt="">
        <span class="eyebrow">A MESSAGE FROM SWAPNIL</span>
        <div class="status"><span aria-hidden="true"></span> WITH GRATITUDE</div>
        <h1 id="maintenance-title">Goodbye,<br><em>everyone.</em></h1>
        <p class="message">
          We were getting ready to launch our community magazine, but had to stop
          before it could begin. Thank you for your interest and support.
          We’re sorry we couldn’t share this journey with you.
        </p>
        <div class="divider" aria-hidden="true"></div>
        <p class="thanks">Thank You Jayanti Nagari - 7</p>
      </section>
      <p class="page-footer">THANK YOU FOR BEING PART OF OUR STORY</p>
    </main>
  `,
  styles: [`
    .maintenance-page {
      min-height: 100vh;
      padding: 36px 20px 22px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background:
        radial-gradient(ellipse at 50% 38%, rgba(20, 125, 117, .09), transparent 55%),
        var(--paper);
    }

    .maintenance-card {
      width: min(100%, 560px);
      padding: 52px 58px 48px;
      text-align: center;
      background: var(--white);
      border: 1px solid var(--line);
      box-shadow: 0 18px 60px rgba(22, 59, 58, .08);
    }

    .brand-icon {
      display: block;
      width: 54px;
      height: 54px;
      margin: 0 auto 18px;
      border-radius: 12px;
    }

    .eyebrow {
      color: var(--muted);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 2px;
    }

    .status {
      width: fit-content;
      margin: 32px auto 20px;
      padding: 9px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--accent);
      background: var(--cream);
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1.2px;
    }

    .status span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent);
    }

    h1 {
      margin: 0;
      font-size: clamp(48px, 10vw, 68px);
      line-height: .98;
      letter-spacing: -2px;
    }

    h1 em {
      color: var(--accent);
      font-weight: 500;
    }

    .message {
      max-width: 370px;
      margin: 22px auto 0;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.7;
    }

    .divider {
      width: 42px;
      height: 2px;
      margin: 30px auto 18px;
      background: var(--line);
    }

    .thanks {
      margin: 0;
      color: var(--ink);
      font-size: 12px;
      font-weight: 700;
    }

    .page-footer {
      margin: 22px 0 0;
      color: var(--muted);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 2px;
    }

    @media (max-width: 520px) {
      .maintenance-card {
        padding: 42px 24px 38px;
      }
    }
  `]
})
export class MaintenanceComponent {}
