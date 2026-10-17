import { Component, Input } from '@angular/core';

@Component({
  selector: 'jn7-story-category-placeholder',
  standalone: true,
  template: `
    <div
      class="story-placeholder"
      [attr.data-category]="category"
      role="img"
      [attr.aria-label]="category + ' story illustration placeholder'"
    >
      <span class="placeholder-orbit" aria-hidden="true"></span>
      <strong class="placeholder-mark" aria-hidden="true">{{ categoryMark }}</strong>
      <span class="placeholder-category">{{ category }}</span>
      <small class="placeholder-caption">JN7 COMMUNITY STORIES</small>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .story-placeholder {
      position: relative;
      display: flex;
      height: 210px;
      overflow: hidden;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f1dfd0, #ead0bd);
      color: #713f30;
      isolation: isolate;
    }

    .story-placeholder::before,
    .story-placeholder::after,
    .placeholder-orbit {
      position: absolute;
      z-index: -1;
      display: block;
      border: 1px solid currentColor;
      border-radius: 50%;
      content: '';
      opacity: .16;
    }

    .story-placeholder::before {
      width: 210px;
      height: 210px;
      transform: translate(42%, -34%);
    }

    .story-placeholder::after {
      width: 150px;
      height: 150px;
      transform: translate(-55%, 40%);
    }

    .placeholder-orbit {
      width: 300px;
      height: 110px;
      transform: rotate(-32deg);
    }

    .placeholder-mark {
      font: 600 clamp(64px, 10vw, 100px)/1 'Playfair Display', serif;
      letter-spacing: -8px;
      opacity: .78;
    }

    .placeholder-category {
      position: absolute;
      bottom: 34px;
      left: 22px;
      font: 600 18px 'Playfair Display', serif;
    }

    .placeholder-caption {
      position: absolute;
      right: 20px;
      bottom: 17px;
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 1.5px;
      opacity: .65;
    }

    .story-placeholder[data-category='Business Corner'] {
      background: linear-gradient(135deg, #e6e1cc, #cbd0bc);
      color: #455849;
    }

    .story-placeholder[data-category='People'] {
      background: linear-gradient(135deg, #e8d8cf, #d7c1b6);
      color: #704c48;
    }

    .story-placeholder[data-category='Wellbeing'] {
      background: linear-gradient(135deg, #d8e5dd, #bed6ca);
      color: #3e6255;
    }

    .story-placeholder[data-category='Events'] {
      background: linear-gradient(135deg, #e6d9c7, #d7c1a2);
      color: #705132;
    }

    :host(.feature) .story-placeholder {
      height: clamp(240px, 42vw, 420px);
    }
  `]
})
export class StoryCategoryPlaceholderComponent {
  @Input({ required: true }) category = '';

  get categoryMark(): string {
    return this.category
      .split(/[\s&]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join('');
  }
}
