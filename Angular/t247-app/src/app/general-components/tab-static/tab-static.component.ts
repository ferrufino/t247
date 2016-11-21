import { Component, Input } from '@angular/core';

@Component({
    selector: 'tab-static',
    styles: [`
    .pane{
      padding: 1em;
    }
  `],
    template: `
    <div [hidden]="!active" class="pane">
      <ng-content></ng-content>
    </div>
  `
})
export class TabStatic {
    @Input('tabTitle') title: string;
    @Input() active = false;
}