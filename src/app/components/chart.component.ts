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
import { Subscription } from 'rxjs';
import { StoreService } from '../store.service';
import { ChartHistoryConfig, ChartStandardConfig } from '../utils/app.types';
import { CommonModule } from '@angular/common';
import { ChartHeaderComponent } from './chart-header.component';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, ChartHeaderComponent],
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
        border: 1px solid var(--bg-color);
        border-radius: var(--radius-1);
        //background-color: var(--bg-color);
        padding: var(--spacing-1);
      }

      .canvas-wrapper {
        margin-top: var(--spacing-1);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @Input() chartConfig?: ChartStandardConfig | ChartHistoryConfig;
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart | null;
  private sub?: Subscription;

  constructor(private store: StoreService) {}

  private getCtx(): CanvasRenderingContext2D {
    const ctx = this.chartCanvas?.nativeElement.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    return ctx;
  }

  ngAfterViewInit() {
    console.log('ChartComponent.ngAfterViewInit');
    if (!this.chartConfig) throw new Error('ChartStandardConfig is required');

    this.sub = this.store
      .getChartData(this.chartConfig.chartId)
      .subscribe((config) => {
        if (!config) {
          this.chart?.destroy();
          return;
        }
        if (!this.chart) this.chart = new Chart(this.getCtx(), config);
        else {
          this.chart.data.labels = config.data.labels;
          this.chart.data.datasets = config.data.datasets;
          this.chart.options = config.options!;
          this.chart.update();
        }
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.chart?.destroy();
  }
}
