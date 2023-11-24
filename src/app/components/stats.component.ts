import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoreService } from '../store.service';
import { map, Observable, withLatestFrom } from 'rxjs';
import { Payment } from '../utils/app.types';
import { CommonModule } from '@angular/common';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import {
  faBarsStaggered,
  faEuroSign,
  faTags,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

type Stats = {
  count: number;
  expense: number;
  income: number;
  uniquePayees: number;
  uniqueCategories: number;
};

type Stat = {
  label: string;
  value: number;
  filteredValue: number;
  icon: IconDefinition;
};

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <ng-container *ngFor="let s of statList$ | async">
      <div class="stat">
        <div class="left">
          <fa-icon [icon]="s.icon" />
        </div>
        <div class="right">
          <div class="label">{{ s.label }}</div>
          <div class="value-filtered">
            {{
              s.label === 'Expense'
                ? (s.filteredValue | number: '1.2-2')
                : s.filteredValue
            }}
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 2rem;
      }

      .stat {
        display: grid;
        grid-template-columns: 60px 1fr;
        gap: 1rem;
      }

      .left {
        text-align: center;
      }

      fa-icon {
        font-size: 2.5rem;
      }

      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 0.5rem;
      }

      .label {
        font-size: 0.8rem;
      }

      .value-filtered {
        font-size: 1.2rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
  statList$: Observable<Stat[]>;

  constructor(private store: StoreService) {
    this.statList$ = this.store.getFilteredPaymentList().pipe(
      withLatestFrom(this.store.select('paymentList')),
      map(([filteredPaymentList, paymentList]) => {
        const total = getStats(paymentList);
        const filtered = getStats(filteredPaymentList);
        return [
          {
            label: 'Payments',
            value: total.count,
            filteredValue: filtered.count,
            icon: faBarsStaggered,
          },
          {
            label: 'Expense',
            value: total.expense,
            filteredValue: filtered.expense,
            icon: faEuroSign,
          },
          {
            label: 'Payees',
            value: total.uniquePayees,
            filteredValue: filtered.uniquePayees,
            icon: faUserFriends,
          },
          {
            label: 'Categories',
            value: total.uniqueCategories,
            filteredValue: filtered.uniqueCategories,
            icon: faTags,
          },
        ];
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
