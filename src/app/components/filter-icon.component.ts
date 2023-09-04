import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-filter-icon',
  template: ` <fa-icon [icon]="icon" [class.enabled]="enabled" /> `,
  styles: [
    `
      fa-icon {
        cursor: pointer;
        color: var(--disabled-color);
      }

      .enabled {
        color: var(--primary-color);
      }

      .show {
        display: none;
      }

      .show-toggle:hover + .show {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterIconComponent {
  @Input({ required: true }) enabled?: boolean;
  icon = faFilter;
}
