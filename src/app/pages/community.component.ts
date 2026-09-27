import { Component } from '@angular/core';
import { community } from '../data';

@Component({
  standalone: true,
  template: `
    <section class="page-header container">
      <span class="eyebrow">CONNECT LOCALLY</span>
      <h1>Professional Directory</h1>
      <p>Find trusted doctors, IT professionals, wellness experts, chefs, yoga coaches and more from within Jayanti Nagari 7.</p>
    </section>

    <section class="container section">
      <div class="community-toolbar">
        <div class="filter-pills">
          <button type="button" class="filter-pill" [class.active]="selectedFilter === 'All'" (click)="selectedFilter = 'All'">All</button>
          <button type="button" class="filter-pill" [class.active]="selectedFilter === 'Doctors'" (click)="selectedFilter = 'Doctors'">Doctors</button>
          <button type="button" class="filter-pill" [class.active]="selectedFilter === 'IT Professionals'" (click)="selectedFilter = 'IT Professionals'">IT Professionals</button>
          <button type="button" class="filter-pill" [class.active]="selectedFilter === 'Health & Wellness'" (click)="selectedFilter = 'Health & Wellness'">Health & Wellness</button>
          <button type="button" class="filter-pill" [class.active]="selectedFilter === 'Cooking & Nutrition'" (click)="selectedFilter = 'Cooking & Nutrition'">Cooking & Nutrition</button>
          <button type="button" class="filter-pill" [class.active]="selectedFilter === 'Yoga & Fitness'" (click)="selectedFilter = 'Yoga & Fitness'">Yoga & Fitness</button>
          <button type="button" class="filter-pill" [class.active]="selectedFilter === 'Home Services'" (click)="selectedFilter = 'Home Services'">Home Services</button>
          <button type="button" class="filter-pill" [class.active]="selectedFilter === 'Other Professionals'" (click)="selectedFilter = 'Other Professionals'">Other Professionals</button>
        </div>
        <div class="results-count">{{ filteredCommunity.length }} profiles</div>
      </div>

      @if (filteredCommunity.length === 0) {
        <div class="empty-state">No professionals match this category yet. Please try another filter.</div>
      }

      <div class="community-grid">
        @for (item of filteredCommunity; track item.vendor) {
          <article class="community-card">
            <div class="community-top">
              <div class="community-icon">{{ item.icon }}</div>
              <span class="tag">{{ item.category }}</span>
            </div>
            <div class="vendor-meta">
              <h2>{{ item.vendor }}</h2>
              <span>{{ item.service }}</span>
            </div>
            <p>{{ item.description }}</p>
            <ul class="service-points">
              <li>{{ item.detail }}</li>
              <li>{{ item.contact }}</li>
              <li>{{ item.phone }}</li>
            </ul>
            <button class="text-button">Contact expert →</button>
          </article>
        }
      </div>
    </section>
  `
})
export class CommunityComponent {
  readonly community = community;
  selectedFilter: 'All' | 'Doctors' | 'IT Professionals' | 'Health & Wellness' | 'Cooking & Nutrition' | 'Yoga & Fitness' | 'Home Services' | 'Other Professionals' = 'All';

  get filteredCommunity() {
    if (this.selectedFilter === 'All') {
      return this.community;
    }

    return this.community.filter(item => item.category === this.selectedFilter);
  }
}