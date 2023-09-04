import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { FilterNumber } from '../app.types';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-filter-number',
  template: `
    <app-filter-icon
      [cdkMenuTriggerFor]="menu"
      [enabled]="(filter$ | async) !== undefined"
    />

    <ng-template #menu>
      <div class="dropdown-menu" cdkMenu>
        <div class="filter">
          <div class="field">Min</div>
          <input
            #min
            type="number"
            [value]="(filter$ | async)?.min"
            (input)="onValueChange(min, max)"
          />
        </div>

        <div class="filter">
          <div class="field">Max</div>
          <input
            #max
            type="number"
            [value]="(filter$ | async)?.max"
            (input)="onValueChange(min, max)"
          />
        </div>

        <app-btn (click)="reset()"> Reset</app-btn>
      </div>
    </ng-template>
  `,
  styles: [],
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
