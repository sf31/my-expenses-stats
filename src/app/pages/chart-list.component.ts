import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartData } from '../app.types';
import { StoreService } from '../store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chart-list',
  template: `
    <div class="filters"></div>
    <app-chart *ngFor="let c of chartList$ | async" [config]="c" />
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartListComponent {
  chartList$: Observable<ChartData[]>;

  constructor(private store: StoreService) {
    this.chartList$ = this.store.getChartListData();
  }
}
