import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-wrapper">
      <ng-content />
    </div>
  `,
  styles: [
    `
      .card-wrapper {
        background-color: var(--bg-color);
        padding: var(--spacing-1);
        border-radius: var(--radius-1);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {}
