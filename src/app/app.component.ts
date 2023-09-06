import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <app-header />
      <div class="content">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        height: 100vh;
        display: grid;
        grid-template-rows: 50px 1fr;
      }

      .content {
        overflow: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
