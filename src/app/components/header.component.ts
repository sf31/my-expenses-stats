import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <div class="logo">AWESOME NAME HERE</div>
    <app-load-csv />
  `,
  styles: [
    `
      :host {
        background-color: var(--primary-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 var(--spacing-2);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
