import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ChartHistoryConfig,
  ChartStandardConfig,
  State,
} from '../utils/app.types';
import { StoreService } from '../store.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../components/chart.component';
import { NoDataComponent } from '../components/no-data.component';
import { BtnComponent } from '../components/btn.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChartLine, faChartPie } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chart-list',
  standalone: true,
  imports: [
    CommonModule,
    ChartComponent,
    NoDataComponent,
    BtnComponent,
    FontAwesomeModule,
  ],
  template: `
    <app-no-data
      class="no-data"
      *ngIf="!(paymentListExists$ | async); else addChartView"
    />

    <ng-template #addChartView>
      <div class="buttons">
        <div class="title">Add Chart</div>
        <div class="add-btn hover" (click)="addChart('standard')">
          <fa-icon [icon]="iconStd" />
          Standard
        </div>

        <div class="add-btn hover" (click)="addChart('history')">
          <fa-icon [icon]="iconHistory" />
          History
        </div>
      </div>
    </ng-template>

    <ng-container *ngIf="stdChartList$ | async as stdChartList">
      <div class="chart-list">
        <app-chart
          *ngFor="let c of stdChartList | keyvalue; trackBy: trackByFn"
          [chartConfig]="c.value"
        />
      </div>
    </ng-container>

    <ng-container *ngIf="historyChartList$ | async as historyChartList">
      <div class="chart-list history">
        <app-chart
          *ngFor="let c of historyChartList | keyvalue; trackBy: trackByFn"
          [chartConfig]="c.value"
        />
      </div>
    </ng-container>
  `,
  styles: [
    `
      .chart-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
        //grid-template-columns: 1fr 1fr;
        grid-gap: var(--spacing-3);
        margin-bottom: var(--spacing-3);
      }

      .chart-list.history {
        grid-template-columns: 1fr 1fr;
        margin-bottom: var(--spacing-3);
      }

      .buttons {
        display: flex;
        align-items: center;
        padding-bottom: var(--spacing-2);
        gap: var(--spacing-2);
      }

      .add-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-2);
        background-color: var(--bg-color);
        padding: var(--spacing-1);
        border-radius: var(--radius-1);
        font-size: 1.2rem;
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
  stdChartList$: Observable<State['stdChartList']>;
  historyChartList$: Observable<State['historyChartList']>;
  paymentListExists$: Observable<boolean>;
  iconStd = faChartPie;
  iconHistory = faChartLine;

  constructor(private store: StoreService) {
    this.stdChartList$ = this.store.select('stdChartList');
    this.historyChartList$ = this.store.select('historyChartList');
    this.paymentListExists$ = this.store
      .select('paymentList')
      .pipe(map((paymentList) => paymentList.length > 0));
  }

  addChart(type: 'standard' | 'history'): void {
    this.store.createChartConfig(type);
  }

  trackByFn(
    index: number,
    item: {
      key: string;
      value: ChartStandardConfig | ChartHistoryConfig;
    },
  ): string {
    return item.key;
  }

  // defaultCharts(): void {
  //   this.chartList$.pipe(take(1)).subscribe((list) => {
  //     const merged = [...list.standard, ...list.history];
  //     merged.map((c) => this.store.removeChart(c.chartId));
  //     const charts = [
  //       { type: 'pie', field: 'category', op: 'expense' },
  //       { type: 'pie', field: 'subcategory', op: 'expense' },
  //       { type: 'bar', field: 'category', op: 'expense' },
  //       { type: 'bar', field: 'category', op: 'count' },
  //     ];
  //
  //     charts.map((c: any) => this.store.createStandardChart(c));
  //
  //     const historyCharts = [
  //       { period: 'daily', op: 'expense', dateFormat: 'dd MMM yy' },
  //       { period: 'weekly', op: 'expense', dateFormat: 'MMM yy' },
  //       { period: 'monthly', op: 'expense', dateFormat: 'MMM yy' },
  //     ];
  //
  //     historyCharts.map((c: any) => this.store.createHistoryChart(c));
  //   });
  // }
}
