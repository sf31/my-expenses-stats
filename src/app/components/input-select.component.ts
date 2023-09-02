import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-input-select',
  template: ` <p>input-select works!</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSelectComponent {
  constructor() {}
}
