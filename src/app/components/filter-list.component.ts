import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { map, Observable } from 'rxjs';
import { StoreService } from '../store.service';
import { FilterList } from '../app.types';

@Component({
  selector: 'app-filter-list',
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
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterListComponent implements OnInit {
  @Input({ required: true }) field?: 'category' | 'subcategory';
  filter$?: Observable<FilterList | null>;
  categories: Observable<string[] | null>;
  subcategories: Observable<string[] | null>;

  constructor(private store: StoreService) {
    this.categories = this.store.getCategoryList();
    this.subcategories = this.store.getSubcategoryList();
  }

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
    const filter: FilterList = { values: [value] };
    this.store.addFilter(this.field, filter);
  }
}
