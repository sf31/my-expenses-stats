import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { State } from '../app.types';
import { StoreService } from '../store.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CdkMenuTrigger } from '@angular/cdk/menu';

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, CdkMenuTrigger],
  template: `
    <div class="filter-wrapper">
      <div class="field">{{ field }}</div>
      <div class="filter-reset" (click)="reset()">Reset</div>
      <div class="filter select" [cdkMenuTriggerFor]="menu">
        <span class="text-ellipsis">
          {{ (filterEnabled$ | async)?.filterValues || 'Select ' + field }}
        </span>
        <fa-icon [icon]="iconCaret" />
      </div>
    </div>

    <ng-template #menu>
      <div class="dropdown-menu-outer">
        <div class="dropdown-menu" cdkMenu>
          <ng-content />
        </div>
      </div>
    </ng-template>
  `,
  styleUrls: ['./filter.styles.scss'],
  styles: [
    `
      .select {
        border: 1px solid var(--bg-color);
        background-color: var(--bg-color);
        border-radius: var(--radius-1);
        padding: var(--spacing-1) 0;
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .select span {
        margin-left: var(--spacing-1);
      }

      .select fa-icon {
        margin-right: var(--spacing-1);
      }

      .dropdown-menu-outer {
        max-height: 350px;
        width: 300px;
        overflow: auto;
      }

      .dropdown-menu {
        border: 1px solid var(--border-color);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDropdown implements OnInit {
  @Input() field?: keyof State['filterList'];
  iconCaret = faCaretDown;
  filterEnabled$?: Observable<{
    filterValues: string[] | null;
    enabled: boolean;
  }>;

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    if (!this.field) return;
    this.filterEnabled$ = this.store.selectFilter(this.field).pipe(
      map((filter) => {
        const filterValues = filter?.hasOwnProperty('values')
          ? (filter as any).values
          : null;
        return { filterValues, enabled: !!filter };
      }),
    );
  }

  reset(): void {
    if (!this.field) return;
    this.store.setFilter(this.field, null);
  }
}
