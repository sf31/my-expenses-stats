import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-wrapper">
      <app-header />
      <app-payment-list />
      <!--      <app-chart-list />-->
    </div>
  `,
  styles: [
    `
      .home-wrapper {
        display: grid;
        //grid-template-columns: 1fr 1fr;
        grid-template-rows: 50px 1fr;
        height: 100vh;
      }

      app-header {
        grid-column: 1 / 3;
        grid-row: 1 / 2;
      }

      app-payment-list {
        grid-column: 1 / 2;
        grid-row: 2 / 3;
        overflow: auto;
      }

      app-chart-list {
        grid-column: 2 / 3;
        grid-row: 2 / 3;
        overflow: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
