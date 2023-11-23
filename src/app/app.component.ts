import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DesktopComponent } from './desktop/desktop.component';
import { Observable } from 'rxjs';
import { StoreService } from './store.service';
import { MobileComponent } from './mobile/mobile.component';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DesktopComponent, MobileComponent],
  template: `
    <app-mobile *ngIf="isMobile$ | async; else mobile" />
    <ng-template #mobile> <app-desktop /> </ng-template>
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
  isMobile$: Observable<boolean>;

  constructor(
    private store: StoreService,
    private appService: AppService,
  ) {
    this.isMobile$ = this.store.select('isMobile');
  }
}
