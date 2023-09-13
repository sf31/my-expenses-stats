import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoreService } from '../store.service';
import { Observable } from 'rxjs';
import { Payment } from '../app.types';

@Component({
  selector: 'app-payment-list',
  template: `
    <app-stats />

    <div class="list-header">
      <div class="payee">Payee</div>
      <div class="amount">Amount</div>
      <div class="date">Date</div>
      <div class="category">Category</div>
      <div class="subcategory">Subcategory</div>
    </div>

    <ng-container *ngIf="paymentListFiltered$ | async as paymentListFiltered">
      <div class="payment-card" *ngFor="let p of paymentListFiltered">
        <div class="payee">{{ p.payee }}</div>
        <div class="amount">{{ p.expense | currency: 'EUR' }}</div>
        <div class="date">
          {{ p.date * 1000 | date: 'dd/MM/yyyy' : 'UTC' }}
        </div>
        <div class="category">{{ p.category }}</div>
        <div class="subcategory">{{ p.subcategory }}</div>
      </div>

      <div class="no-data" *ngIf="paymentListFiltered.length === 0">
        Mmmh... Seems like there is no data to show.
        <app-btn routerLink="/upload"> Upload your data! </app-btn>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .table {
        overflow: auto;
        display: grid;
      }

      .list-header,
      .payment-card {
        display: flex;
        align-items: center;
        padding: var(--spacing-1);
        &:nth-child(odd) {
          background-color: var(--border-color);
        }
      }

      .list-header {
        font-weight: bold;
        position: sticky;
        top: 0;
        background-color: var(--disabled-color) !important;
      }

      .list-header > div,
      .payment-card > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 var(--spacing-1);
      }

      .list-header > div {
        border-right: 1px solid var(--disabled-color);
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

      .no-data {
        margin-top: var(--spacing-5);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-2);
        color: var(--accent-color);
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

  protected readonly window = window;
}
