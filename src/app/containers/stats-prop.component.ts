import { Component, Input } from '@angular/core';
import { Stat } from '../utils/app.types';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../components/card.component';

@Component({
  selector: 'app-stats-prop',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card *ngIf="stat">
      <div class="row">
        <div class="label">{{ label }}</div>
        <div class="value">{{ stat.topByExpenseSum.name }}</div>
      </div>

      <div class="row">
        <div class="label">Payments</div>
        <div class="value">{{ stat.topByExpenseSum.paymentCount }}</div>
      </div>

      <div class="row">
        <div class="label">Sum</div>
        <div class="value">
          {{ stat.topByExpenseSum.expenseSum | currency: 'EUR' }}
        </div>
      </div>

      <div class="row">
        <div class="label">Average</div>
        <div class="value">
          {{ stat.topByExpenseSum.expenseAvg | currency: 'EUR' }}
        </div>
      </div>
    </app-card>

    <ng-container *ngIf="value">
      <div class="row">
        <div class="label ">{{ label }}</div>
        <div class="value" *ngIf="currency">
          {{ value | currency: 'EUR' }}
        </div>
        <div class="value" *ngIf="!currency">{{ value }}</div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .row {
        display: flex;
        justify-content: space-between;
        padding: var(--spacing-1);
        border-bottom: 1px solid var(--border-color);
      }

      .label {
        font-weight: bold;
      }
    `,
  ],
})
export class StatPropsComponent {
  @Input() label?: string;
  @Input() stat?: Stat | (Stat & { unique: number });
  @Input() value?: string | number;
  @Input() currency?: boolean;
}
