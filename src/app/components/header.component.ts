import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <div class="logo">AWESOME NAME HERE</div>
    <div class="menu">
      <div class="menu-item" routerLink="">Payments</div>
      <div class="menu-item" routerLink="charts">Charts</div>
      <div class="menu-item" routerLink="upload">Upload</div>
    </div>
  `,
  styles: [
    `
      :host {
        background-color: var(--primary-color);
        display: flex;
        align-items: center;
        padding: 0 var(--spacing-2);
        user-select: none;
      }

      .menu {
        display: flex;
      }

      .menu-item {
        padding: 0 var(--spacing-2);
        cursor: pointer;
        color: var(--bg-color);
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
