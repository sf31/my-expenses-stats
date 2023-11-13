import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreService } from '../store.service';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from '@angular/cdk/dialog';
import { FilterPanelComponent } from '../components/filter-panel.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FloatingBtnComponent } from '../components/floating-btn.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FilterPanelComponent,
    RouterOutlet,
    FloatingBtnComponent,
  ],
  template: `
    <div class="filter-panel-wrapper">
      <app-filter-panel *ngIf="(isMobile$ | async) === false" />
    </div>
    <div class="content">
      <router-outlet />
    </div>

    <app-floating-btn
      *ngIf="isMobile$ | async"
      [icon]="iconFilter"
      position="left"
      (click)="openFilter()"
    />
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: auto 1fr;
        height: calc(100vh - 50px);
        overflow: hidden;
      }

      .filter-panel-wrapper,
      .content {
        overflow: auto;
      }

      .content {
        padding: 0 var(--spacing-3) var(--spacing-5) 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  isMobile$: Observable<boolean>;
  iconFilter = faFilter;

  constructor(
    private store: StoreService,
    private dialog: Dialog,
  ) {
    this.isMobile$ = this.store.select('isMobile');
  }

  openFilter(): void {
    this.dialog.open(FilterPanelComponent, { data: { isMobile: true } });
  }
}
