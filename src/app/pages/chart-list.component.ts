import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartConfig } from '../app.types';
import { StoreService } from '../store.service';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-chart-list',
  template: `
    <div class="filters"></div>
    <div class="debug" (click)="defaultCharts()">SET DEFAULT CHARTS</div>

    <div class="chart-list" *ngIf="chartList$ | async as chartList">
      <app-chart *ngFor="let c of chartList" [chartConfig]="c" />
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
  chartList$: Observable<ChartConfig[]>;

  constructor(private store: StoreService) {
    this.chartList$ = this.store.select('chartList');
  }

  defaultCharts(): void {
    this.chartList$.pipe(take(1)).subscribe((list) => {
      list.map((c) => this.store.removeChart(c.chartId));
      const charts = [
        { type: 'pie', field: 'category', op: 'expense' },
        { type: 'pie', field: 'subcategory', op: 'expense' },
        { type: 'bar', field: 'category', op: 'expense' },
        { type: 'bar', field: 'category', op: 'count' },
      ];

      charts.map((c: any) => this.store.createChart(c));
    });
  }
}
