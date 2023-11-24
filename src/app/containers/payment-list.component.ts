import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoreService } from '../store.service';
import { map, Observable, withLatestFrom } from 'rxjs';
import { Payment } from '../utils/app.types';
import { CommonModule } from '@angular/common';
import { BtnComponent } from '../components/btn.component';
import { RouterLink } from '@angular/router';
import { NoDataComponent } from '../components/no-data.component';
import { StatsComponent } from '../components/stats.component';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [
    CommonModule,
    StatsComponent,
    BtnComponent,
    RouterLink,
    NoDataComponent,
  ],
  template: `
    <ng-container *ngIf="view$ | async as view">
      <app-no-data class="no-data" *ngIf="view.paymentList.length === 0" />

      <ng-container *ngIf="view.paymentList.length > 0">
        <div class="header">
          <div class="title">Table</div>
          <div class="desc">
            {{ view.paymentListFiltered.length }} Payments
            <span
              *ngIf="
                view.paymentList.length !== view.paymentListFiltered.length
              "
            >
              (out of {{ view.paymentList.length }})
            </span>
          </div>
        </div>
        <div class="table">
          <div class="list-header">
            <div class="date">Date</div>
            <div class="amount">Amount</div>
            <div class="payee">Payee</div>
            <div class="category">Category</div>
            <div class="subcategory">Subcategory</div>
          </div>

          <div class="payment-card" *ngFor="let p of view.paymentListFiltered">
            <div class="date">
              {{ p.date * 1000 | date: 'dd LLL  yyyy' : 'UTC' }}
            </div>
            <div class="amount">€ {{ p.expense | number: '1.2-2' }}</div>
            <div class="payee">{{ p.payee }}</div>
            <div class="category">{{ p.category }}</div>
            <div class="subcategory">{{ p.subcategory }}</div>
          </div>
        </div>

        <div class="no-data" *ngIf="view.paymentListFiltered.length === 0">
          No data matching the filters.
        </div>
      </ng-container>
    </ng-container>
  `,
  styles: [
    `
      .header {
        display: flex;
        align-items: baseline;
        margin-bottom: var(--spacing-3);
        justify-content: space-between;
      }
      .table {
        //overflow: auto;
        display: grid;
        //gap: 1rem;
      }

      .list-header {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        border-left: 1px solid var(--border-color);
        border-right: 1px solid var(--border-color);
        border-top-left-radius: var(--radius-1);
        border-top-right-radius: var(--radius-1);

        &:nth-child(odd) {
          background-color: var(--border-color);
        }
      }

      //.payment-card {
      //  display: flex;
      //  background-color: var(--bg-color);
      //  padding: 0.5rem;
      //  border-radius: var(--radius-1);
      //  &:hover {
      //    background-color: #5d5d5d;
      //  }
      //}

      .payment-card {
        display: flex;
        background-color: #3b3b3b;
        padding: 0.5rem;

        &:nth-child(odd) {
          background-color: #424242;
        }

        &:hover {
          background-color: #5d5d5d;
        }
      }

      .list-header {
        font-weight: bold;
        //position: sticky;
        top: 0;
        background-color: var(--primary-color) !important;
      }

      .list-header > div,
      .payment-card > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .payee {
        min-width: 250px;
      }

      .date,
      .amount {
        min-width: 120px;
      }

      .category,
      .subcategory {
        min-width: 150px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentListComponent {
  view$: Observable<{
    paymentListFiltered: Payment[];
    paymentList: Payment[];
  }>;
  paymentListFiltered$: Observable<Payment[]>;
  noPaymentList$: Observable<boolean>;

  constructor(private store: StoreService) {
    this.view$ = this.store.getFilteredPaymentList().pipe(
      withLatestFrom(this.store.select('paymentList')),
      map(([paymentListFiltered, paymentList]) => ({
        paymentListFiltered,
        paymentList,
      })),
    );
    this.paymentListFiltered$ = this.store.getFilteredPaymentList();
    this.noPaymentList$ = this.store
      .select('paymentList')
      .pipe(map((paymentList) => paymentList.length === 0));
  }
}
