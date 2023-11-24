import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowUpFromBracket,
  faChartBar,
  faChartPie,
  faCog,
  faFilter,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { map, Observable } from 'rxjs';
import { AppService } from '../app.service';
import { SettingsComponent } from '../components/settings.component';
import { CdkMenu, CdkMenuTrigger } from '@angular/cdk/menu';
import { StoreService } from '../store.service';

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
          <div
            class="dot"
            *ngIf="(activeFilter$ | async) && a.link === 'filters'"
          ></div>
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
        justify-content: space-around;
        align-items: center;
        background-color: var(--bg-color);
      }

      .bottom-bar fa-icon {
        font-size: 1.2rem;
      }

      .action {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .dot {
        position: absolute;
        top: 0;
        left: 70%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: var(--success-color);
      }

      .active {
        color: var(--accent-color);
        font-weight: bold;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileComponent {
  activeFilter$: Observable<boolean>;
  actionList$: Observable<BottomAction[]>;
  actionList: {
    label: string;
    long: string;
    link: string;
    icon: IconDefinition;
  }[] = [
    { label: 'Payments', long: 'Payment List', link: '', icon: faList },
    { label: 'Charts', long: 'Charts', link: 'charts', icon: faChartPie },
    {
      label: 'Filters',
      long: 'Apply filters',
      link: 'filters',
      icon: faFilter,
    },
    {
      label: 'Stats',
      long: 'Stats',
      link: 'stats',
      icon: faChartBar,
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

  constructor(
    private app: AppService,
    private store: StoreService,
  ) {
    this.activeFilter$ = this.store
      .select('filterList')
      .pipe(map((fList) => Object.keys(fList).length > 0));

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
