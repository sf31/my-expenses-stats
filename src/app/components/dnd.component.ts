import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-dnd',
  template: `
    <div class="dnd-area" [class.file-over]="isFileOver">
      <div class="label">Drag here your files</div>
      <div>or</div>
      <app-btn (click)="fileInput.click()"> Browse files </app-btn>
      <input
        style="display: none"
        multiple
        #fileInput
        type="file"
        (change)="onFileBrowsed($event)"
      />
    </div>
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DndComponent {
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