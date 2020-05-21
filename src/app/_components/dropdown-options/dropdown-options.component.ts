import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, Input, forwardRef } from '@angular/core';

@Component({
  selector: 'app-dropdown-options',
  templateUrl: './dropdown-options.component.html',
  styleUrls: ['./dropdown-options.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropdownOptionsComponent ),
    multi: true
  }]
})
export class DropdownOptionsComponent implements OnInit {
  visible = false;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER];
  options: string[] = [];
  isDisabled: boolean;

  @Input() data: string[];
  @Input() label: string;

  onChange = (_: string[]) => { };
  constructor() { }

  ngOnInit(): void {
  }

  writeValue(value: any): void {
    this.options = value ? value : [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void { }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
 }

  addOption(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.options.push(value.trim());
    }

    this.options.sort();

    if (input) {
      input.value = '';
    }
    this.onChange(this.options);
  }

  removeOption(option): void {
    const index = this.options.indexOf(option);

    if (index >= 0) {
      this.options.splice(index, 1);
    }
    this.onChange(this.options);
  }
}
