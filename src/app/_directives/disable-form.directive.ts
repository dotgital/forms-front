import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDisableForm]'
})
export class DisableFormDirective {

  @Input() set appDisableForm( condition: boolean ) {
    const action = condition ? 'disable' : 'enable';
    this.ngControl.control[action]();
  }

  constructor(
    private ngControl: NgControl
  ) {}

}
