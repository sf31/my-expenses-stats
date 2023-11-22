import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Pipe,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputComponent } from './input.component';
import { DateTime } from 'luxon';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Pipe({
  name: 'inputDate',
  pure: true,
  standalone: true,
})
class InputDatePipe {
  transform(value?: number | null): string {
    if (!value) return '';
    const fmt = 'yyyy-MM-dd';
    return DateTime.fromSeconds(value).toFormat(fmt);
  }
}

@Component({
  selector: 'app-input-date',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, InputComponent, InputDatePipe],
  template: `
    <div class="app-input-date-wrapper" [class.error]="hasError">
      <input
        #input
        type="date"
        [placeholder]="placeholder ?? ''"
        [value]="value | inputDate"
        (input)="emit(input.value)"
      />
      <fa-icon
        *ngIf="input.value.length > 0"
        [icon]="iconEmpty"
        (click)="emptyInput()"
      />
    </div>
  `,
  styles: [
    `
      .app-input-date-wrapper {
        border-radius: var(--radius-1);
        display: flex;
        align-items: center;
        background-color: var(--bg-color);
        padding: 0 0.25rem 0 0.5rem;
        border: 1px solid var(--bg-color); // prevent flickering when error border is added
      }

      input {
        width: 100%;
        box-sizing: border-box;
        border: none;
        outline: none;
        padding: 0.4rem 0;
      }

      fa-icon {
        color: var(--text-color);
        cursor: pointer;
        padding: 0.25rem 0.25rem 0.25rem 0.5rem;
      }

      .error {
        border: 1px solid var(--danger-color);
      }

      .error input {
        color: var(--danger-color);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateComponent {
  @Input() value?: number | null = null;
  @Input() placeholder?: string;
  @Input() hasError?: boolean;
  @Output() valueChange = new EventEmitter<number | null>();
  iconEmpty = faTimes;

  emit(value: string): void {
    console.log('emit', value);
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
    this.hasError = false;
    const date = DateTime.fromFormat(value, 'yyyy-MM-dd', { zone: 'UTC' });
    if (date.isValid) this.valueChange.emit(date.toUnixInteger());
    else this.hasError = true;
  }

  emptyInput(): void {
    this.value = null;
    this.valueChange.emit(null);
  }
}
