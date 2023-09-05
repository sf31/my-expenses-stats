import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoreService } from '../store.service';
import { Observable } from 'rxjs';
import { Payment } from '../app.types';

@Component({
  selector: 'app-payment-list',
  template: `
    <div class="payment-list-wrapper">
      <div class="row">
        <app-stats />
        <app-btn (click)="reset()"> Reset filters </app-btn>
      </div>

      <div class="table" *ngIf="paymentListFiltered$ | async as filtered">
        <div class="list-header">
          <div class="payee">
            <span>Payee</span>
            <app-filter-dropdown field="payee">
              <app-filter-string field="payee" />
            </app-filter-dropdown>
          </div>
          <div class="amount">
            <span>Amount</span>
            <app-filter-dropdown field="expense">
              <app-filter-number field="expense" />
            </app-filter-dropdown>
          </div>
          <div class="date">
            <span>Date</span>
            <app-filter-dropdown field="date">
              <app-filter-date />
            </app-filter-dropdown>
          </div>
          <div class="category">
            <span>Category</span>
            <app-filter-dropdown field="category">
              <app-filter-list field="category" />
            </app-filter-dropdown>
          </div>
          <div class="subcategory">
            <span>Subcategory</span>
            <app-filter-dropdown field="subcategory">
              <app-filter-list field="subcategory" />
            </app-filter-dropdown>
          </div>
        </div>
        <div class="payment-card" *ngFor="let p of filtered">
          <div class="payee">{{ p.payee }}</div>
          <div class="amount">{{ p.expense | currency: 'EUR' }}</div>
          <div class="date">
            {{ p.date * 1000 | date: 'dd/MM/yyyy' : 'UTC' }}
          </div>
          <div class="category">{{ p.category }}</div>
          <div class="subcategory">{{ p.subcategory }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .payment-list-wrapper {
        display: grid;
        grid-template-rows: auto 1fr;
      }

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
