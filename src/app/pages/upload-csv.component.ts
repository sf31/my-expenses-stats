import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as papa from 'papaparse';
import { ParseError, ParseResult } from 'papaparse';
import * as uuid from 'uuid';
import { DateTime } from 'luxon';
import { notNullOrUndefined } from '../utils/utils';
import { StoreService } from '../store.service';
import { Payment } from '../app.types';
import { BehaviorSubject } from 'rxjs';
import {
  faCheckCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { UploadInfoComponent } from '../components/upload-info.component';
import { DndComponent } from '../components/dnd.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BtnComponent } from '../shared/btn.component';
import { RouterLink } from '@angular/router';

type UploadCsvView = {
  parsedFiles: ParsedFile[];
  totalPayments: Payment[];
};

type ParsedFile = {
  filename: string;
  paymentList: Payment[];
  parseError: ParseError[] | null;
};

@Component({
  selector: 'app-upload-csv',
  standalone: true,
  imports: [
    CommonModule,
    UploadInfoComponent,
    DndComponent,
    FontAwesomeModule,
    BtnComponent,
    RouterLink,
  ],
  template: `
    <div class="upload-csv-wrapper">
      <div class="upload-csv-wrapper-inner">
        <app-upload-info />
        <div class="dnd-wrapper">
          <app-dnd (filesDrop)="onFilesSelected($event)" />
        </div>

        <ng-container *ngIf="view$ | async as view">
          <div class="parsed-file" *ngFor="let p of view.parsedFiles">
            <div class="row">
              <div class="status">
                <fa-icon [icon]="iconSuccess" *ngIf="p.parseError === null" />
                <fa-icon [icon]="iconError" *ngIf="p.parseError !== null" />
              </div>
              <div class="filename">{{ p.filename }}</div>
              <div class="payment-count">
                ({{ p.paymentList.length }} payments)
              </div>
            </div>
            <div class="parse-error" *ngIf="p.parseError">
              <div class="error" *ngFor="let e of p.parseError">
                <div>Error found at row: {{ e.row }}</div>
                <div class="error-type">Type: {{ e.type }}</div>
                <div class="error-code">Code: {{ e.code }}</div>
                <div class="error-message">Description: {{ e.message }}</div>
              </div>
            </div>
          </div>

          <div class="actions" *ngIf="view.totalPayments.length > 0">
            <app-btn (click)="addPayment(view.totalPayments, 'replace')">
              REPLACE current data</app-btn
            >
            <app-btn (click)="addPayment(view.totalPayments, 'append')">
              APPEND to current data</app-btn
            >
          </div>
          <div *ngIf="dataUploaded" class="data-uploaded">
            Data uploaded successfully!
            <app-btn routerLink="/">Go to payment list</app-btn>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      .upload-csv-wrapper {
        padding: var(--spacing-3);
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .upload-csv-wrapper-inner {
        max-width: 800px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .dnd-wrapper {
        margin: var(--spacing-5) 0;
      }

      .parsed-file {
        border: 1px solid var(--border-color);
        border-radius: var(--radius-1);
        width: 100%;
        margin: var(--spacing-1) 0;
      }

      .row {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
        padding: var(--spacing-2);
      }

      .payment-count {
        white-space: nowrap;
      }

      .parse-error {
        margin-left: 40px;
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: var(--spacing-2);
        padding: var(--spacing-2) 0;
        max-height: 200px;
        overflow: auto;
      }

      .actions {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
        margin-top: var(--spacing-5);
      }

      .actions > app-btn {
        flex: 1;
        max-width: 200px;
      }

      .data-uploaded {
        margin-top: var(--spacing-5);
        color: var(--success-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-4);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadCsvComponent {
  view$ = new BehaviorSubject<UploadCsvView>({
    parsedFiles: [],
    totalPayments: [],
  });
  iconSuccess = faCheckCircle;
  iconError = faExclamationCircle;
  dataUploaded = false;

  constructor(private store: StoreService) {}

  private patch(partial: Partial<UploadCsvView>) {
    this.view$.next({ ...this.view$.value, ...partial });
  }

  async onFilesSelected(files: File[]): Promise<void> {
    this.dataUploaded = false;
    const parsedFiles = await Promise.all(files.map(parseFile));
    const totalPayments = parsedFiles.map((pf) => pf.paymentList).flat();
    this.patch({ parsedFiles, totalPayments });
  }

  addPayment(payments: Payment[], mode: 'replace' | 'append') {
    this.store.addPaymentList(payments, mode);
    this.patch({ parsedFiles: [], totalPayments: [] });
    this.dataUploaded = true;
  }
}

async function parseFile(file: File): Promise<ParsedFile> {
  const filename = file.name;
  return new Promise((resolve) => {
    papa.parse(file, {
      complete: (result: ParseResult<string[]>) => {
        if (result.errors.length === 0) {
          const paymentList = result.data
            .slice(1)
            .map(parseRow)
            .filter(notNullOrUndefined);
          resolve({ filename, paymentList, parseError: null });
        } else {
          resolve({ filename, paymentList: [], parseError: result.errors });
        }
      },
    });
  });
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
