import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DesktopComponent } from './desktop/desktop.component';
import { combineLatest, map, Observable } from 'rxjs';
import { StoreService } from './store.service';
import { MobileComponent } from './mobile/mobile.component';
import { DesktopComponent2 } from './desktop/desktop2.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DesktopComponent,
    MobileComponent,
    DesktopComponent2,
  ],
  template: `
    <ng-container *ngIf="view$ | async as view">
      <app-mobile *ngIf="view.isMobile" />
      <app-desktop *ngIf="!view.isMobile && view.desktopView === 'tabs'" />
      <app-desktop2 *ngIf="!view.isMobile && view.desktopView === 'split'" />
    </ng-container>
  `,
  styles: [
    `
      :host {
        height: 100dvh;
        width: 100dvw;
        overflow: hidden;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  view$: Observable<{
    isMobile: boolean;
    desktopView: 'tabs' | 'split';
  }>;

  constructor(private store: StoreService) {
    this.view$ = combineLatest([
      this.store.select('isMobile'),
      this.store.select('desktopView'),
    ]).pipe(map(([isMobile, desktopView]) => ({ isMobile, desktopView })));
  }
}
