import { NG_VALUE_ACCESSOR, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';

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

  optionsForm = new FormGroup({
    dropdownOptions: new FormControl(null)
  });

  @Input() data: string[];
  @Input() label: string;
  @Input() color: string;
  @Output() optionChanged: EventEmitter<string[]> = new EventEmitter()

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
    this.optionChanged.emit(this.options);

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
    this.optionChanged.emit(this.options);
    this.onChange(this.options);
  }
}
