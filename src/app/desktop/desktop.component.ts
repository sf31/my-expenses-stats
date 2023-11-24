import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPanelComponent } from '../containers/filter-panel.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SettingsComponent } from '../components/settings.component';
import { CdkMenu, CdkMenuTrigger } from '@angular/cdk/menu';
import { map, Observable } from 'rxjs';
import { AppService } from '../app.service';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [
    CommonModule,
    FilterPanelComponent,
    RouterOutlet,
    RouterLink,
    FontAwesomeModule,
    SettingsComponent,
    CdkMenuTrigger,
    CdkMenu,
  ],
  template: `
    <div class="desktop-container">
      <div class="header">
        <div
          *ngFor="let i of headerItemList$ | async"
          class="router-item"
          [class.active]="i.active"
          [routerLink]="i.link"
        >
          {{ i.label }}
        </div>
        <div class="fill-remaining-space"></div>
        <div (click)="uploadData()">Upload data</div>
        <div [cdkMenuTriggerFor]="settingsMenu">
          <fa-icon [icon]="iconSettings" />
        </div>
      </div>

      <div class="content">
        <div class="left">
          <div class="title">Filters</div>
          <app-filter-panel />
        </div>
        <div class="router-content">
          <router-outlet />
        </div>
      </div>
    </div>

    <ng-template #settingsMenu>
      <app-settings cdkMenu />
    </ng-template>
  `,
  styles: [
    `
      .desktop-container {
        overflow: hidden;
        height: 100dvh;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 50px 1fr;
        color: #ffffff;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0 1rem;
        background-color: var(--primary-color);
      }

      .content {
        display: grid;
        grid-template-columns: 300px 1fr;
        grid-template-rows: 1fr;
        overflow: auto;
      }

      .header > div {
        cursor: pointer;
      }

      .router-item {
        border: 2px solid var(--primary-color);
        padding: 0.5rem 0;
        &.active {
          border-bottom: 2px solid #ffffff;
          font-weight: bold;
        }
      }

      .left {
        grid-column: 1 / 2;
        overflow: auto;
        padding: 1rem 0 1rem 1rem;
      }

      .left > div {
        margin-bottom: 2rem;
      }

      .router-content {
        overflow: auto;
        grid-column: 2 / 3;
        padding: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopComponent {
  iconSettings = faCog;
  headerItemList$: Observable<
    { label: string; link: string; active: boolean }[]
  >;

  constructor(private app: AppService) {
    this.headerItemList$ = this.app.currentRoute$.pipe(
      map((route) => {
        return [
          { label: 'Payments List', link: '', active: route === '' },
          { label: 'Charts', link: 'charts', active: route === 'charts' },
          { label: 'Stats', link: 'stats', active: route === 'stats' },
        ];
      }),
    );
  }

  uploadData(): void {
    this.app.toggleUploadDialog();
  }
}
