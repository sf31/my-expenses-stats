import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="btn-wrapper" [class]="type">
      <ng-content />
    </div>
  `,
  styles: [
    `
      .btn-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: var(--spacing-1) var(--spacing-2);
        border-radius: var(--radius);
        cursor: pointer;
        user-select: none;

        &:hover {
          //background-color: var(--border-color);
        }
      }

      .standard {
        background-color: var(--bg-color);
      }

      .success {
        background-color: var(--success-color);
      }

      .warning {
        background-color: var(--warning-color);
      }

      .danger {
        background-color: var(--danger-color);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnComponent {
  @Input() type: 'standard' | 'success' | 'warning' | 'danger' = 'standard';
}
