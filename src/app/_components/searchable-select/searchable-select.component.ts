import { Component, OnInit, ViewChild, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';

@Component({
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SearchableSelectComponent),
    multi: true
  }]
})
export class SearchableSelectComponent implements OnInit, OnDestroy, OnChanges {
  @Input() options: string[];
  @Input() defaultOption: string;
  @Input() label: string;
  @Input() isRequired: boolean;

  filteredOptions: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  onDestroy = new Subject<void>();
  SearchPlaceholder = 'Search';
  defaultSelected: FormControl = new FormControl();
  defaultFilter: FormControl = new FormControl();
  formLabel: string;

  @Output() changeSelected: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  onChange = (_: string) => { };

  constructor() { }

  ngOnChanges(data: SimpleChanges): void {
    this.options = this.options ? this.options : [];
    this.formLabel = this.label ? this.label : '';
    this.filterOptions();
  }

  ngOnInit(): void {
    this.defaultFilter.valueChanges
    .pipe(takeUntil(this.onDestroy))
    .subscribe((res) => {
      this.filterOptions();
    });
  }

  writeValue(value: any): void {
    const formValue: string = value ? value : this.defaultOption;
    this.defaultSelected.patchValue(formValue);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void { }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.defaultSelected.disable();
    } else {
      this.defaultSelected.enable();
    }
  }

  filterOptions() {
    if (!this.options) {
      return;
    }
    let search = this.defaultFilter.value;
    if (!search) {
      this.filteredOptions.next(this.options.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredOptions.next(
      this.options.filter(option => option.toLowerCase().indexOf(search) > -1)
    );
  }

  optionSelected(e) {
    this.onChange(e.value);
    this.changeSelected.emit(e.value);
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

}
