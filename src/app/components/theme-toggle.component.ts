import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoreService } from '../store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <ng-container *ngIf="theme$ | async as theme">
      <div class="theme" (click)="toggleTheme(theme)">
        <span class="toggle" [class.active]="theme === 'dark'">Dark</span>
        <span class="toggle" [class.active]="theme === 'light'">Light</span>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .theme {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        color: #ffffff;
      }

      .toggle {
        padding: 0 var(--spacing-2);
      }

      .toggle.active {
        font-weight: bold;
        color: var(--accent-color);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  theme$: Observable<'dark' | 'light'>;

  constructor(private store: StoreService) {
    this.theme$ = this.store.select('theme');
  }

  toggleTheme(theme: 'dark' | 'light') {
    this.store.setTheme(theme === 'dark' ? 'light' : 'dark');
  }
}
