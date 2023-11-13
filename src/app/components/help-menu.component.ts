import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoreService } from '../store.service';
import { Observable } from 'rxjs';
import {
  faCircleHalfStroke,
  faCircleQuestion,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CdkMenuTrigger } from '@angular/cdk/menu';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, CdkMenuTrigger],
  template: `
    <fa-icon [icon]="iconSettings" [cdkMenuTriggerFor]="settingsMenu" />
    <ng-template #settingsMenu>
      <div class="menu-settings" cdkMenu>
        <div class="menu-title">Settings</div>
        <ng-container *ngIf="theme$ | async as theme">
          <div class="menu-item" (click)="toggleTheme(theme)">
            Change theme (current: {{ theme }} )
          </div>
        </ng-container>

        <div class="menu-title">App info</div>
        <div class="menu-item" (click)="github()">View on GitHub</div>

        <div class="menu-title warn">DevTools</div>
        <div class="menu-item warn" (click)="resetPayments()">
          Remove all payments
        </div>
        <div class="menu-item warn" (click)="resetCharts()">
          Reset charts settings
        </div>
        <div class="menu-item warn" (click)="resetState()">Reset AppState</div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .menu-settings {
        background-color: var(--border-color);
        border-color: var(--border-color);
        border-radius: var(--radius-1);
        user-select: none;
        padding: var(--spacing-1);
      }

      .menu-settings > div {
        padding: var(--spacing-1);
      }

      .menu-title {
        font-weight: bold;
      }

      .warn {
        color: var(--danger-color);
        display: flex;
        align-items: center;
      }

      .menu-title:not(:first-child) {
        margin-top: var(--spacing-2);
      }

      .menu-item {
        cursor: pointer;
        margin: 0 var(--spacing-2);
        border-radius: var(--radius-1);
        &:hover {
          background-color: var(--bg-color);
        }
      }

      fa-icon:first-child {
        cursor: pointer;
        font-size: 1.5rem;
        padding: 0 var(--spacing-2);
      }

      .menu-item fa-icon {
        font-size: 1.2rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpMenuComponent {
  theme$: Observable<'dark' | 'light'>;
  iconToggle = faCircleHalfStroke;
  iconSettings = faCircleQuestion;
  iconWarn = faExclamationTriangle;

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

  github() {
    window.open('https://github.com/sf31/my-expenses-stats', '_blank');
  }
}
