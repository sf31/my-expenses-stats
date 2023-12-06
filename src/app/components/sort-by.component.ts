import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreService } from '../store.service';
import { Observable } from 'rxjs';
import { Payment, State } from '../utils/app.types';
import { SelectComponent } from './select.component';
import { SelectMultipleComponent } from './select-multiple.component';
import { BtnComponent } from './btn.component';
import { faArrowRotateBack } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sort-by',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    SelectComponent,
    SelectMultipleComponent,
    BtnComponent,
  ],
  template: `
    <ng-container *ngIf="sortBy$ | async as sortBy">
      <div class="label">Sort by</div>

      <app-select
        [itemList]="sortableFieldList"
        [itemSelected]="sortBy.field"
        [showClearIcon]="false"
        (itemSelectedChange)="onSortChange($event, sortBy.order)"
      />

      <app-select
        class="order"
        [itemList]="sortOrderList"
        [itemSelected]="sortBy.order"
        [showClearIcon]="false"
        (itemSelectedChange)="onSortChange(sortBy.field, $event)"
      />

      <app-btn (click)="reset()">
        <fa-icon [icon]="iconReset" />
      </app-btn>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      app-select {
        width: 130px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortByComponent {
  sortBy$: Observable<State['sortBy']>;
  sortableFieldList: (keyof Payment)[] = [
    'date',
    'payee',
    'expense',
    'category',
    'subcategory',
  ];
  sortOrderList: State['sortBy']['order'][] = ['asc', 'desc'];
  iconReset = faArrowRotateBack;

  constructor(private store: StoreService) {
    this.sortBy$ = this.store.select('sortBy');
  }

  onSortChange(
    field: keyof Payment | null,
    order: State['sortBy']['order'] | null,
  ) {
    if (!field || !order) return;
    this.store.setSortBy(field, order);
  }

  reset(): void {
    this.store.reset('sortBy');
  }
}
