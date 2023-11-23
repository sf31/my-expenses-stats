import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-select-multiple',
  standalone: true,
  imports: [
    CommonModule,
    CheckboxComponent,
    CdkMenu,
    CdkMenuTrigger,
    FontAwesomeModule,
    CdkMenuItem,
  ],
  template: `
    <div class="select-multiple-wrapper">
      <ng-container *ngIf="mode === 'list'; else dropdown">
        <div class="item" *ngFor="let item of view" (click)="onItemClick(item)">
          <app-checkbox [checked]="item.selected" />
          <div class="label text-ellipsis">{{ item.label }}</div>
        </div>
      </ng-container>
    </div>

    <ng-template #dropdown>
      <div #select class="dropdown" [cdkMenuTriggerFor]="menuSelect">
        <div
          *ngIf="itemListSelected && itemListSelected.length > 0"
          class="dropdown-label text-ellipsis"
        >
          {{ itemListSelected }}
        </div>

        <div
          *ngIf="!itemListSelected || itemListSelected.length === 0"
          class="dropdown-placeholder text-ellipsis"
        >
          {{ placeholder || 'Select' }}
        </div>

        <div class="fill-remaining-space"></div>
        <fa-icon
          *ngIf="itemListSelected && itemListSelected.length > 0"
          [icon]="iconEmpty"
          (click)="
            $event.stopImmediatePropagation(); itemListSelectedChange.emit([])
          "
        />
        <fa-icon [icon]="iconCaret" />
      </div>

      <ng-template #menuSelect>
        <div
          class="dropdown-menu shadow"
          cdkMenu
          [style.width.px]="select.clientWidth"
        >
          <div
            class="item"
            *ngFor="let item of view"
            (click)="onItemClick(item)"
          >
            <app-checkbox [checked]="item.selected" />
            <div class="label text-ellipsis">
              {{ item.label }}
            </div>
          </div>
        </div>
      </ng-template>
    </ng-template>
  `,
  styles: [
    `
      .select-multiple-wrapper {
        background-color: var(--bg-color);
        overflow: auto;
        border-radius: var(--radius-1);
        user-select: none;
      }

      .dropdown {
        cursor: pointer;
        border-radius: var(--radius-1);
        display: flex;
        align-items: center;
        background-color: var(--bg-color);
        padding: 0 0.25rem 0 0.5rem;
      }

      .dropdown > fa-icon {
        color: var(--text-color);
        cursor: pointer;
        padding: 0.5rem 0.25rem;
      }

      app-checkbox {
        padding: 0.5rem 0.5rem 0.5rem 0;
      }

      .label {
        flex: 1 1 auto;
        overflow: hidden;
      }

      .dropdown-menu {
        background-color: var(--bg-color);
        border-radius: var(--radius-1);
        overflow: auto;
        max-height: 40dvh;
        user-select: none;
      }

      .dropdown-label,
      .dropdown-placeholder {
        flex: 1 1 auto;
        overflow: hidden;
      }

      .dropdown-placeholder {
        color: var(--disabled-color);
        font-size: 0.9rem;
      }

      .item {
        display: flex;
        align-items: center;
        overflow: hidden;
        cursor: pointer;
        padding: 0 0.5rem;
        &:last-child {
          margin-bottom: 0;
        }
        &:hover {
          background-color: var(--border-color);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMultipleComponent implements OnChanges {
  @Input() itemList?: string[];
  @Input() itemListSelected?: string[];
  @Input() placeholder?: string;
  @Input() mode: 'list' | 'dropdown' = 'list';
  @Output() itemListSelectedChange = new EventEmitter<string[]>();
  iconCaret = faCaretDown;
  iconEmpty = faTimes;
  view: { label: string; selected: boolean }[] = [];

  ngOnChanges() {
    const { itemList, selectedList } = this.getItems();
    this.view = itemList.map((item) => {
      return { label: item, selected: selectedList.includes(item) };
    });
  }

  onItemClick(item: { label: string; selected: boolean }): void {
    const { selectedList } = this.getItems();
    const newItemList = item.selected
      ? selectedList.filter((i) => i !== item.label)
      : [...selectedList, item.label];

    this.itemListSelectedChange.emit(newItemList);
  }

  private getItems(): { itemList: string[]; selectedList: string[] } {
    const itemList = this.itemList ?? [];
    const selectedList = this.itemListSelected ?? [];
    return { itemList, selectedList };
  }
}
