import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { FilterNumber } from '../app.types';
import { StoreService } from '../store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-number',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-wrapper">
      <div class="field">{{ field }}</div>
      <div class="filter-reset" (click)="reset()">Reset</div>
      <div class="filter">
        <div class="label">Min</div>
        <input
          #min
          type="number"
          [value]="(filter$ | async)?.min"
          (input)="onValueChange(min, max)"
        />
        <div class="fill"></div>
        <div class="label">Max</div>
        <input
          #max
          type="number"
          [value]="(filter$ | async)?.max"
          (input)="onValueChange(min, max)"
        />
      </div>
    </div>
  `,
  styleUrls: ['./filter.styles.scss'],
  styles: [
    `
      .filter {
        display: flex;
        align-items: center;
      }

      .label {
        width: 35px;
      }

      input {
        width: 100px;
      }

      .fill {
        flex: 1 1 auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNumberComponent implements OnInit {
  @Input({ required: true }) field?: 'expense' | 'income';
  filter$?: Observable<{ min: number | null; max: number | null } | undefined>;

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    if (!this.field) throw new Error('Field is required');
    const field = this.field;
    this.filter$ = this.store.selectFilter(field);
  }

  onValueChange(min: HTMLInputElement, max: HTMLInputElement) {
    if (!this.field) return;
    const minVal = min.valueAsNumber;
    const maxVal = max.valueAsNumber;
    if (isNaN(minVal) || isNaN(maxVal)) return;
    const filter: FilterNumber = { min: minVal, max: maxVal };
    this.store.setFilter(this.field, filter);
  }

  reset() {
    if (!this.field) return;
    this.store.setFilter(this.field, null);
  }
}
