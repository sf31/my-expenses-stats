import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnComponent } from './btn.component';
import { AppService } from '../app.service';

@Component({
  selector: 'app-no-data',
  standalone: true,
  imports: [CommonModule, BtnComponent],
  template: `
    Mmmh... Seems like there is no data to show.
    <app-btn (click)="uploadData()"> Upload your data! </app-btn>
  `,
  styles: [
    `
      :host {
        margin-top: var(--spacing-5);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-2);
        color: var(--accent-color);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoDataComponent {
  constructor(private app: AppService) {}

  uploadData(): void {
    this.app.toggleUploadDialog();
  }
}
