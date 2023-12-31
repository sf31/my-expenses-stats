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
    <div class="app-input-wrapper" [class.error]="hasError">
      <input
        #input
        [placeholder]="placeholder ?? ''"
        [value]="value"
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
      .app-input-wrapper {
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
        padding: 0.5rem 0;
      }

      fa-icon {
        color: var(--text-color);
        cursor: pointer;
        padding: 0.25rem;
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
export class InputComponent {
  @Input() value?: string | null = '';
  @Input() placeholder?: string;
  @Input() hasError?: boolean;
  @Output() valueChange = new EventEmitter<string | null>();
  iconEmpty = faTimes;

  emit(value: string): void {
    const val = value.trim().length > 0 ? value.trim() : null;
    this.valueChange.emit(val);
  }

  emptyInput(): void {
    this.value = null;
    this.valueChange.emit(null);
  }
}
