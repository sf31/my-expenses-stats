import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowUpFromBracket,
  faChartBar,
  faCog,
  faFilter,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { map, Observable } from 'rxjs';
import { AppService } from '../app.service';
import { SettingsComponent } from '../components/settings.component';
import { CdkMenu, CdkMenuTrigger } from '@angular/cdk/menu';

type BottomAction = {
  label: string;
  link: string;
  icon: IconDefinition;
  active: boolean;
};

@Component({
  selector: 'app-mobile',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    FontAwesomeModule,
    SettingsComponent,
    CdkMenu,
    CdkMenuTrigger,
  ],
  template: `
    <div class="header-mobile shadow">
      <div class="section-name">{{ sectionName }}</div>
      <fa-icon [icon]="iconSettings" [cdkMenuTriggerFor]="settingsMenu" />
    </div>

    <div class="router-content">
      <router-outlet />
    </div>

    <div class="bottom-bar shadow">
      <ng-container *ngFor="let a of actionList$ | async">
        <div class="action" [routerLink]="a.link" [class.active]="a.active">
          <fa-icon [icon]="a.icon" />
          <div class="label">{{ a.label }}</div>
        </div>
      </ng-container>
    </div>

    <ng-template #settingsMenu>
      <app-settings cdkMenu />
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-rows: 50px auto 70px;
        height: 100dvh;
        width: 100dvw;
      }

      .header-mobile {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        font-size: 1.3rem;
      }

      .router-content {
        overflow: auto;
        padding: 1rem;
      }

      .bottom-bar {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        background-color: var(--bg-color);
      }

      .bottom-bar fa-icon {
        font-size: 1.3rem;
      }

      .action {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.7rem 0;
      }

      .active {
        color: var(--primary-color);
        font-weight: bold;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileComponent {
  actionList$: Observable<BottomAction[]>;
  actionList: {
    label: string;
    long: string;
    link: string;
    icon: IconDefinition;
  }[] = [
    { label: 'Payments', long: 'Payment List', link: '', icon: faList },
    { label: 'Charts', long: 'Charts', link: 'charts', icon: faChartBar },
    {
      label: 'Filters',
      long: 'Apply filters',
      link: 'filters',
      icon: faFilter,
    },
    {
      label: 'Import',
      long: 'Import Data',
      link: 'upload',
      icon: faArrowUpFromBracket,
    },
  ];
  sectionName = '';
  iconSettings = faCog;

  constructor(private app: AppService) {
    this.actionList$ = this.app.currentRoute$.pipe(
      map((route) => {
        return this.actionList.map((a) => {
          if (a.link === route) this.sectionName = a.long;
          return { ...a, active: a.link === route };
        });
      }),
    );
  }
}
