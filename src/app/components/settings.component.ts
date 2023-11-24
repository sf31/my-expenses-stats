import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoreService } from '../store.service';
import { combineLatest, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { generateMockPayments } from '../utils/utils';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, CdkMenuTrigger],
  template: `
    <ng-container *ngIf="view$ | async as view">
      <div class="menu-title">Theme</div>
      <div class="menu-btn" (click)="toggleTheme(view.theme)">
        Change theme (current: {{ view.theme }})
      </div>

      <ng-container *ngIf="!view.isMobile">
        <div class="menu-title">Theme</div>
        <div class="menu-btn" (click)="toggleDesktopView()">
          Change view (current: {{ view.desktopView }})
        </div>
      </ng-container>
    </ng-container>

    <div class="menu-title">App Info</div>
    <div class="menu-btn" (click)="github()">View on GitHub</div>

    <div class="dev-tools menu-title">
      <div class="menu-title">DevTools</div>
      <div class="menu-btn" (click)="reloadMockData()">Reload mock data</div>
      <div class="menu-btn" (click)="resetPayments()">Remove all payments</div>
      <div class="menu-btn" (click)="resetCharts()">Reset charts settings</div>
      <div class="menu-btn" (click)="resetState()">Reset AppState</div>
    </div>
  `,
  styles: [
    `
      :host {
        background-color: var(--bg-color);
        padding: 1rem;
        border-radius: var(--radius-1);
      }

      .menu-title {
        font-weight: bold;
        margin: 2rem 0 0.5rem 0;
        &:first-child {
          margin-top: 0;
        }
      }

      .menu-btn {
        cursor: pointer;
        padding: 0.5rem;
        margin-left: 1rem;
        border-radius: var(--radius-1);
        &:hover {
          cursor: pointer;
          background-color: var(--border-color);
        }
      }

      .dev-tools {
        color: var(--danger-color);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  view$: Observable<{
    theme: 'dark' | 'light';
    desktopView: 'tabs' | 'split';
    isMobile: boolean;
  }>;

  constructor(private store: StoreService) {
    this.view$ = combineLatest([
      this.store.select('theme'),
      this.store.select('desktopView'),
      this.store.select('isMobile'),
    ]).pipe(
      map(([theme, desktopView, isMobile]) => {
        return { theme, desktopView, isMobile };
      }),
    );
  }

  toggleTheme(theme: 'dark' | 'light') {
    this.store.setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  toggleDesktopView() {
    this.store.toggleDesktopView();
  }

  resetPayments() {
    this.store.reset('paymentList');
  }

  resetCharts() {
    this.store.reset('stdChartList');
    this.store.reset('historyChartList');
  }

  resetState() {
    this.store.resetState();
  }

  reloadMockData() {
    this.store.addPaymentList(generateMockPayments(100), 'replace');
  }

  github() {
    window.open('https://github.com/sf31/my-expenses-stats', '_blank');
  }
}
