import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Optional,
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-filter-panel',
  template: `
    <div class="title">
      Filters
      <fa-icon [icon]="iconClose" *ngIf="data?.isMobile" (click)="close()" />
    </div>
    <app-filter-date />
    <app-filter-number field="expense" />
    <app-filter-string field="payee" />
    <app-filter-dropdown mode="select" field="category">
      <app-filter-list field="category" />
    </app-filter-dropdown>
    <app-filter-dropdown mode="select" field="subcategory">
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
    public dialogRef: DialogRef<FilterPanelComponent>,
    @Optional() @Inject(DIALOG_DATA) public data?: { isMobile: boolean },
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
