import { ChangeDetectionStrategy, Component } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { notNullOrUndefined } from '../utils/utils';

@Component({
  selector: 'app-header',
  template: `
    <ng-container *ngIf="routeStr$ | async as routerStr">
      <div class="logo">AWESOME NAME HERE</div>
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

  constructor(private router: Router) {
    this.routeStr$ = this.router.events.pipe(
      map((evt) => (evt instanceof NavigationEnd ? evt.url : null)),
      filter(notNullOrUndefined),
    );
  }
}
