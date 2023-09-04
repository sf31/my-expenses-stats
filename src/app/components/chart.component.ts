import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Chart } from 'chart.js';
import { ChartData } from '../app.types';

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
export class ChartComponent implements AfterViewInit {
  @Input() config?: ChartData;
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    if (!this.config) throw new Error('No chart config provided');
    const ctx = this.chartCanvas?.nativeElement.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    new Chart(ctx, {
      type: this.config?.type,
      data: {
        labels: this.config.labels,
        datasets: [{ data: this.config.data }],
      },
      options: {},
    });
  }
}
