import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Optional,
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FilterDateComponent } from './filter-date.component';
import { FilterDropdown } from './filter-dropdown';
import { FilterNumberComponent } from './filter-number.component';
import { FilterStringComponent } from './filter-string.component';
import { FilterListComponent } from './filter-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [
    CommonModule,
    FilterDateComponent,
    FilterDropdown,
    FilterNumberComponent,
    FilterStringComponent,
    FilterListComponent,
    FontAwesomeModule,
  ],
  template: `
    <div class="title">
      Filters
      <fa-icon [icon]="iconClose" *ngIf="data?.isMobile" (click)="close()" />
    </div>
    <app-filter-date />
    <app-filter-number field="expense" />
    <app-filter-string field="payee" />
    <app-filter-dropdown field="category">
      <app-filter-list field="category" />
    </app-filter-dropdown>
    <app-filter-dropdown field="subcategory">
      <app-filter-list field="subcategory" />
    </app-filter-dropdown>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: var(--spacing-3);
        padding: var(--spacing-3);
        background-color: var(--bg-color);
      }

      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent {
  iconClose = faTimes;
  constructor(
    @Optional() public dialogRef?: DialogRef<FilterPanelComponent>,
    @Optional() @Inject(DIALOG_DATA) public data?: { isMobile: boolean },
  ) {}

  close(): void {
    this.dialogRef?.close();
  }
}
