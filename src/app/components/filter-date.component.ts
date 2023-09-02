import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { StoreService } from '../store.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-filter-date',
  template: `
    <app-filter-icon
      [cdkMenuTriggerFor]="menu"
      [enabled]="(isFilterEnabled$ | async) ?? false"
    />

    <ng-template #menu>
      <div class="date-filter" cdkMenu *ngIf="dateRange$ | async as dateRange">
        <div class="filter">
          <div class="field">From</div>
          <input
            #dateFrom
            type="date"
            [value]="dateRange.fromStr"
            (input)="onDateChange(dateFrom, dateTo)"
          />
        </div>

        <div class="filter">
          <div class="field">To</div>
          <input
            #dateTo
            type="date"
            [value]="dateRange.toStr"
            (input)="onDateChange(dateFrom, dateTo)"
          />
        </div>

        <app-btn (click)="reset()"> Reset </app-btn>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .date-filter {
        background-color: var(--bg-color);
      }

      .filter {
        display: flex;
        align-items: center;
      }

      .field {
        min-width: 50px;
      }

      input {
        padding: var(--spacing-1);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDateComponent {
  dateRange$: Observable<{ fromStr: string; toStr: string }>;
  isFilterEnabled$: Observable<boolean>;

  constructor(private store: StoreService) {
    this.isFilterEnabled$ = this.store
      .select('filterList')
      .pipe(map((filterList) => !!filterList.date));

    this.dateRange$ = this.store.select('filterList').pipe(
      map((filterList) => {
        if (!filterList.date) return { fromStr: '', toStr: '' };
        const fmt = 'yyyy-MM-dd';
        const { from, to } = filterList.date;
        const fromStr = DateTime.fromJSDate(from).toFormat(fmt);
        const toStr = DateTime.fromJSDate(to).toFormat(fmt);
        return { fromStr, toStr };
      }),
    );
  }

  onDateChange(dateFrom: HTMLInputElement, dateTo: HTMLInputElement): void {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
    const from = DateTime.fromFormat(dateFrom.value, 'yyyy-MM-dd');
    const to = DateTime.fromFormat(dateTo.value, 'yyyy-MM-dd');
    if (!from.isValid || !to.isValid) return;
    const filter = { from: from.toJSDate(), to: to.toJSDate() };
    this.store.addFilter('date', filter);
  }

  reset(): void {
    this.store.removeFilter('date');
  }
}
