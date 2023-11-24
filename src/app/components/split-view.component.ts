import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-split-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="left" [style.width.px]="leftPosition">
      <ng-content select="[left]"></ng-content>
    </div>
    <div class="drag-handle" (mousedown)="onHandlerMouseDown($event)">
      <div class="handle"></div>
    </div>
    <div class="right">
      <ng-content select="[right]"></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: auto 20px 1fr;
        height: 100%;
      }

      .left,
      .right {
        overflow: auto;
        height: 100%;
      }

      .drag-handle {
        cursor: col-resize;
        width: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .handle {
        height: 50px;
        width: 5px;
        background-color: var(--disabled-color);
        border-radius: var(--radius-2);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitViewComponent {
  dragEnabled = false;
  leftPosition?: number;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.dragEnabled) return;
    if (event.clientX < 0 || event.clientX > window.innerWidth) return;
    this.leftPosition = event.clientX - 10;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp() {
    this.dragEnabled = false;
  }

  onHandlerMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.dragEnabled = true;
  }
}
