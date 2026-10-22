import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <section class="page-header container">
      <span class="eyebrow">SITE INFORMATION</span>
      <h1>Terms &amp; Conditions</h1>
      <p>Guidelines for using the Jayanti Nagari 7 community website.</p>
    </section>

    <section class="container section terms-page">
      <aside class="terms-notice" role="note">
        <strong>Important:</strong> This is a general-use notice for the beta website, not legal advice.
        Please have it reviewed and adapted by a qualified legal professional before relying on it as
        binding terms.
      </aside>

      <p class="last-updated">Last updated: October 22, 2026</p>

      <article class="terms-section">
        <span>01</span>
        <div>
          <h2>Using this website</h2>
          <p>This website shares community stories, events, directories, property listings, and local business offers for information and community convenience. By using it, you agree to use the information responsibly and follow applicable laws and community rules.</p>
        </div>
      </article>

      <article class="terms-section">
        <span>02</span>
        <div>
          <h2>Beta version and information accuracy</h2>
          <p>The website is in beta and its content or features may change. Content may be incomplete, outdated, or provided by residents and third parties. Please independently verify important details before relying on them.</p>
        </div>
      </article>

      <article class="terms-section">
        <span>03</span>
        <div>
          <h2>Third-party businesses and offers</h2>
          <p>Businesses featured in JN-7 Offers are independent third parties. They are responsible for their offers, products, services, prices, availability, eligibility, and fulfilment. Confirm all terms directly with the business before purchasing. Displaying an offer does not guarantee or constitute an endorsement by JN-7.</p>
          <p>Offers marked DEMO or SAMPLE are for display and testing only. They are not real promotions and cannot be redeemed.</p>
        </div>
      </article>

      <article class="terms-section">
        <span>04</span>
        <div>
          <h2>Service Directory and contact information</h2>
          <p>Directory entries are shared for convenience and are not a certification, recommendation, or guarantee of a provider’s identity, qualifications, safety, quality, or availability. Verify a provider and agree on the scope and price of work directly before engaging them.</p>
          <p>Numbers marked as sample or dummy are not real contact numbers and must not be used to contact anyone.</p>
        </div>
      </article>

      <article class="terms-section">
        <span>05</span>
        <div>
          <h2>Move-In Corner listings</h2>
          <p>Property information is supplied for reference and is not independently verified by this website. Before making any decision or payment, verify the property, ownership, documents, pricing, availability, and all transaction terms directly with the relevant parties and appropriate professionals.</p>
        </div>
      </article>

      <article class="terms-section">
        <span>06</span>
        <div>
          <h2>Community contributions</h2>
          <p>When submitting content, ensure it is accurate, appropriate, and that you have permission to share it, including any photographs or personal information. Do not submit content that is unlawful, misleading, abusive, or infringes another person’s rights. Contact the site administrator to request a correction or removal.</p>
        </div>
      </article>

      <article class="terms-section">
        <span>07</span>
        <div>
          <h2>Updates to these terms</h2>
          <p>These website terms may be revised as the site develops. The date above indicates when this page was last updated. Continued use after changes are published means you have had an opportunity to review the updated terms.</p>
        </div>
      </article>
    </section>
  `,
  styles: [`
    .terms-page {
      max-width: 900px;
      margin-right: auto;
      margin-left: auto;
    }

    .terms-notice {
      padding: 16px 18px;
      border: 1px solid var(--line);
      border-left: 4px solid var(--accent);
      background: var(--cream);
      color: var(--ink);
      font-size: 14px;
      line-height: 1.7;
    }

    .last-updated {
      margin: 24px 0;
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: .5px;
      text-transform: uppercase;
    }

    .terms-section {
      display: grid;
      grid-template-columns: 46px minmax(0, 1fr);
      gap: 18px;
      padding: 24px 0;
      border-top: 1px solid var(--line);
    }

    .terms-section > span {
      color: var(--accent);
      font: 600 18px 'Playfair Display', serif;
    }

    .terms-section h2 {
      margin: 0 0 10px;
      font-size: 25px;
    }

    .terms-section p {
      margin: 0 0 10px;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.8;
    }

    .terms-section p:last-child {
      margin-bottom: 0;
    }

    @media (max-width: 600px) {
      .terms-section {
        grid-template-columns: 32px minmax(0, 1fr);
        gap: 10px;
      }

      .terms-section h2 {
        font-size: 22px;
      }
    }
  `]
})
export class TermsComponent {}
