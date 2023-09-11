import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-floating-btn',
  template: `
    <div class="floating-btn" (click)="scrollToTop()">
      <fa-icon [icon]="iconBackToTop" />
    </div>
  `,
  styles: [
    `
      .floating-btn {
        position: absolute;
        bottom: 15px;
        right: 25px;
        padding: var(--spacing-2);
        border-radius: 50%;
        background-color: var(--accent-color);
        cursor: pointer;
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.4rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingBtnComponent {
  iconBackToTop = faArrowUp;

  constructor(private vps: ViewportScroller) {}

  // scrollToTop() {
  //   this.vps.scrollToPosition([0, 0]);
  // }
  scrollToTop(): void {
    console.log('scrollToTop');
    this.vps.scrollToPosition([0, 0]);
    // document.body.scrollTop = 0; // For Safari
    // document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    // document.body.scrollTo({ top: 0, behavior: 'smooth' });
    // window.scroll({
    //   top: 0,
    //   left: 0,
    //   // behavior: 'smooth',
    // });

    window.scrollTo(0, 0);

    return document.body.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    });
  }
}
