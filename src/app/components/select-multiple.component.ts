import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-select-multiple',
  template: `
    <div class="select-multiple-wrapper">
      <div class="item" *ngFor="let item of view" (click)="onItemClick(item)">
        <div class="label text-ellipsis">{{ item.label }}</div>
        <app-checkbox [checked]="item.selected" />
      </div>
    </div>
  `,
  styles: [
    `
      .select-multiple-wrapper {
        background-color: var(--bg-color);
        overflow: auto;
        border-radius: var(--radius-1);
      }

      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: var(--radius-1);
        padding: var(--spacing-1);
        cursor: pointer;
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
