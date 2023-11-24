import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartHistoryConfig, ChartStandardConfig } from '../utils/app.types';
import { StoreService } from '../store.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SelectComponent } from './select.component';
import { BtnComponent } from './btn.component';

@Component({
  selector: 'app-chart-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, SelectComponent, BtnComponent],
  template: `
    <ng-container
      class="standard"
      *ngIf="showEdit && config && config.configType === 'standard'"
    >
      <app-select
        [itemList]="stdChartTypeList"
        [itemSelected]="config.type"
        placeholder="Chart type"
        (itemSelectedChange)="updateStandard(config.chartId, { type: $event })"
      />

      <app-select
        [itemList]="chartOpList"
        [itemSelected]="config.op"
        placeholder="Operation"
        (itemSelectedChange)="updateStandard(config.chartId, { op: $event })"
      />

      <app-select
        [itemList]="stdFieldList"
        [itemSelected]="config.field"
        placeholder="Field"
        (itemSelectedChange)="updateStandard(config.chartId, { field: $event })"
      />
    </ng-container>

    <ng-container *ngIf="showEdit && config && config.configType === 'history'">
      <app-select
        [itemList]="historyChartPeriodList"
        [itemSelected]="config.period"
        placeholder="Period"
        (itemSelectedChange)="updateHistory(config.chartId, { period: $event })"
      />

      <app-select
        [itemList]="historyDateFormatList"
        [itemSelected]="config.dateFormat"
        placeholder="Date Format"
        (itemSelectedChange)="
          updateHistory(config.chartId, { dateFormat: $event })
        "
      />

      <app-select
        [itemList]="chartOpList"
        [itemSelected]="config.op"
        placeholder="Operation"
        (itemSelectedChange)="updateHistory(config.chartId, { op: $event })"
      />
    </ng-container>

    <div class="actions">
      <span (click)="showEdit = !showEdit">
        {{ showEdit ? 'Done' : 'Edit' }}
      </span>
      <span class="separator"></span>
      <span (click)="removeChart()">Remove</span>
    </div>
  `,
  styles: [
    `
      :host {
        flex: 1 1 auto;
        gap: var(--spacing-2);
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, auto));
      }

      .label {
        margin-bottom: var(--spacing-1);
      }

      .actions {
        background-color: var(--bg-color);
        border-radius: var(--radius-1);
        padding: var(--spacing-1);
        display: grid;
        grid-template-columns: 1fr 1px 1fr;
        cursor: pointer;
      }

      .actions .separator {
        border-right: 1px solid var(--border-color);
        width: 1px;
      }

      span {
        text-align: center;
      }

      .actions > span:last-child {
        color: var(--danger-color);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartHeaderComponent {
  @Input() config?: ChartHistoryConfig | ChartStandardConfig;

  stdChartTypeList: ChartStandardConfig['type'][] = ['pie', 'line', 'bar'];
  chartOpList: (ChartHistoryConfig['op'] | ChartStandardConfig['op'])[] = [
    'expense',
    'income',
    'count',
  ];
  stdFieldList: ChartStandardConfig['field'][] = [
    'date',
    'payee',
    'expense',
    // 'income',
    'category',
    'subcategory',
    'notes',
    'paymentMethod',
  ];

  historyChartPeriodList: ChartHistoryConfig['period'][] = [
    'daily',
    'weekly',
    'monthly',
    'yearly',
  ];

  historyDateFormatList: ChartHistoryConfig['dateFormat'][] = [
    'dd MMM yy',
    'dd MMM yyyy',
    'MMM yy',
    'MMM yyyy',
    'yyyy',
  ];

  showEdit = true;

  constructor(private store: StoreService) {}

  removeChart(): void {
    if (this.config) this.store.removeChart(this.config.chartId);
  }

  updateStandard(chartId: string, p: Partial<ChartStandardConfig>): void {
    this.store.updateStandardChartConfig(chartId, p);
  }

  updateHistory(chartId: string, p: Partial<ChartHistoryConfig>): void {
    this.store.updateHistoryChartConfig(chartId, p);
  }
}
