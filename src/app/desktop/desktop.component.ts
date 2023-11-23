import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPanelComponent } from '../containers/filter-panel.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, FilterPanelComponent, RouterOutlet, RouterLink],
  template: `
    <div class="desktop-container">
      <app-filter-panel />
      <div class="view-picker">
        <div routerLink="/">Payments</div>
        <div routerLink="/charts">Charts</div>
      </div>
      <div class="router-content">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [
    `
      .desktop-container {
        overflow: hidden;
        height: 100dvh;
        display: grid;
        grid-template-columns: 300px 1fr;
        grid-template-rows: 50px 1fr;
      }

      app-filter-panel {
        grid-column: 1;
        grid-row: 1 / 3;
        overflow: auto;
      }

      .view-picker {
        display: flex;
        gap: 1rem;
        align-items: center;
        padding: 0 1rem;
      }

      .router-content {
        overflow: auto;
        grid-column: 2;
        grid-row: 2;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopComponent {}
