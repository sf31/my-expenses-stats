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
        display: grid;
        grid-template-rows: 50px 1fr;
        height: 100vh;
      }

      .content {
        overflow: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
