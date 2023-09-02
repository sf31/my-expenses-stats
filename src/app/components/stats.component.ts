import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoreService } from '../store.service';
import { map, Observable, withLatestFrom } from 'rxjs';
import { Payment } from '../app.types';

type View = {
  total: Stats;
  filtered: Stats;
};

type Stats = {
  count: number;
  expense: number;
  income: number;
  uniquePayees: number;
  uniqueCategories: number;
};

@Component({
  selector: 'app-stats',
  template: `
    <ng-container *ngIf="view$ | async as view">
      <div class="stats">
        <div class="stat">
          <div class="label">Count</div>
          <div class="value">
            {{ view.filtered.count }} (of {{ view.total.count }})
          </div>
        </div>
        <div class="stat">
          <div class="label">Expense</div>
          <div class="value">
            {{ view.filtered.expense | currency: 'EUR' }} (of
            {{ view.total.expense | currency: 'EUR' }})
          </div>
        </div>
        <div class="stat">
          <div class="label">Income</div>
          <div class="value">
            {{ view.filtered.income | currency: 'EUR' }} (of
            {{ view.total.income | currency: 'EUR' }})
          </div>
        </div>
        <div class="stat">
          <div class="label">Unique payees</div>
          <div class="value">
            {{ view.filtered.uniquePayees }} (of {{ view.total.uniquePayees }})
          </div>
        </div>
        <div class="stat">
          <div class="label">Unique categories</div>
          <div class="value">
            {{ view.filtered.uniqueCategories }} (of
            {{ view.total.uniqueCategories }})
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .stats {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: var(--spacing-1);
        border-bottom: 1px solid var(--border-color);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
  view$: Observable<View>;

  constructor(private store: StoreService) {
    this.view$ = this.store.getFilteredPaymentList().pipe(
      withLatestFrom(this.store.select('paymentList')),
      map(([filteredPaymentList, paymentList]) => {
        const total = getStats(paymentList);
        const filtered = getStats(filteredPaymentList);
        return { total, filtered };
      }),
    );
  }
}

function getStats(paymentList: Payment[]): Stats {
  const count = paymentList.length;
  const expense = paymentList
    .filter((p) => p.expense)
    .reduce((acc, p) => acc + p.expense!, 0);
  const income = paymentList
    .filter((p) => !p.expense)
    .reduce((acc, p) => acc + p.income!, 0);
  const uniquePayees = new Set(paymentList.map((p) => p.payee)).size;
  const uniqueCategories = new Set(paymentList.map((p) => p.category)).size;
  return { count, expense, income, uniquePayees, uniqueCategories };
}
