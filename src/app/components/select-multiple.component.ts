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

@Component({
  selector: 'app-select-multiple',
  standalone: true,
  imports: [CommonModule, CheckboxComponent],
  template: `
    <div class="select-multiple-wrapper">
      <div class="item" *ngFor="let item of view" (click)="onItemClick(item)">
        <app-checkbox [checked]="item.selected" />
        <div class="label text-ellipsis">{{ item.label }}</div>
      </div>
    </div>
  `,
  styles: [
    `
      .select-multiple-wrapper {
        background-color: var(--bg-color);
        overflow: auto;
        border-radius: var(--radius-1);
        user-select: none;
      }

      app-checkbox {
        padding: 0.5rem 0.5rem 0.5rem 0;
      }

      .label {
        flex: 1 1 auto;
        overflow: hidden;
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
  @Input() itemList: string[] = [];
  @Input() itemListSelected: string[] = [];
  @Output() itemListSelectedChange = new EventEmitter<string[]>();
  view: { label: string; selected: boolean }[] = [];

  ngOnChanges() {
    this.view = this.itemList.map((item) => {
      return { label: item, selected: this.itemListSelected.includes(item) };
    });
  }

  onItemClick(item: { label: string; selected: boolean }): void {
    const itemList = item.selected
      ? this.itemListSelected.filter((i) => i !== item.label)
      : [...this.itemListSelected, item.label];

    this.itemListSelectedChange.emit(itemList);
  }
}
