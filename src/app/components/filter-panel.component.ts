import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-filter-panel',
  template: `
    <div class="title">Filters</div>
    <app-filter-date />
    <app-filter-number field="expense" />
    <app-filter-string field="payee" />
    <app-filter-dropdown mode="select" field="category">
      <app-filter-list field="category" />
    </app-filter-dropdown>
    <app-filter-dropdown mode="select" field="subcategory">
      <app-filter-list field="subcategory" />
    </app-filter-dropdown>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent {}