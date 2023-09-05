import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <app-header />
      <div class="content-outer">
        <div class="content">
          <router-outlet />
        </div>
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

      .content-outer {
        display: grid;
        grid-template-columns: auto 70vw auto;
        overflow: auto;
        padding: var(--spacing-2);
      }

      .content {
        grid-column: 2 / 3;
      }

      @media screen and (max-width: 1600px) {
        .content-outer {
          grid-template-columns: 1fr;
        }
        .content {
          grid-column: 1 / 2;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
