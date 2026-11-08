import { Component, Input, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * OnPush Star Rating Component - UI UX Pro Max & Addy Osmani Agent Skills
 * Uses Angular Signals and OnPush Change Detection to prevent allocating arrays on every dirty check.
 */
@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="product-rating" [attr.aria-label]="'Đánh giá ' + rating() + ' trên 5 sao'">
      <span class="stars" aria-hidden="true">
        @for (filled of starArray(); track $index) {
          <span class="star" [class.filled]="filled">★</span>
        }
      </span>
      @if (reviewCount() !== undefined) {
        <span class="count">({{ reviewCount() }})</span>
      }
    </div>
  `,
  styles: [`
    .product-rating { display: inline-flex; align-items: center; gap: 4px; }
    .stars { color: #f59e0b; font-size: 13px; letter-spacing: 1px; }
    .star:not(.filled) { color: #d1d5db; }
    .count { font-size: 12px; color: #6b7280; margin-left: 2px; }
  `]
})
export class StarRatingComponent {
  rating = signal<number>(0);
  reviewCount = signal<number | undefined>(undefined);

  @Input({ required: true }) set value(val: number) {
    this.rating.set(val || 0);
  }

  @Input() set count(val: number | undefined) {
    this.reviewCount.set(val);
  }

  starArray = computed(() => {
    const rounded = Math.min(5, Math.max(0, Math.round(this.rating())));
    return [0, 1, 2, 3, 4].map(i => i < rounded);
  });
}

