import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="info">
      Currently only CSV files with the following header are supported:
    </div>

    <div class="csv-header">
      Split transaction, Date, Payee/Payer, Income, Expense, Category,
      Subcategory, Notes, Payment method
    </div>

    <div class="info">
      Date field must follow the format dd/MM/yyyy (e.g. 31/12/2021).
    </div>

    <div class="info">
      Any fields past the {{ headerFields.length }}th index will be ignored.
      Fields name are ignored, only the order matters.
    </div>
  `,
  styles: [
    `
      .csv-header {
        background-color: var(--disabled-color);
        padding: var(--spacing-1);
        border-radius: var(--radius-1);
        margin: 0 var(--spacing-2);
        user-select: unset;
      }

      .info {
        margin: var(--spacing-4) 0;
        &:first-child {
          margin-top: 0;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadInfoComponent {
  headerFields = [
    'Split transaction',
    'Date',
    'Payee/Payer',
    'Income',
    'Expense',
    'Category',
    'Subcategory',
    'Notes',
    'Payment method',
  ];
}
