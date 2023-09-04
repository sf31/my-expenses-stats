import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { FilterString } from '../app.types';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-filter-string',
  template: `
    <app-filter-icon
      [cdkMenuTriggerFor]="menu"
      [enabled]="(filter$ | async) !== undefined"
    />

    <ng-template #menu>
      <div class="dropdown" cdkMenu>
        <input
          [placeholder]="'Filter ' + field"
          [value]="(filter$ | async)?.value"
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
  filter$?: Observable<FilterString | undefined>;

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    if (!this.field) throw new Error('Field is required');
    this.filter$ = this.store.selectFilter(this.field);
  }

  onInput(event: Event) {
    if (!this.field) return;
    const target = event.target as HTMLInputElement;
    const value = (target.value ?? '').trim();
    if (!value || value.length === 0)
      return this.store.setFilter(this.field, null);
    const filter: FilterString = { value };
    this.store.setFilter(this.field, filter);
  }
}
