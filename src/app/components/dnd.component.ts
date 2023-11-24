import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnComponent } from './btn.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dnd',
  standalone: true,
  imports: [CommonModule, BtnComponent, HttpClientModule],
  template: `
    <div *ngIf="!isMobile" class="dnd-area" [class.file-over]="isFileOver">
      <div class="label">Drag here your files</div>
      <div>or</div>
      <app-btn (click)="fileInput.click()"> Browse files </app-btn>
    </div>

    <div class="mobile-file" *ngIf="isMobile" (click)="fileInput.click()">
      Tap here to select files
    </div>

    <input
      style="display: none"
      multiple
      #fileInput
      type="file"
      (change)="onFileBrowsed($event)"
    />
  `,
  styles: [
    `
      .dnd-area {
        width: 320px;
        height: 250px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-5);
      }

      .file-over {
        background-color: var(--accent-color);
      }

      .mobile-file {
        padding: var(--spacing-4);
        font-size: 1.3rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-1);
        background-color: var(--border-color);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DndComponent {
  @Input() isMobile?: boolean;
  @Output() filesDrop = new EventEmitter<File[]>();
  isFileOver?: boolean;

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isFileOver = false;
    if (event.dataTransfer?.items) {
      const files: File[] = [];
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i].kind === 'file') {
          const file = event.dataTransfer.items[i].getAsFile();
          if (file) files.push(file);
        }
      }
      event.dataTransfer.items.clear();
      this.filesDrop.emit(files);
    } else {
      const files = event.dataTransfer?.files;
      event.dataTransfer?.clearData();
      if (files) this.filesDrop.emit(Array.from(files));
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isFileOver = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isFileOver = false;
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: DragEvent) {
    event.preventDefault();
    this.isFileOver = true;
  }

  onFileBrowsed(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) this.filesDrop.emit(Array.from(files));
  }
}
