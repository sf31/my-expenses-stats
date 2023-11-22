import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DateTime } from 'luxon';
import { StoreService } from '../store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-date',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-wrapper" *ngIf="filter$ | async as filter">
      <div class="filter-1">
        <div class="field">From</div>
        <input
          #dateFrom
          type="date"
          [value]="filter.fromStr"
          (input)="onDateChange(dateFrom, dateTo)"
        />
      </div>

      <div class="filter-2">
        <div class="field">To</div>
        <input
          #dateTo
          type="date"
          [value]="filter.toStr"
          (input)="onDateChange(dateFrom, dateTo)"
        />
      </div>
      <div class="filter-multi-reset" (click)="reset()">Reset</div>
    </div>
  `,
  styleUrls: ['./filter.styles.scss'],
  styles: [
    `
      .right {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-1);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-1);
        cursor: pointer;

        &:hover {
          background-color: var(--border-color);
        }
      }

      input {
        height: 35px;
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
        const fromStr = ''; // DateTime.fromSeconds(from).toFormat(fmt);
        const toStr = ''; //DateTime.fromSeconds(to).toFormat(fmt);
        return { fromStr, toStr, enabled: true };
      }),
    );
  }

  onDateChange(dateFrom: HTMLInputElement, dateTo: HTMLInputElement): void {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
    const from = DateTime.fromFormat(dateFrom.value, 'yyyy-MM-dd', {
      zone: 'UTC',
    });
    const to = DateTime.fromFormat(dateTo.value, 'yyyy-MM-dd', { zone: 'UTC' });
    if (!from.isValid || !to.isValid) return;
    const filter = { from: from.toUnixInteger(), to: to.toUnixInteger() };
    this.store.setFilter('date', filter);
  }

  reset(): void {
    this.store.setFilter('date', null);
  }
}
