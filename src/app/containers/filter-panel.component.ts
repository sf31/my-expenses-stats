import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputComponent } from '../components/input.component';
import { combineLatest, map, Observable } from 'rxjs';
import { SelectComponent } from '../components/select.component';
import { SelectMultipleComponent } from '../components/select-multiple.component';
import { InputNumberComponent } from '../components/input-number.component';
import { StoreService } from '../store.service';
import {
  FilterDate,
  FilterList,
  FilterNumber,
  FilterString,
} from '../utils/app.types';
import { InputDateComponent } from '../components/input-date.component';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    InputComponent,
    SelectComponent,
    SelectMultipleComponent,
    InputNumberComponent,
    InputDateComponent,
  ],
  template: `
    <ng-container *ngIf="view$ | async as view">
      <div class="item">
        <div class="label">Payee</div>
        <app-input
          [value]="view.filters.payee?.value"
          (valueChange)="onPayeeChange($event)"
          placeholder="Search text"
        />
      </div>

      <div class="item">
        <div class="label">Expense</div>
        <div class="min-max">
          <app-input-number
            [value]="view.filters.expense?.min"
            (valueChange)="onExpenseChange($event, 'min', view.filters.expense)"
            placeholder="Min"
          />
          <app-input-number
            [value]="view.filters.expense?.max"
            (valueChange)="onExpenseChange($event, 'max', view.filters.expense)"
            placeholder="Max"
          />
        </div>
      </div>

      <div class="item">
        <div class="label">Categories</div>
        <app-select-multiple
          [itemList]="view.categories"
          [itemListSelected]="view.filters.category?.values"
          (itemListSelectedChange)="onCategoryChange($event)"
          mode="dropdown"
        />
      </div>

      <div class="item">
        <div class="label">Sub-categories</div>
        <app-select-multiple
          [itemList]="view.subcategories"
          [itemListSelected]="view.filters.subcategory?.values"
          (itemListSelectedChange)="onSubcategoryChange($event)"
          mode="dropdown"
        />
      </div>

      <div class="item">
        <div class="label">Date</div>
        <div class="min-max">
          <app-input-date
            [value]="view.filters.date?.from"
            (valueChange)="onDateChange($event, 'from', view.filters.date)"
          />
          <app-input-date
            [value]="view.filters.date?.to"
            (valueChange)="onDateChange($event, 'to', view.filters.date)"
          />
        </div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .item {
        max-width: 350px;
      }

      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .label {
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        &:first-child {
          margin-top: 0;
        }
      }

      .min-max {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      app-select-multiple {
        height: 200px;
        overflow: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent {
  view$: Observable<{
    filters: {
      payee?: FilterString;
      expense?: FilterNumber;
      category?: FilterList;
      subcategory?: FilterList;
      date?: FilterDate;
    };
    categories: string[];
    subcategories: string[];
  }>;

  constructor(private store: StoreService) {
    this.view$ = combineLatest([
      this.store.select('filterList'),
      this.store.getCategoryList(),
      this.store.getSubcategoryList(),
    ]).pipe(
      map(([filterList, categories, subcategories]) => {
        return {
          filters: {
            payee: filterList.payee,
            expense: filterList.expense,
            category: filterList.category,
            subcategory: filterList.subcategory,
            date: filterList.date,
          },
          categories,
          subcategories,
        };
      }),
    );
  }

  onPayeeChange(value: string | null) {
    const patch = value === null ? null : { value };
    this.store.setFilter('payee', patch);
  }

  onExpenseChange(
    value: number | null,
    target: 'min' | 'max',
    currentFilter?: FilterNumber,
  ) {
    const min = currentFilter?.min ?? null;
    const max = currentFilter?.max ?? null;

    if (target === 'min') {
      if (value === null && max === null)
        return this.store.setFilter('expense', null);
      return this.store.setFilter('expense', { min: value, max });
    }

    if (target === 'max') {
      if (value === null && min === null)
        return this.store.setFilter('expense', null);
      return this.store.setFilter('expense', { min, max: value });
    }
  }

  onCategoryChange(value: string[]) {
    const patch = value.length === 0 ? null : { values: value };
    this.store.setFilter('category', patch);
  }

  onSubcategoryChange(value: string[]) {
    const patch = value.length === 0 ? null : { values: value };
    this.store.setFilter('subcategory', patch);
  }

  onDateChange(
    value: number | null,
    target: 'from' | 'to',
    currentFilter?: FilterDate,
  ) {
    const from = currentFilter?.from ?? null;
    const to = currentFilter?.to ?? null;

    if (target === 'from') {
      if (value === null && to === null)
        return this.store.setFilter('date', null);
      return this.store.setFilter('date', { from: value, to });
    }

    if (target === 'to') {
      if (value === null && from === null)
        return this.store.setFilter('date', null);
      return this.store.setFilter('date', { from, to: value });
    }
  }
}
