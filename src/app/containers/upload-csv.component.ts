import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import * as papa from 'papaparse';
import { ParseError, ParseResult } from 'papaparse';
import * as uuid from 'uuid';
import { DateTime } from 'luxon';
import { StoreService } from '../store.service';
import { Payment } from '../utils/app.types';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  faCheckCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { UploadInfoComponent } from '../components/upload-info.component';
import { DndComponent } from '../components/dnd.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BtnComponent } from '../components/btn.component';
import { RouterLink } from '@angular/router';

type UploadCsvView = {
  parsedFiles: ParsedFile[];
  totalPayments: Payment[];
};

type ParsedFile = {
  filename: string;
  paymentList: Payment[];
  parseResult:
    | { status: 'success' }
    | { status: 'error'; error: ParseError[] }
    | { status: 'partialParse'; errorRows: string[][]; fileRowsCount: number }
    | { status: 'emptyFile' };
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
    <ng-container *ngIf="view$ | async as view">
      <div class="step1" *ngIf="view.parsedFiles.length === 0">
        <app-upload-info />
        <app-dnd
          [isMobile]="(isMobile$ | async) ?? false"
          (filesDrop)="onFilesSelected($event)"
        />
      </div>

      <div class="import-result" *ngIf="view.parsedFiles.length > 0">
        <div class="import-result-header">
          <div class="title">Import results</div>
          <div class="clear" (click)="clearAll()">Clear all</div>
        </div>
        <div class="parsed-file" *ngFor="let p of view.parsedFiles">
          <div class="file-desc" *ngIf="p.parseResult.status as status">
            <fa-icon
              [class.icon-success]="status === 'success'"
              [icon]="status === 'success' ? iconSuccess : iconError"
            />
            <div class="filename">{{ p.filename }}</div>
            <div class="payment-count">
              ({{ p.paymentList.length }} payments)
            </div>
          </div>

          <div class="file-error" *ngIf="p.parseResult.status === 'error'">
            <div class="error-name">Cannot parse file</div>
            <div class="error-content">
              <div class="papa-error" *ngFor="let e of p.parseResult.error">
                <div>Error found at row: {{ e.row }}</div>
                <div class="papa-error-type">Type: {{ e.type }}</div>
                <div class="papa-error-code">Code: {{ e.code }}</div>
                <div class="papa-error-message">
                  Description: {{ e.message }}
                </div>
              </div>
            </div>
          </div>

          <div
            class="file-error"
            *ngIf="p.parseResult.status === 'partialParse'"
          >
            <div class="error-name">
              Partial parse: {{ p.parseResult.errorRows.length }} invalid rows
              found out of {{ p.parseResult.fileRowsCount }} rows (header
              excluded)
            </div>
            <div class="error-content">
              <div class="error-row" *ngFor="let e of p.parseResult.errorRows">
                {{ e }}
              </div>
            </div>
          </div>

          <div class="file-error" *ngIf="p.parseResult.status === 'emptyFile'">
            <div class="error-name">No rows found</div>
          </div>
        </div>
      </div>

      <div class="upload" *ngIf="view.totalPayments.length > 0">
        <div class="upload-desc">
          <span>{{ view.totalPayments.length }}</span>
          Payments can be imported
        </div>
        <div class="upload-buttons">
          <div
            class="upload-btn"
            (click)="addPayment(view.totalPayments, 'replace')"
          >
            REPLACE <span>(previous payments will be deleted)</span>
          </div>
          <div
            class="upload-btn"
            (click)="addPayment(view.totalPayments, 'append')"
          >
            APPEND <span>(previous payments will be kept)</span>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .step1 {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-3);
      }

      .import-result {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
      }

      .import-result-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }

      .parsed-file {
        margin-top: var(--spacing-4);
        &:first-child {
          margin-top: 0;
        }
      }

      .file-desc {
        display: flex;
        align-items: center;
        gap: var(--spacing-1);
      }

      .file-error {
        padding: var(--spacing-1);
        margin-left: var(--spacing-3);
      }

      .error-name {
        font-weight: bold;
        margin-bottom: var(--spacing-1);
      }

      .error-content {
        max-height: 200px;
        overflow: auto;
        white-space: nowrap;
        border: 1px solid var(--border-color);
        padding: var(--spacing-1);
        border-radius: var(--radius-1);
      }

      fa-icon {
        color: var(--danger-color);
      }

      fa-icon.icon-success {
        color: var(--success-color);
      }

      .upload-desc {
        font-size: 1.3rem;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: var(--spacing-1);
        flex-direction: column;
        justify-content: center;
      }

      .upload-desc > span {
        font-size: 2rem;
        font-weight: bold;
      }

      .upload {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-3);
        margin-top: var(--spacing-4);
        background-color: var(--success-color);
        padding: var(--spacing-3);
        border-radius: var(--radius-1);
      }

      .upload-buttons {
        display: flex;
        gap: var(--spacing-2);
        flex-wrap: wrap;
        margin-top: var(--spacing-2);
      }

      .upload-btn {
        flex: 1;
        padding: var(--spacing-2);
        border: 1px solid var(--text-color);
        border-radius: var(--radius-1);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-1);
        justify-content: center;
      }

      .upload-btn > span {
        font-size: 0.8rem;
        text-align: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadCsvComponent {
  @Output() paymentImported = new EventEmitter<void>();
  view$ = new BehaviorSubject<UploadCsvView>({
    parsedFiles: [],
    totalPayments: [],
  });
  isMobile$: Observable<boolean>;
  iconSuccess = faCheckCircle;
  iconError = faExclamationCircle;

  constructor(private store: StoreService) {
    this.isMobile$ = this.store.select('isMobile');
  }

  private patch(partial: Partial<UploadCsvView>) {
    this.view$.next({ ...this.view$.value, ...partial });
  }

  clearAll(): void {
    this.patch({ parsedFiles: [], totalPayments: [] });
  }

  async onFilesSelected(fileList: File[]): Promise<void> {
    const parsedFiles = await Promise.all(fileList.map(parseFile));
    const totalPayments = parsedFiles.map((pf) => pf.paymentList).flat();
    this.patch({ parsedFiles, totalPayments });
  }

  addPayment(payments: Payment[], mode: 'replace' | 'append') {
    this.store.addPaymentList(payments, mode);
    this.patch({ parsedFiles: [], totalPayments: [] });
    this.paymentImported.emit();
  }
}

async function parseFile(file: File): Promise<ParsedFile> {
  const filename = file.name;
  return new Promise((resolve) => {
    papa.parse(file, {
      complete: (result: ParseResult<string[]>) => {
        if (result.errors.length === 0) {
          if (result.data.length <= 1) {
            // ignore header
            resolve({
              filename,
              paymentList: [],
              parseResult: { status: 'emptyFile' },
            });
            return;
          }
          const withoutHeader = result.data.slice(1);
          const errorRows: string[][] = [];
          const paymentList: Payment[] = [];
          for (const row of withoutHeader) {
            if (row.length === 0) continue; // ignore empty rows (e.g. last row)
            if (row.length === 1 && row[0] === '') continue; // ignore empty rows (e.g. last row
            const payment = parseRow(row);
            if (payment === null) errorRows.push(row);
            else paymentList.push(payment);
          }
          if (errorRows.length > 0) {
            resolve({
              filename,
              paymentList,
              parseResult: {
                status: 'partialParse',
                errorRows,
                fileRowsCount: result.data.length - 1, // again - ignore header
              },
            });
          } else {
            resolve({
              filename,
              paymentList,
              parseResult: { status: 'success' },
            });
          }
        } else {
          resolve({
            filename,
            paymentList: [],
            parseResult: { status: 'error', error: result.errors },
          });
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

/*

debugData: ParsedFile[] = [
    {
      filename: 'test-success.csv',
      paymentList: Array.from({ length: 10 }, () => ({}) as Payment),
      parseResult: { status: 'success' },
    },
    {
      filename: 'test-error.csv',
      paymentList: [],
      parseResult: {
        status: 'error',
        error: [
          {
            type: 'Delimiter',
            code: 'UndetectableDelimiter',
            message:
              'Unable to auto-detect delimiting character; defaulted to comma',
            row: 0,
          },
          {
            type: 'Delimiter',
            code: 'UndetectableDelimiter',
            message:
              'Unable to auto-detect delimiting character; defaulted to comma',
            row: 0,
          },
        ],
      },
    },
    {
      filename: 'test-partial.csv',
      paymentList: [],
      parseResult: {
        status: 'partialParse',
        errorRows: [
          [
            'Split transaction',
            'Date',
            'Payee/Payer',
            'Income',
            'Expense',
            'Category',
            'Subcategory',
            'Notes',
            'Payment method',
            'Status',
            'Reference Number',
            'Picture',
            'Tags',
          ],
          [
            '',
            '01/01/2023',
            'Vodafone',
            '0',
            '6,99',
            'Housing',
            'Mobile Phone',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '01/01/2023',
            'Nintendo Online',
            '0',
            '39,00',
            'Leisures',
            'Subscriptions',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '01/01/2023',
            'Fugalli',
            '0',
            '390,00',
            'Housing',
            'Rent',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '01/01/2023',
            'Vodafone Fibra',
            '0',
            '27,90',
            'Housing',
            'Fibra',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '01/01/2023',
            'Unicredit',
            '0',
            '4,70',
            'Finance',
            'Bank account fees',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '01/01/2023',
            'Svapoebasta',
            '0',
            '61,11',
            'Leisures',
            'eCig',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '02/01/2023',
            'Bird',
            '0',
            '2,40',
            'Transport',
            'Monopattino',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '02/01/2023',
            'GitKraken',
            '0',
            '29,70',
            'Work',
            'Software/subscriptions',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '02/01/2023',
            'Copilot',
            '0',
            '98,70',
            'Work',
            'Software/subscriptions',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '03/01/2023',
            'GamePass',
            '0',
            '1,00',
            'Leisures',
            'Games',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '05/01/2023',
            'Mercatò',
            '0',
            '67,88',
            'Food',
            'Supermarket',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '07/01/2023',
            'Carrefour',
            '0',
            '7,57',
            'Food',
            'Supermarket',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '08/01/2023',
            'Eurospin',
            '0',
            '15,78',
            'Food',
            'Supermarket',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '09/01/2023',
            'Bird',
            '0',
            '2,20',
            'Transport',
            'Monopattino',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '10/01/2023',
            'Ottico',
            '0',
            '19,00',
            'Personal Care',
            'Health',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '10/01/2023',
            'Panetteria',
            '0',
            '1,45',
            'Food',
            'Grocery',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '11/01/2023',
            'Panetteria',
            '0',
            '1,80',
            'Food',
            'Grocery',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '13/01/2023',
            'Visita Medica',
            '0',
            '25,00',
            'Personal Care',
            'Health',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
          [
            '',
            '15/01/2023',
            'Spotify',
            '0',
            '48,00',
            'Leisures',
            'Subscriptions',
            '',
            '',
            '',
            '',
            '',
            '',
          ],
        ],
        fileRowsCount: 100,
      },
    },
    {
      filename: 'test-empty.csv',
      paymentList: [],
      parseResult: { status: 'emptyFile' },
    },
  ];


 */
