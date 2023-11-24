import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadCsvComponent } from './upload-csv.component';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-upload-dialog-csv',
  standalone: true,
  imports: [CommonModule, UploadCsvComponent],
  template: `
    <div class="upload-dialog-csv-wrapper">
      <app-upload-csv (paymentImported)="onPaymentImported()" />
    </div>
  `,
  styles: [
    `
      .upload-dialog-csv-wrapper {
        background-color: var(--bg-color);
        max-height: 80dvh;
        overflow: auto;
        max-width: 60dvw;
        padding: var(--spacing-3);
        border-radius: var(--radius-1);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadCsvDialogComponent {
  constructor(private dialogRef: DialogRef<UploadCsvDialogComponent>) {}

  onPaymentImported(): void {
    this.dialogRef.close();
  }
}
