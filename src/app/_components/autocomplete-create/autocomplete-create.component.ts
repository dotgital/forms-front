import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, Input, SimpleChanges, OnChanges, forwardRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-autocomplete-create',
  templateUrl: './autocomplete-create.component.html',
  styleUrls: ['./autocomplete-create.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AutocompleteCreateComponent),
    multi: true
  }]
})
export class AutocompleteCreateComponent implements OnInit, OnChanges {
  @Output() selectionChanged: EventEmitter<any> = new EventEmitter();
  @Input() options: any[];
  @Input() selectedOption: string;
  @Input() isRequired: boolean;
  @Input() label: string;
  myControl = new FormControl();
  // options: string[] = ['Immigration', 'Criminal Defense', 'Family Law'];
  filteredOptions: Observable<any[]>;
  isACOpened: boolean;
  isACNew: boolean;
  isACEmpty: boolean;
  placeholder: string;

  onChange = (_: string) => { };
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.options) {
      this.myControl.patchValue('');
      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    }
    console.log(changes);
  }

  ngOnInit(): void {
    this.placeholder = 'Select';
  }

  writeValue(value: any): void {
    const formValue: string = value ? value : this.selectedOption;
    this.myControl.patchValue(formValue);
  }

  registerOnChange(fn: any): void {
    // this.myControl.valueChanges.subscribe(val => {
    //   fn(val);
    // });
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void { }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.myControl.disable();
    } else {
      this.myControl.enable();
    }
  }

  private _filter(value: string): string[] {
    // console.log(value);
    // value = value === null ? '' : value;
    let filteredValues;
    if (value !== null) {
      const filterValue = value.toLowerCase();
      filteredValues = this.options.filter(option => option.label.toLowerCase().includes(filterValue));
    } else {
      this.isACEmpty = true;
      filteredValues = this.options;
    }
    this.isACNew = filteredValues.length === 0;
    this.isACEmpty = value === '';
    return filteredValues;
  }

  clearAC() {
    this.myControl.reset();
  }

  autoCompleteOpened() {
    this.isACOpened = true;
    this.placeholder = 'Search...';
  }

  autoCompleteClosed() {
    this.isACOpened = false;
    this.placeholder = 'Select';
  }

  addNewOption() {
    this.options.push({id: null, label: this.myControl.value});
    this.isACOpened = false;
    this.isACNew = false;
  }

  onSelectionChange(event) {
    // console.log(event.option.value)
    this.selectionChanged.emit(event.option.value);
    // this.onSelectionChange(this.onChange('criminla'));
  }

}
