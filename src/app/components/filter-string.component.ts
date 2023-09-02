import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { StoreService } from '../store.service';
import { FilterString } from '../types/PaymentFilter';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-filter-string',
  template: `
    <app-filter-icon
      [cdkMenuTriggerFor]="menu"
      [enabled]="(filter$ | async) !== null"
    />

    <ng-template #menu>
      <div class="dropdown" cdkMenu>
        <input
          [placeholder]="'Filter ' + field"
          type="text"
          (input)="onInput($event)"
        />
      </div>
    </ng-template>
  `,
  styles: [
    `
      fa-icon {
        cursor: pointer;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterStringComponent implements OnInit {
  @Input({ required: true }) field?: 'payee' | 'notes' | 'paymentMethod';
  filter$?: Observable<FilterString | null>;

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    if (!this.field) throw new Error('Field is required');
    const field = this.field;
    this.filter$ = this.store
      .select('filterList')
      .pipe(map((filterList) => filterList[field] || null));
  }

  onInput(event: Event) {
    if (!this.field) return;
    const target = event.target as HTMLInputElement;
    const value = (target.value ?? '').trim();
    if (!value || value.length === 0)
      return this.store.removeFilter(this.field);
    const filter: FilterString = { value };
    this.store.addFilter(this.field, filter);
  }
}
