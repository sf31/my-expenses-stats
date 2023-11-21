import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="app-input-wrapper">
      <input
        #input
        [type]="type"
        [placeholder]="placeholder ?? ''"
        [class.error]="hasError"
        [value]="value"
        (input)="valueChange.emit(input.value)"
      />
      <fa-icon
        *ngIf="input.value.length > 0"
        [icon]="iconEmpty"
        (click)="empty()"
      />
    </div>
  `,
  styles: [
    `
      .app-input-wrapper {
        position: relative;
        border: 1px solid green;
        border-radius: var(--radius-1);
        display: flex;
        align-items: center;
        background-color: var(--bg-color);
        padding: 0 0.25rem 0 0.5rem;
      }

      input {
        width: 100%;
        box-sizing: border-box;
        border: none;
        outline: none;
        padding: 0.5rem 0;
      }

      fa-icon {
        color: var(--text-color);
        cursor: pointer;
        padding: 0.25rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  @Input() value?: string | number | null = null;
  @Input() placeholder?: string;
  @Input() type: 'text' | 'date' = 'text';
  @Input() hasError?: boolean;
  @Output() valueChange = new EventEmitter<string | null>();

  iconEmpty = faTimes;

  empty(): void {
    this.value = '';
    this.valueChange.emit(this.value);
  }
}
