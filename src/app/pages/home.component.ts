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
      }

      .filter-panel-wrapper,
      .content {
        overflow: auto;
      }

      .content {
        padding: 0 var(--spacing-2);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
