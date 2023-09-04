import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { StoreService } from '../store.service';
import { FilterList } from '../app.types';

@Component({
  selector: 'app-filter-list',
  template: `
    <app-select-multiple
      *ngIf="field === 'category'"
      [itemList]="(categories$ | async) ?? []"
      [itemListSelected]="(filter$ | async)?.values ?? []"
      (itemListSelectedChange)="onItemListSelectedChange($event)"
    />

    <app-select-multiple
      *ngIf="field === 'subcategory'"
      [itemList]="(subcategories$ | async) ?? []"
      [itemListSelected]="(filter$ | async)?.values ?? []"
      (itemListSelectedChange)="onItemListSelectedChange($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterListComponent implements OnInit {
  @Input({ required: true }) field?: 'category' | 'subcategory';
  filter$?: Observable<FilterList | undefined>;
  categories$: Observable<string[]>;
  subcategories$: Observable<string[]>;

  constructor(private store: StoreService) {
    this.categories$ = this.store.getCategoryList();
    this.subcategories$ = this.store.getSubcategoryList();
  }

  ngOnInit(): void {
    if (!this.field) throw new Error('Field is required');
    this.filter$ = this.store.selectFilter(this.field);
  }

  onItemListSelectedChange(values: string[]) {
    if (!this.field) return;
    if (values.length === 0) return this.store.setFilter(this.field, null);
    const filter: FilterList = { values };
    this.store.setFilter(this.field, filter);
  }
}
