import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as papa from 'papaparse';
import { ParseResult } from 'papaparse';
import * as uuid from 'uuid';
import { DateTime } from 'luxon';
import { notNullOrUndefined } from '../utils/utils';
import { StoreService } from '../store.service';
import { Payment } from '../app.types';

@Component({
  selector: 'app-upload-csv',
  template: `
    <app-btn (click)="input.click()"> Load CSV </app-btn>
    <input #input type="file" (change)="onFileSelected($event)" />
  `,
  styles: [
    `
      input {
        display: none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadCsvComponent {
  constructor(private store: StoreService) {}

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    papa.parse(file, {
      complete: (result: ParseResult<string[]>) => {
        if (result.errors.length > 0) return;
        const paymentList = result.data
          .slice(1)
          .map(parseRow)
          .filter(notNullOrUndefined);
        this.store.setPaymentList(paymentList);
      },
    });
  }
}

/**
 * Example header (index below):
 * "Split transaction";"Date";"Payee/Payer";"Income";"Expense";"Category";"Subcategory";"Notes";"Payment method";"Status";"Reference Number";"Picture";"Tags";
 *         0             1       2             3         4         5           6           7            8            9             10            11      12
 */

function parseRow(row: unknown[]): Payment | null {
  try {
    return {
      id: uuid.v4(),
      // date: parseDate(row[1]),
      date: parseDateToUnix(row[1]),
      payee: parseString(row[2]),
      income: parseNumber(row[3]),
      expense: parseNumber(row[4]),
      category: parseString(row[5]),
      subcategory: parseString(row[6]),
      notes: parseString(row[7]),
      paymentMethod: parseString(row[8]),
    };
  } catch (e) {
    return null;
  }
}

function parseDate(dateStr: unknown, format: string = 'dd/MM/yyyy'): Date {
  if (typeof dateStr !== 'string')
    throw new Error(`Expected string, got ${typeof dateStr}`);
  return DateTime.fromFormat(dateStr, format).toJSDate();
}

export function parseDateToUnix(
  dateStr: unknown,
  format: string = 'dd/MM/yyyy',
): number {
  if (typeof dateStr !== 'string')
    throw new Error(`Expected string, got ${typeof dateStr}`);
  return DateTime.fromFormat(dateStr, format, { zone: 'UTC' })
    .startOf('day')
    .toUnixInteger();
}

function parseNumber(numStr: unknown): number {
  const num = parseFloat(numStr as string);
  if (isNaN(num)) throw new Error(`Expected number, got ${typeof numStr}`);
  return num;
}

function parseString(str: unknown): string {
  if (typeof str !== 'string')
    throw new Error(`Expected string, got ${typeof str}`);
  return str;
}
