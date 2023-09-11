import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="filter-panel-wrapper">
      <app-filter-panel />
    </div>
    <div class="content">
      <router-outlet />
    </div>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: auto 1fr;
        height: calc(100vh - 50px);
        overflow: hidden;
      }

      .filter-panel-wrapper,
      .content {
        overflow: auto;
      }

      .filter-panel-wrapper {
        padding: var(--spacing-3) 0;
      }

      .content {
        padding: var(--spacing-3);
        padding-top: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
