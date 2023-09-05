import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Chart } from 'chart.js';
import { map, Subscription } from 'rxjs';
import { StoreService } from '../store.service';
import { ChartConfig } from '../app.types';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chart',
  template: `
    <div class="chart-wrapper" *ngIf="chartConfig">
      <div class="header">
        <div class="label">
          Field: <span class="field">{{ chartConfig.field }}</span>

          <span *ngIf="chartConfig.op === 'count'"> (# of entries) </span>
          <span *ngIf="chartConfig.op !== 'count'">
            (sum of <span class="op">{{ chartConfig.op }}</span
            >)
          </span>
        </div>
        <fa-icon [icon]="iconRemove" (click)="removeChart(chartConfig)" />
      </div>
      <div class="canvas-wrapper">
        <canvas [height]="400" #chartCanvas></canvas>
      </div>
    </div>
  `,
  styles: [
    `
      .chart-wrapper {
        border: 1px solid var(--border-color);
        border-radius: var(--radius-1);
        background-color: var(--hover-color);
      }

      .header {
        padding: var(--spacing-2);
        border-bottom: 1px solid var(--bg-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .label .field,
      .label .op {
        font-weight: bold;
      }

      fa-icon {
        cursor: pointer;
      }

      .canvas-wrapper {
        //padding: var(--spacing-2);
        //height: 350px;
        //position: relative;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @Input() chartConfig?: ChartConfig;
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;
  iconRemove = faTimes;

  private sub?: Subscription;
  private chart?: Chart;

  constructor(private store: StoreService) {}

  ngAfterViewInit() {
    const ctx = this.chartCanvas?.nativeElement.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    if (!this.chartConfig) throw new Error('ChartConfig is required');

    this.sub = this.store
      .getChartData(this.chartConfig.chartId)
      .pipe(
        map((chartData) => {
          if (!chartData) return;
          const { labels, data, type } = chartData;
          if (!this.chart) {
            this.chart = new Chart(ctx, {
              type: type,
              data: { labels, datasets: [{ data }] },
              options: {
                responsive: true,
                maintainAspectRatio: false,
              },
            }) as Chart;
          } else {
            this.chart.data.labels = labels;
            this.chart.data.datasets[0].data = data;
            this.chart.update();
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.chart?.destroy();
  }

  removeChart(config: ChartConfig): void {
    this.store.removeChart(config.chartId);
  }
}
