import { Component, OnInit, ViewChild, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Observable, ReplaySubject, Subject } from 'rxjs';

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
  options: string[] = [];
  filteredOptions: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  onDestroy = new Subject<void>();
  SearchPlaceholder = 'Search';
  defaultSelected: FormControl = new FormControl();
  defaultFilter: FormControl = new FormControl();
  isDisabled: boolean;
  @Input() data: string[];
  @Input() valueSelected: string;
  // @Input() disabled: boolean;
  @Output() changeSelected: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  onChange = (_: string) => { };
  constructor() { }

  ngOnChanges(data: SimpleChanges): void {
    this.options = this.data ? this.data : [];
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
      this.defaultSelected = value ? value : this.defaultSelected;
   }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void { }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
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
    // console.log(e)
    this.onChange(e.value);
    this.changeSelected.emit(e.value);
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

}
