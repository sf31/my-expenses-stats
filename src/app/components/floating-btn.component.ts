import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-floating-btn',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
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
        width: 25px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.4rem;
        bottom: 15px;
        color: #ffffff;
      }

      .left {
        @include floating-btn();
        left: 15px;
      }

      .right {
        @include floating-btn();
        right: 15px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingBtnComponent {
  @Input() position: 'left' | 'right' = 'right';
  @Input() icon?: IconDefinition;
}
