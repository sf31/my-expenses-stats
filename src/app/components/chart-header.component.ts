import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartHistoryConfig, ChartStandardConfig } from '../app.types';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-chart-header',
  template: `
    <div class="header" *ngIf="config">
      <div class="label">
        Field:
        <span class="field" *ngIf="config.configType === 'standard'">{{
          config.field
        }}</span>
        <span class="field" *ngIf="config.configType === 'history'">{{
          config.period
        }}</span>

        <span *ngIf="config.op === 'count'"> (# of entries) </span>
        <span *ngIf="config.op !== 'count'">
          (sum of <span class="op">{{ config.op }}</span
          >)
        </span>
      </div>
      <fa-icon [icon]="iconRemove" (click)="removeChart()" />
    </div>
  `,
  styles: [
    `
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartHeaderComponent {
  @Input() config?: ChartHistoryConfig | ChartStandardConfig;
  iconRemove = faTimes;
  constructor(private store: StoreService) {}

  removeChart(): void {
    if (this.config) this.store.removeChart(this.config.chartId);
  }
}
