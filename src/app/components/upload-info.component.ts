import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-upload-info',
  template: `
    <div class="info">
      Currently only CSV files with the following header are supported:
    </div>
    <!--    <div class="csv-header" *ngFor="let h of headerFields; let i = index">-->
    <!--      <div class="field">{{ h }}</div>-->
    <!--      <div class="index">{{ i }}</div>-->
    <!--    </div>-->

    <div class="csv-header2">
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
        display: grid;
        grid-template-columns: 160px auto;
        margin: var(--spacing-1) 0;
      }

      .csv-header2 {
        background-color: var(--disabled-color);
        padding: var(--spacing-1);
        border-radius: var(--radius-1);
        margin: 0 var(--spacing-2);
        user-select: unset;
      }

      .info {
        margin: var(--spacing-4) 0;
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
