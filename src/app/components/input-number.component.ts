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
import { isNumber } from 'chart.js/helpers';

@Pipe({
  name: 'inputNumber',
  pure: true,
  standalone: true,
})
class InputNumberPipe {
  transform(value?: string | number | null): string {
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') return value;
    return '';
  }
}

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, InputComponent, InputNumberPipe],
  template: `
    <div class="app-input-wrapper" [class.error]="hasError">
      <app-input
        #input
        [placeholder]="placeholder"
        [hasError]="hasError"
        [value]="value | inputNumber"
        (valueChange)="onValueChange($event)"
      />
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberComponent {
  @Input() value?: number | null = null;
  @Input() placeholder?: string;
  @Input() hasError?: boolean;
  @Output() valueChange = new EventEmitter<number | null>();

  onValueChange(value: string | null): void {
    this.hasError = false;
    if (value === null) return this.valueChange.emit(null);
    const parsedValue = parseFloat(value);
    if (isNumber(value) && !isNaN(parsedValue))
      this.valueChange.emit(parsedValue);
    else this.hasError = true;
  }
}
