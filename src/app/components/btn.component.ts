import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-btn',
  template: `
    <div class="btn-wrapper">
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
        border-radius: var(--radius-1);
        border: 1px solid var(--border-color);
        cursor: pointer;
        background-color: var(--bg-color);
        user-select: none;

        &:hover {
          background-color: var(--border-color);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnComponent {}
