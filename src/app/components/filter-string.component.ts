import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { FilterString } from '../app.types';
import { StoreService } from '../store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-string',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-wrapper">
      <div class="field">{{ field }}</div>
      <div class="filter-reset" (click)="reset()">Reset</div>
      <input
        class="filter"
        [placeholder]="'Filter ' + field"
        [value]="(filter$ | async)?.value"
        type="text"
        (input)="onInput($event)"
      />
    </div>
  `,
  styleUrls: ['./filter.styles.scss'],
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

  reset(): void {
    if (!this.field) return;
    this.store.setFilter(this.field, null);
  }
}
