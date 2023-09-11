import { ChangeDetectionStrategy, Component } from '@angular/core';
import { State } from '../app.types';
import { StoreService } from '../store.service';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-chart-list',
  template: `
    <div class="filters"></div>
    <div class="debug" (click)="defaultCharts()">SET DEFAULT CHARTS</div>
    <div class="debug" (click)="reset()">RESET</div>

    <div class="chart-list" *ngIf="chartList$ | async as chartList">
      <div class="standard">
        <app-chart *ngFor="let c of chartList.standard" [chartConfig]="c" />
      </div>

      <div class="history">
        <app-chart *ngFor="let c of chartList.history" [chartConfig]="c" />
      </div>
    </div>
  `,
  styles: [
    `
      .chart-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: var(--spacing-3);
        padding: var(--spacing-3) 0;
      }

      .filters {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: var(--spacing-2);
        justify-items: center;
      }

      @media screen and (max-width: 600px) {
        .chart-list {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartListComponent {
  chartList$: Observable<State['chartList']>;

  constructor(private store: StoreService) {
    this.chartList$ = this.store.select('chartList');
  }

  defaultCharts(): void {
    this.chartList$.pipe(take(1)).subscribe((list) => {
      const merged = [...list.standard, ...list.history];
      merged.map((c) => this.store.removeChart(c.chartId));
      const charts = [
        { type: 'pie', field: 'category', op: 'expense' },
        { type: 'pie', field: 'subcategory', op: 'expense' },
        { type: 'bar', field: 'category', op: 'expense' },
        { type: 'bar', field: 'category', op: 'count' },
      ];

      charts.map((c: any) => this.store.createStandardChart(c));

      const historyCharts = [
        { period: 'daily', op: 'expense', dateFormat: 'dd MMM yy' },
        { period: 'monthly', op: 'expense', dateFormat: 'MMM yy' },
      ];

      historyCharts.map((c: any) => this.store.createHistoryChart(c));
    });
  }

  reset(): void {
    this.store.resetChartState();
  }
}
