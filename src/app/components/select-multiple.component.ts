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
        <div class="label">{{ item.label }}</div>
        <app-checkbox [checked]="item.selected" />
      </div>
    </div>
  `,
  styles: [
    `
      .select-multiple-wrapper {
        background-color: var(--bg-color);
        height: 250px;
        overflow: auto;
        width: 250px;
      }

      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
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
