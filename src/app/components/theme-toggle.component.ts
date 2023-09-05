import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StoreService } from '../store.service';
import { Observable } from 'rxjs';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <ng-container *ngIf="theme$ | async as theme">
      <fa-icon [icon]="iconToggle" (click)="toggleTheme(theme)" />
    </ng-container>
  `,
  styles: [
    `
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

  constructor(private store: StoreService) {
    this.theme$ = this.store.select('theme');
  }

  toggleTheme(theme: 'dark' | 'light') {
    this.store.setTheme(theme === 'dark' ? 'light' : 'dark');
  }
}
