import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-filter-dropdown',
  template: `
    <ng-container *ngIf="mode === 'icon'">
      <app-filter-icon [cdkMenuTriggerFor]="menu" />
    </ng-container>
    <div class="select" [cdkMenuTriggerFor]="menu" *ngIf="mode === 'select'">
      <span> {{ selectLabel }} </span>
      <fa-icon [icon]="iconCaret" />
    </div>
    <ng-template #menu>
      <div class="dropdown-menu" cdkMenu>
        <ng-content />
      </div>
    </ng-template>
  `,
  styles: [
    `
      .select {
        border: 1px solid var(--border-color);
        border-radius: var(--radius-1);
        padding: var(--spacing-1);
        cursor: pointer;
        user-select: none;
        width: 250px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDropdown {
  @Input() mode: 'icon' | 'select' = 'icon';
  @Input() selectLabel: string = 'Select';
  iconCaret = faCaretDown;
}
