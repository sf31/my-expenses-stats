import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { map, Observable } from 'rxjs';
import { StoreService } from '../store.service';
import { FilterNumber } from '../app.types';

@Component({
  selector: 'app-filter-number',
  template: `
    <ng-container *ngIf="filter$ | async as filter">
      <app-filter-icon
        [cdkMenuTriggerFor]="menu"
        [enabled]="filter.min !== null || filter.max !== null"
      />

      <ng-template #menu>
        <div class="date-filter" cdkMenu>
          <div class="filter">
            <div class="field">Min</div>
            <input
              #min
              type="number"
              [value]="filter.min"
              (input)="onValueChange(min, max)"
            />
          </div>

          <div class="filter">
            <div class="field">Max</div>
            <input
              #max
              type="number"
              [value]="filter.max"
              (input)="onValueChange(min, max)"
            />
          </div>

          <app-btn (click)="reset()"> Reset</app-btn>
        </div>
      </ng-template>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNumberComponent implements OnInit {
  @Input({ required: true }) field?: 'expense' | 'income';
  filter$?: Observable<{ min: number | null; max: number | null }>;

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    if (!this.field) throw new Error('Field is required');
    const field = this.field;
    this.filter$ = this.store.select('filterList').pipe(
      map((filterList) => {
        const filter = filterList[field];
        if (!filter) return { min: null, max: null };
        return filter;
      }),
    );
  }

  onValueChange(min: HTMLInputElement, max: HTMLInputElement) {
    if (!this.field) return;
    const minVal = min.valueAsNumber;
    const maxVal = max.valueAsNumber;
    if (isNaN(minVal) || isNaN(maxVal)) return;
    const filter: FilterNumber = { min: minVal, max: maxVal };
    this.store.addFilter(this.field, filter);
  }

  reset() {
    if (!this.field) return;
    this.store.removeFilter(this.field);
  }
}
