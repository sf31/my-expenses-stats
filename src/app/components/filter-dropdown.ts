import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-filter-dropdown',
  template: `
    <app-filter-icon [cdkMenuTriggerFor]="menuDate" />
    <ng-template #menuDate>
      <div class="dropdown-menu" cdkMenu>
        <ng-content />
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDropdown {}
