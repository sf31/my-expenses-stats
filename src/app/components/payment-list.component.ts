import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoreService } from '../store.service';
import { Observable } from 'rxjs';
import { Payment } from '../types/Payment';

@Component({
  selector: 'app-payment-list',
  template: `
    <div class="payment-card" *ngFor="let p of paymentList$ | async">
      <div class="payee">{{ p.payee }}</div>
      <div class="amount">{{ p.expense }}</div>
      <div class="date">{{ p.date | date: 'dd/MM/yyyy' }}</div>
    </div>
  `,
  styles: [
    `
      .payment-card {
        display: flex;
        align-items: center;
        border-radius: var(--radius-1);
        border: 1px solid var(--border-color);
        padding: var(--spacing-2);
        margin: var(--spacing-1);
      }

      .payee {
        min-width: 300px;
      }

      .amount {
        min-width: 100px;
      }

      .date {
        min-width: 100px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentListComponent {
  paymentList$: Observable<Payment[]> = this.store.select('paymentList');
  constructor(private store: StoreService) {}
}
