import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chart-list',
  template: `
    <p>
      chart-list works!
    </p>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartListComponent {

}
