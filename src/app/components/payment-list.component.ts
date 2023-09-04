import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoreService } from '../store.service';
import { Observable } from 'rxjs';
import { Payment } from '../app.types';

@Component({
  selector: 'app-payment-list',
  template: `
    <app-stats />
    <app-btn (click)="reset()"> Reset filters </app-btn>
    <ng-container *ngIf="paymentListFiltered$ | async as filtered">
      <div class="list-header">
        <div class="payee">
          <span>Payee</span>
          <app-filter-string field="payee" />
        </div>
        <div class="amount">
          <span>Amount</span>
          <app-filter-number field="expense" />
        </div>
        <div class="date">
          <span>Date</span>
          <app-filter-date />
        </div>
        <div class="category">
          <span>Category</span>
          <app-filter-list field="category" />
        </div>
        <div class="subcategory">
          <span>Subcategory</span>
          <app-filter-list field="subcategory" />
        </div>
      </div>
      <div class="payment-card" *ngFor="let p of filtered">
        <div class="payee">{{ p.payee }}</div>
        <div class="amount">{{ p.expense | currency: 'EUR' }}</div>
        <div class="date">{{ p.date | date: 'dd/MM/yyyy' }}</div>
        <div class="category">{{ p.category }}</div>
        <div class="subcategory">{{ p.subcategory }}</div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .list-header,
      .payment-card {
        display: flex;
        align-items: center;
        padding: var(--spacing-1);
        &:nth-child(odd) {
          background-color: var(--bg-color);
        }
      }

      .list-header {
        font-weight: bold;
        position: sticky;
        top: 0;
        border-bottom: 1px solid var(--border-color);
      }

      .list-header > div,
      .payment-card > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 var(--spacing-1);
      }

      .payee {
        min-width: 250px;
      }

      .amount,
      .date {
        min-width: 100px;
      }

      .category,
      .subcategory {
        min-width: 120px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentListComponent {
  paymentListFiltered$: Observable<Payment[]>;

  constructor(private store: StoreService) {
    this.paymentListFiltered$ = this.store.getFilteredPaymentList();
  }

  reset() {
    this.store.resetFilters();
  }
}
