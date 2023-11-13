import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartHistoryConfig, ChartStandardConfig } from '../app.types';
import { StoreService } from '../store.service';
import { CommonModule } from '@angular/common';
import { BtnComponent } from '../shared/btn.component';
import { SelectComponent } from './select.component';

@Component({
  selector: 'app-add-chart',
  standalone: true,
  imports: [CommonModule, BtnComponent, SelectComponent],
  template: `
    <div class="title">Add Chart</div>

    <div class="add-chart-wrapper">
      <div class="std-or-hist">
        <app-btn
          [class.selected]="selectedChartConfig === 'standard'"
          (click)="selectedChartConfig = 'standard'"
        >
          Standard
        </app-btn>
        <app-btn
          type="success"
          [class.selected]="selectedChartConfig === 'history'"
          (click)="selectedChartConfig = 'history'"
        >
          History</app-btn
        >
      </div>

      <ng-container *ngIf="selectedChartConfig === 'standard'">
        <app-select
          [placeholder]="'Chart type'"
          [itemList]="chartTypes"
          [itemSelected]="standard.type"
          (itemSelectedChange)="setStandardProp({ type: $event })"
        />

        <app-select
          [placeholder]="'Field'"
          [itemList]="fieldList"
          [itemSelected]="standard.field"
          (itemSelectedChange)="setStandardProp({ field: $event })"
        />

        <app-select
          [placeholder]="'Operation'"
          [itemList]="chartOps"
          [itemSelected]="standard.op"
          (itemSelectedChange)="setStandardProp({ op: $event })"
        />

        <app-btn (click)="addChart('standard')"> Add chart </app-btn>
      </ng-container>

      <ng-container *ngIf="selectedChartConfig === 'history'">
        <app-select
          [placeholder]="'Period'"
          [itemList]="periodList"
          [itemSelected]="history.period"
          (itemSelectedChange)="setHistoryProp({ period: $event })"
        />

        <app-select
          [placeholder]="'Operation'"
          [itemList]="chartOps"
          [itemSelected]="history.op"
          (itemSelectedChange)="setHistoryProp({ op: $event })"
        />

        <app-select
          [placeholder]="'Date format'"
          [itemList]="dateFormatList"
          [itemSelected]="history.dateFormat"
          (itemSelectedChange)="setHistoryProp({ dateFormat: $event })"
        />

        <app-btn (click)="addChart('history')"> Add chart </app-btn>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .title {
        margin: var(--spacing-3);
      }
      .add-chart-wrapper {
        padding: var(--spacing-2);
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
        flex-wrap: wrap;
      }

      .std-or-hist {
        display: flex;
        align-items: center;
      }

      .std-or-hist app-btn {
        flex: 1;
      }

      .std-or-hist app-btn.selected {
        color: var(--success-color);
      }

      app-select {
        min-width: 150px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddChartComponent {
  selectedChartConfig?: 'standard' | 'history';
  standard: Partial<ChartStandardConfig> = {};
  history: Partial<ChartHistoryConfig> = {};

  chartTypes: ChartStandardConfig['type'][] = ['pie', 'line', 'bar'];
  fieldList: ChartStandardConfig['field'][] = [
    'date',
    'payee',
    'expense',
    'income',
    'category',
    'subcategory',
    'notes',
    'paymentMethod',
  ];
  periodList: ChartHistoryConfig['period'][] = [
    'daily',
    'weekly',
    'monthly',
    'yearly',
  ];
  dateFormatList: ChartHistoryConfig['dateFormat'][] = [
    'dd MMM yy',
    'dd MMM yyyy',
    'MMM yy',
    'MMM yyyy',
    'yyyy',
  ];
  chartOps: (ChartStandardConfig | ChartHistoryConfig)['op'][] = [
    'expense',
    'income',
    'count',
  ];

  constructor(private store: StoreService) {}

  setStandardProp(p: Partial<ChartStandardConfig>): void {
    this.standard = { ...this.standard, ...p };
  }

  setHistoryProp(p: Partial<ChartHistoryConfig>): void {
    this.history = { ...this.history, ...p };
  }

  addChart(configType: 'standard' | 'history'): void {
    if (configType === 'standard') {
      const { type, field, op } = this.standard;
      if (!type || !field || !op) return;
      this.store.createStandardChart({ type, field, op });
    }
    if (configType === 'history') {
      const { period, op, dateFormat } = this.history;
      if (!period || !op || !dateFormat) return;
      this.store.createHistoryChart({ period, op, dateFormat });
    }
  }
}
