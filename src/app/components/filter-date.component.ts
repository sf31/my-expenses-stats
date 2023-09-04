import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DateTime } from 'luxon';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-filter-date',
  template: `
    <ng-container *ngIf="filter$ | async as filter">
      <app-filter-icon [cdkMenuTriggerFor]="menu" [enabled]="filter.enabled" />

      <ng-template #menu>
        <div class="date-filter" cdkMenu>
          <div class="filter">
            <div class="field">From</div>
            <input
              #dateFrom
              type="date"
              [value]="filter.fromStr"
              (input)="onDateChange(dateFrom, dateTo)"
            />
          </div>

          <div class="filter">
            <div class="field">To</div>
            <input
              #dateTo
              type="date"
              [value]="filter.toStr"
              (input)="onDateChange(dateFrom, dateTo)"
            />
          </div>

          <app-btn (click)="reset()"> Reset </app-btn>
        </div>
      </ng-template>
    </ng-container>
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
  filter$: Observable<{ fromStr: string; toStr: string; enabled: boolean }>;

  constructor(private store: StoreService) {
    this.filter$ = this.store.selectFilter('date').pipe(
      map((filterList) => {
        if (!filterList) return { fromStr: '', toStr: '', enabled: false };
        const fmt = 'yyyy-MM-dd';
        const { from, to } = filterList;
        const fromStr = DateTime.fromJSDate(from).toFormat(fmt);
        const toStr = DateTime.fromJSDate(to).toFormat(fmt);
        return { fromStr, toStr, enabled: true };
      }),
    );
  }

  onDateChange(dateFrom: HTMLInputElement, dateTo: HTMLInputElement): void {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
    const from = DateTime.fromFormat(dateFrom.value, 'yyyy-MM-dd');
    const to = DateTime.fromFormat(dateTo.value, 'yyyy-MM-dd');
    if (!from.isValid || !to.isValid) return;
    const filter = { from: from.toJSDate(), to: to.toJSDate() };
    this.store.setFilter('date', filter);
  }

  reset(): void {
    this.store.setFilter('date', null);
  }
}
