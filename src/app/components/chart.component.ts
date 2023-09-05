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

@Component({
  selector: 'app-chart',
  template: `
    <div class="chart-wrapper">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [
    `
      .chart-wrapper {
        width: 400px;
        height: 400px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @Input() chartId?: string;
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;

  private sub?: Subscription;
  private chart?: Chart;

  constructor(private store: StoreService) {}

  ngAfterViewInit() {
    const ctx = this.chartCanvas?.nativeElement.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    if (!this.chartId) throw new Error('Chart ID is required');

    this.sub = this.store
      .getChartData(this.chartId)
      .pipe(
        map((chartData) => {
          if (!chartData) return;
          const { labels, data, type } = chartData;
          if (!this.chart) {
            this.chart = new Chart(ctx, {
              type: type,
              data: { labels, datasets: [{ data }] },
              options: {},
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
}
