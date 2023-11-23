import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import {
  faChartBar,
  faCog,
  faFilter,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { map, Observable } from 'rxjs';
import { AppService } from '../app.service';

type BottomAction = {
  label: string;
  link: string;
  icon: IconDefinition;
  active: boolean;
};

@Component({
  selector: 'app-mobile',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FontAwesomeModule],
  template: `
    <div class="content">
      <router-outlet />
    </div>
    <div class="bottom-bar">
      <ng-container *ngFor="let a of actionList$ | async">
        <div class="action" [routerLink]="a.link" [class.active]="a.active">
          <fa-icon [icon]="a.icon" />
          <div class="label">{{ a.label }}</div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-rows: 1fr auto;
        height: 100dvh;
        width: 100dvw;
      }

      .content {
        overflow: auto;
        padding: 1rem;
      }

      .bottom-bar {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
      }

      .action {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem;
      }

      .active {
        color: var(--primary-color);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileComponent {
  actionList$: Observable<BottomAction[]>;
  actionList: { label: string; link: string; icon: IconDefinition }[] = [
    { label: 'Filters', link: 'filters', icon: faFilter },
    { label: 'Payments', link: '', icon: faList },
    { label: 'Charts', link: 'charts', icon: faChartBar },
    { label: 'Settings', link: 'settings', icon: faCog },
  ];

  constructor(private app: AppService) {
    this.actionList$ = this.app.currentRoute$.pipe(
      map((route) => {
        return this.actionList.map((a) => ({
          ...a,
          active: a.link === route,
        }));
      }),
    );
  }
}
