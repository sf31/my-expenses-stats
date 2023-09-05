import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartConfig } from '../app.types';
import { StoreService } from '../store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chart-list',
  template: `
    <div class="filters">
      <app-filter-date />
      <app-filter-string field="payee" />
      <app-filter-string field="notes" />
      <app-filter-string field="paymentMethod" />
      <app-filter-dropdown mode="select" selectLabel="Category">
        <app-filter-list field="category" />
      </app-filter-dropdown>
      <app-filter-dropdown mode="select" selectLabel="Subcategory">
        <app-filter-list field="subcategory" />
      </app-filter-dropdown>
    </div>
    <app-chart *ngFor="let c of chartList$ | async" [chartId]="c.chartId" />
  `,
  styles: [
    `
      .filters {
        display: flex;
        flex-wrap: wrap;
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
}
