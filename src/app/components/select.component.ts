import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
  ],
  template: `
    <div class="item-selected" [cdkMenuTriggerFor]="menuSelect">
      <div class="label">{{ itemSelected || placeholder || 'Select one' }}</div>
      <fa-icon [icon]="iconCaret" />
    </div>

    <ng-template #menuSelect>
      <div class="dropdown-menu" cdkMenu>
        <div
          cdkMenuItem
          class="menu-item"
          *ngFor="let i of itemList"
          (click)="itemSelectedChange.emit(i)"
        >
          {{ i }}
        </div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .item-selected {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-1);
        border: 1px solid var(--border-color);
        cursor: pointer;
        text-transform: capitalize;
      }

      .select {
        background-color: var(--border-color);
        overflow: auto;
        padding: var(--spacing-2);
        border-radius: var(--radius-1);
        border: 1px solid var(--border-color);
      }

      .menu-item {
        width: 120px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        text-transform: capitalize;
        padding: var(--spacing-1);
        border-radius: var(--radius-1);
        &:last-child {
          margin-bottom: 0;
        }
        &:focus {
          outline: none;
        }
        &:hover {
          background-color: var(--border-color);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T> {
  @Input() itemList: T[] = [];
  @Input() itemSelected?: T;
  @Input() placeholder?: string;
  @Output() itemSelectedChange = new EventEmitter<T>();
  iconCaret = faCaretDown;
}
