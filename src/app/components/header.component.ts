import { ChangeDetectionStrategy, Component } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { notNullOrUndefined, randomIntFromInterval } from '../utils/utils';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import {
  faChartPie,
  faCircleDollarToSlot,
  faCoins,
  faCommentDollar,
  faMagnifyingGlassDollar,
  faSackDollar,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HelpMenuComponent } from './help-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink, HelpMenuComponent],
  template: `
    <ng-container *ngIf="routeStr$ | async as routerStr">
      <fa-icon [icon]="logo" class="logo" />
      <div class="menu">
        <div
          class="menu-item"
          *ngFor="let i of menuItems"
          [class.active]="i.route === routerStr"
          [routerLink]="i.route"
        >
          {{ i.label }}
        </div>
      </div>
      <div class="fill-remaining-space"></div>
      <app-theme-toggle />
    </ng-container>
  `,
  styles: [
    `
      :host {
        background-color: var(--primary-color);
        display: flex;
        align-items: center;
        user-select: none;
        color: #ffffff;
      }

      .logo {
        margin: 0 var(--spacing-2);
        font-size: 1.7rem;
      }

      .menu {
        display: flex;
        height: 50px;
      }

      .menu-item {
        display: flex;
        align-items: center;
        padding: 0 var(--spacing-2);
        cursor: pointer;
        color: #ffffff;
      }

      .menu-item.active {
        font-weight: bold;
        color: var(--accent-color);
        //background-color: rgba(147, 147, 147, 0.1);
      }

      .fill-remaining-space {
        flex: 1 1 auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  routeStr$?: Observable<string | null>;
  menuItems: { route: string; label: string }[] = [
    { route: '/', label: 'Payments' },
    { route: '/charts', label: 'Charts' },
    { route: '/upload', label: 'Upload' },
  ];
  logo: IconDefinition;

  icons: IconDefinition[] = [
    faCoins,
    faMagnifyingGlassDollar,
    faCircleDollarToSlot,
    faCommentDollar,
    faChartPie,
    faSackDollar,
    faWallet,
  ];

  constructor(private router: Router) {
    this.routeStr$ = this.router.events.pipe(
      map((evt) => (evt instanceof NavigationEnd ? evt.url : null)),
      filter(notNullOrUndefined),
    );
    this.logo = this.icons[randomIntFromInterval(0, this.icons.length - 1)];
  }
}
