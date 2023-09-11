import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoreService } from '../store.service';
import { Observable } from 'rxjs';
import { faCircleHalfStroke, faCog } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <fa-icon [icon]="iconSettings" [cdkMenuTriggerFor]="settingsMenu" />
    <ng-template #settingsMenu>
      <div class="menu-settings" cdkMenu>
        <ng-container *ngIf="theme$ | async as theme">
          <div class="menu-item" (click)="toggleTheme(theme)">
            Change theme (current: {{ theme }} )
          </div>
        </ng-container>

        <div class="menu-item" (click)="resetPayments()">
          Remove all payments
        </div>
        <div class="menu-item" (click)="resetCharts()">
          Reset charts settings
        </div>
        <div class="menu-item" (click)="resetState()">Reset AppState</div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .menu-settings {
        background-color: var(--disabled-color);
        border-color: var(--border-color);
        padding: var(--spacing-2);
        border-radius: var(--radius-1);
        user-select: none;
      }

      .menu-item {
        padding: var(--spacing-1) 0;
        cursor: pointer;
      }

      fa-icon {
        cursor: pointer;
        font-size: 1.5rem;
        padding: 0 var(--spacing-2);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  theme$: Observable<'dark' | 'light'>;
  iconToggle = faCircleHalfStroke;
  iconSettings = faCog;

  constructor(private store: StoreService) {
    this.theme$ = this.store.select('theme');
  }

  toggleTheme(theme: 'dark' | 'light') {
    this.store.setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  resetPayments() {
    this.store.reset('paymentList');
  }

  resetCharts() {
    this.store.reset('chartList');
  }

  resetState() {
    this.store.resetState();
  }
}
