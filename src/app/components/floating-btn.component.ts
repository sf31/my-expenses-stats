import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-floating-btn',
  template: `
    <div class="floating-btn" [className]="position">
      <fa-icon *ngIf="icon" [icon]="icon" />
    </div>
  `,
  styles: [
    `
      @mixin floating-btn() {
        position: absolute;
        padding: var(--spacing-2);
        border-radius: 50%;
        background-color: var(--accent-color);
        cursor: pointer;
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.4rem;
        bottom: 15px;
      }

      .left {
        @include floating-btn();
        left: 25px;
      }

      .right {
        @include floating-btn();
        right: 25px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingBtnComponent {
  @Input() position: 'left' | 'right' = 'right';
  @Input() icon?: IconDefinition;
}
