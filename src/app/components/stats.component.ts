import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoreService } from '../store.service';
import { map, Observable, withLatestFrom } from 'rxjs';
import { Payment } from '../utils/app.types';
import { CommonModule } from '@angular/common';

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
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="view$ | async as view">
      <div class="stats">
        <div>
          <div class="labell">Payments count</div>
          <div class="valuel">
            {{ view.filtered.count }} (of {{ view.total.count }})
          </div>
        </div>

        <div class="stat">
          <div class="label">Payments count</div>
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
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
        grid-gap: var(--spacing-2);
        justify-items: center;
        padding: var(--spacing-2);
      }

      .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 250px;
        padding: var(--spacing-1);
      }

      .stat .label {
        font-weight: bold;
        margin-bottom: var(--spacing-1);
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
