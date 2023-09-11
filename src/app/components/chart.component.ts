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
import {
  ChartData,
  ChartHistoryConfig,
  ChartStandardConfig,
} from '../app.types';

@Component({
  selector: 'app-chart',
  template: `
    <div class="chart-wrapper">
      <app-chart-header [config]="chartConfig" />
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @Input() chartConfig?: ChartStandardConfig | ChartHistoryConfig;
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;

  private sub?: Subscription;
  private chart?: Chart;

  constructor(private store: StoreService) {}

  ngAfterViewInit() {
    const ctx = this.chartCanvas?.nativeElement.getContext('2d');
    const chartConfig = this.chartConfig;
    if (!ctx) throw new Error('Could not get canvas context');
    if (!chartConfig) throw new Error('ChartStandardConfig is required');

    this.sub = this.store
      .getChartData(chartConfig.chartId)
      .pipe(
        map((chartData) => {
          if (!chartData) return;
          if (!this.chart) {
            if (chartConfig.configType === 'standard')
              this.chart = createStandardChart(ctx, chartConfig, chartData);
            else if (chartConfig.configType === 'history')
              this.chart = createHistoryChart(ctx, chartData);
            else
              throw new Error('Invalid chartConfig.configType: ' + chartConfig);
          } else {
            this.chart.data.labels = chartData.labels;
            this.chart.data.datasets[0].data = chartData.data;
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
}

function createStandardChart(
  ctx: CanvasRenderingContext2D,
  config: ChartStandardConfig,
  chartData: ChartData,
): Chart {
  return new Chart(ctx, {
    type: config.type,
    data: {
      labels: chartData.labels,
      datasets: [
        {
          data: chartData.data,
          // todo - add colors
          // backgroundColor: chartData.labels.map(stringToHexColor),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: config.type === 'pie',
        },
      },
    },
  }) as Chart;
}

function createHistoryChart(
  ctx: CanvasRenderingContext2D,
  chartData: ChartData,
): Chart {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [
        {
          data: chartData.data,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  }) as Chart;
}
