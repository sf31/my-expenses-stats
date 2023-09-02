import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoreService } from '../store.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { State } from '../types/State';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-filter',
  template: `
    <div class="filter-wrapper" *ngIf="filterList$ | async as view">
      <app-btn (click)="reset()"> Reset </app-btn>

      <div class="date-filter" *ngIf="dateRange$ | async as dateRange">
        <div class="filter">
          <div class="field">Date from</div>
          <input
            #dateFrom
            type="date"
            [value]="dateRange.fromStr"
            (input)="onDateChange(dateFrom, dateTo)"
          />
        </div>

        <div class="filter">
          <div class="field">Date to</div>
          <input
            #dateTo
            type="date"
            [value]="dateRange.toStr"
            (input)="onDateChange(dateFrom, dateTo)"
          />
        </div>
      </div>

      <div class="filter">
        <div class="field">Payee</div>
        <input
          type="text"
          [value]="view.payee?.value || ''"
          (input)="onFilterStringChange($event, 'payee')"
        />
      </div>

      <div class="filter">
        <div class="field">Expense</div>
        <input type="number" [value]="view['expense'] || ''" />
      </div>
    </div>
  `,
  styles: [
    `
      .filter-wrapper,
      .date-filter {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  filterList$: Observable<State['filterList']>;
  dateRange$: BehaviorSubject<{ fromStr: string; toStr: string }>;
  categories$: Observable<string[]>;
  subcategories$: Observable<string[]>;

  constructor(private store: StoreService) {
    this.dateRange$ = new BehaviorSubject({ fromStr: '', toStr: '' });
    this.categories$ = this.store.getCategoryList();
    this.subcategories$ = this.store.getSubcategoryList();
    this.filterList$ = this.store.select('filterList').pipe(
      tap((filterList) => {
        if (filterList.date) {
          const fromStr = DateTime.fromJSDate(filterList.date.from).toFormat(
            'yyyy-MM-dd',
          );
          const toStr = DateTime.fromJSDate(filterList.date.to).toFormat(
            'yyyy-MM-dd',
          );
          this.dateRange$.next({ fromStr, toStr });
        }
      }),
    );
  }

  reset(): void {
    this.store.resetFilter();
  }

  onFilterStringChange(event: Event, field: 'payee' | 'notes'): void {
    const target = event.target as HTMLInputElement;
    // const filter: FilterString = { value: target.value };
    // this.store.addFilter(field, filter);
  }

  onDateChange(dateFrom: HTMLInputElement, dateTo: HTMLInputElement): void {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
    console.log(dateFrom.value, dateTo.value);
    const from = DateTime.fromFormat(dateFrom.value, 'yyyy-MM-dd');
    const to = DateTime.fromFormat(dateTo.value, 'yyyy-MM-dd');
    if (!from.isValid || !to.isValid) return;
    console.log(from, to);
    const filter = { from: from.toJSDate(), to: to.toJSDate() };
    // this.store.addFilter('date', filter);
  }

  // onFilterNumberChange(event: Event, field: 'expense' | 'income'): void {
  // const target = event.target as HTMLInputElement;
  // const value = parseFloat(target.value);
  // if (isNaN(value)) return;
  // const filter: PaymentFilter = {
  //     type: 'number',
  //     field,
  //     value
  // }
  // this.store.addFilter(filter);
  // }
}
