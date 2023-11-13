import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterOutlet],
  template: `
    <div class="container">
      <app-header />
      <div class="content">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        height: 100vh;
        display: grid;
        grid-template-rows: 50px 1fr;
      }

      .content {
        overflow: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
