import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoreService } from '../store.service';
import { map, Observable } from 'rxjs';
import {
  HistoryChartData,
  Payment,
  PaymentStats,
  StatProps,
} from '../utils/app.types';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { splitByPeriod } from '../utils/chart.utils';
import { DateTime } from 'luxon';
import { StatPropsComponent } from './stats-prop.component';
import { CardComponent } from '../components/card.component';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, StatPropsComponent, CardComponent],
  template: `
    <!--    <div class="title">Stats</div>-->
    <div class="stats-list" *ngIf="paymentStat$ | async as s">
      <app-card>
        <app-stats-prop
          label="Total expense"
          [value]="s.totalExpense"
          [currency]="true"
        />
        <app-stats-prop label="Total payments" [value]="s.totalPayment" />
        <app-stats-prop label="Payees" [value]="s.payee.unique" />
        <app-stats-prop label="Categories" [value]="s.category.unique" />
      </app-card>

      <app-card>
        <app-stats-prop
          label="Day Average"
          [value]="s.avg.day"
          [currency]="true"
        />
        <app-stats-prop
          label="Week Average"
          [value]="s.avg.week"
          [currency]="true"
        />
        <app-stats-prop
          label="Month Average"
          [value]="s.avg.month"
          [currency]="true"
        />
        <app-stats-prop
          label="Year Average"
          [value]="s.avg.year"
          [currency]="true"
        />
      </app-card>

      <app-stats-prop label="Top payee" [statProps]="s.payee.top" />
      <app-stats-prop label="Top Category" [statProps]="s.category.top" />
      <app-stats-prop label="Top Subcat." [statProps]="s.subcategory.top" />

      <app-stats-prop label="Top day" [statProps]="s.day" />
      <app-stats-prop label="Top week" [statProps]="s.week" />
      <app-stats-prop label="Top month" [statProps]="s.month" />
      <app-stats-prop label="Top year" [statProps]="s.year" />
    </div>
  `,
  styles: [
    `
      .stats-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        grid-gap: var(--spacing-3);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
  paymentStat$: Observable<PaymentStats>;

  constructor(private store: StoreService) {
    this.paymentStat$ = this.store
      .getFilteredPaymentList()
      .pipe(map(getStats2));
  }
}

function getStats2(paymentList: Payment[]): PaymentStats {
  let expenseSum = 0;
  let minDate = Infinity;
  let maxDate = -Infinity;
  let payee: { [k: string]: Payment[] } = {};
  let category: { [k: string]: Payment[] } = {};
  let subcategory: { [k: string]: Payment[] } = {};

  for (let i = 0; i < paymentList.length; i++) {
    const p = paymentList[i];
    expenseSum += p.expense;
    minDate = Math.min(minDate, p.date);
    maxDate = Math.max(maxDate, p.date);
    payee[p.payee] = [...(payee[p.payee] ?? []), p];
    category[p.category] = [...(category[p.category] ?? []), p];
    subcategory[p.subcategory] = [...(subcategory[p.subcategory] ?? []), p];
  }

  const byDate: HistoryChartData = splitByPeriod(paymentList);
  const zone = 'UTC';
  const dayStart = DateTime.fromSeconds(minDate, { zone }).startOf('day');
  const dayEnd = DateTime.fromSeconds(maxDate, { zone }).endOf('day');
  const dayCount = dayEnd.diff(dayStart, 'days').days;
  const weekCount = dayEnd.diff(dayStart, 'weeks').weeks;
  const monthCount = dayEnd.diff(dayStart, 'months').months;
  const yearCount = dayEnd.diff(dayStart, 'years').years;

  const dayStatProps = getStatProps(byDate.daily);
  const weekStatProps = getStatProps(byDate.weekly);
  const monthStatProps = getStatProps(byDate.monthly);
  const yearStatProps = getStatProps(byDate.yearly);

  return {
    totalExpense: expenseSum,
    totalPayment: paymentList.length,
    payee: {
      unique: Object.keys(payee).length,
      top: getStatProps(payee),
    },
    category: {
      unique: Object.keys(category).length,
      top: getStatProps(category),
    },
    subcategory: {
      unique: Object.keys(subcategory).length,
      top: getStatProps(subcategory),
    },
    day: { ...dayStatProps, name: formatDate(+dayStatProps.name, 'day') },
    week: { ...weekStatProps, name: formatDate(+weekStatProps.name, 'week') },
    month: {
      ...monthStatProps,
      name: formatDate(+monthStatProps.name, 'month'),
    },
    year: { ...yearStatProps, name: formatDate(+yearStatProps.name, 'year') },
    avg: {
      from: formatDate(minDate, 'day'),
      to: formatDate(maxDate, 'day'),
      day: expenseSum / dayCount,
      week: expenseSum / weekCount,
      month: expenseSum / monthCount,
      year: expenseSum / yearCount,
    },
  };
}

function getKeyWithMostPayments(map: {
  [k: string | number]: Payment[];
}): string {
  let topKey = '';
  let topCount = 0;
  for (const [key, pList] of Object.entries(map)) {
    if (pList.length > topCount) {
      topKey = key;
      topCount = pList.length;
    }
  }
  return topKey.toString();
}

function getStatProps(map: { [k: string | number]: Payment[] }): StatProps {
  const topKey = getKeyWithMostPayments(map);
  const pList = map[topKey] ?? [];
  const expenseSum = pList.reduce((acc, p) => acc + p.expense, 0);
  return {
    name: topKey,
    paymentCount: pList.length,
    expenseSum,
    expenseAvg: expenseSum / pList.length,
  };
}

function formatDate(
  unix: number,
  type: 'day' | 'week' | 'month' | 'year',
): string {
  const dt = DateTime.fromSeconds(unix, { zone: 'utc' });
  if (type === 'day') return dt.toFormat('dd LLL yyyy');
  if (type === 'week')
    return `${dt.toFormat('dd')}-${dt.endOf('week').toFormat('dd LLL yyyy')}`;
  if (type === 'month') return dt.toFormat('LLL yyyy');
  if (type === 'year') return dt.toFormat('yyyy');
  return 'UNKNOWN';
}
