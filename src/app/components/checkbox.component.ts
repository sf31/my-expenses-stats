import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-checkbox',
  template: `
    <div class="checkbox-wrapper" [class.checked]="checked">
      <fa-icon [icon]="icon" *ngIf="checked" />
    </div>
  `,
  styles: [
    `
      .checkbox-wrapper {
        width: 20px;
        height: 20px;
        cursor: pointer;
        border: 1px solid var(--disabled-color);
        border-radius: var(--radius-1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
        color: var(--bg-color);
        &.checked {
          background-color: var(--primary-color);
          border: 1px solid var(--primary-color);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent {
  @Input() checked?: boolean;
  icon = faCheck;
}
