import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { faCaretDown, faTimes } from '@fortawesome/free-solid-svg-icons';
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
    <div #select class="item-selected" [cdkMenuTriggerFor]="menuSelect">
      <div class="label">
        {{ itemSelected || placeholder || 'Select one' }}
      </div>
      <div class="fill-remaining-space"></div>
      <fa-icon
        *ngIf="itemSelected"
        [icon]="iconEmpty"
        (click)="
          $event.stopImmediatePropagation(); itemSelectedChange.emit(null)
        "
      />
      <fa-icon [icon]="iconCaret" />
    </div>

    <ng-template #menuSelect>
      <div class="dropdown-menu" cdkMenu [style.width.px]="select.clientWidth">
        <div
          cdkMenuItem
          class="menu-item text-ellipsis"
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
        cursor: pointer;
        border-radius: var(--radius-1);
        display: flex;
        align-items: center;
        background-color: var(--bg-color);
        padding: 0 0.25rem 0 0.5rem;
      }

      fa-icon {
        color: var(--text-color);
        cursor: pointer;
        padding: 0.5rem 0.25rem;
      }

      .fill-remaining-space {
        flex: 1 1 auto;
      }

      .dropdown-menu {
        background-color: var(--bg-color);
        border-radius: var(--radius-1);
        overflow: auto;
        max-height: 40dvh;
        user-select: none;
      }

      .menu-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        text-transform: capitalize;
        padding: 0.5rem;
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
  @Output() itemSelectedChange = new EventEmitter<T | null>();

  iconCaret = faCaretDown;
  iconEmpty = faTimes;
}
