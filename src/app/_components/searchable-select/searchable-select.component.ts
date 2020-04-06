import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Component, OnInit, ViewChild, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Component({
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.scss']
})
export class SearchableSelectComponent implements OnInit, OnDestroy, OnChanges {
  options: string[] = [];
  filteredOptions: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  onDestroy = new Subject<void>();
  SearchPlaceholder = 'Search';
  defaultSelected: FormControl = new FormControl();
  defaultFilter: FormControl = new FormControl();
  @Input() data: string[];
  @Input() valueSelected: string;
  @Output() changeSelected: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  constructor() { }

  ngOnChanges(data: SimpleChanges): void {
    console.log(this.valueSelected);
    this.options = this.data ? this.data : [];
    this.defaultSelected.setValue(this.valueSelected);
    // this.default = this.value ? this.value : '';
    this.filterOptions();
  }

  ngOnInit(): void {
    this.defaultFilter.valueChanges
    .pipe(takeUntil(this.onDestroy))
    .subscribe((res) => {
      this.filterOptions();
    });
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
    this.changeSelected.emit(e.value);
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

}
