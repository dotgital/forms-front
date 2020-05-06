import { CrudService } from './../../services/crud.service';
import { AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  forwardRef,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

import { Option } from './demo-data';

@Component({
  selector: 'app-searchable-select-multiple',
  templateUrl: './searchable-select-multiple.component.html',
  styleUrls: ['./searchable-select-multiple.component.scss'],
  encapsulation : ViewEncapsulation.None,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SearchableSelectMultipleComponent),
    multi: true
  }]
})
export class SearchableSelectMultipleComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  protected options: any[] = [];

  /** control for the selected option for multi-selection */
  public optionMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public optionMultiFilterCtrl: FormControl = new FormControl();

  /** list of options filtered by search keyword */
  public filteredOptionsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();


  onChange = (_: string) => { };
  constructor(
    private crud: CrudService,
  ) { }

  ngOnChanges(data: SimpleChanges): void {
    // this.options = this.options ? this.options : [];
    // this.formLabel = this.label ? this.label : '';
    // this.filterOptions();
  }

  ngOnInit() {
    // set initial selection
    // this.optionMultiCtrl.setValue([this.options[10], this.options[11], this.options[12]]);

    // load the initial option list
    const query = `query{
      users{
        id
        firstName
        lastName
      }
    }`;
    this.crud.graphQl(query).subscribe(res => {
      this.options = res.data.users.map(user => {
        const id = user.id;
        const name = `${user.firstName} ${user.lastName}`;
        return {id, name};
      });
      this.filteredOptionsMulti.next(this.options.slice());
    });


    // listen for search field value changes
    this.optionMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOptionsMulti();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  writeValue(value: any): void {
    if (value) {
      value = value.map(user => {
        const id = user.id;
        const name = `${user.firstName} ${user.lastName}`;
        return {id, name};
      });
      this.optionMultiCtrl.patchValue(value);
    } else {
      this.optionMultiCtrl.patchValue([]);
    }
    // const formValue: string = value ? value : this.defaultOption;
    // this.defaultSelected.patchValue(formValue);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.optionMultiCtrl.disable();
    } else {
      this.optionMultiCtrl.enable();
    }
  }

  /**
   * Sets the initial value after the filteredOptions are loaded initially
   */
  protected setInitialValue() {
    this.filteredOptionsMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: Option, b: Option) => a && b && a.id === b.id;
      });
  }

  protected filterOptionsMulti() {
    if (!this.options) {
      return;
    }
    // get the search keyword
    let search = this.optionMultiFilterCtrl.value;
    if (!search) {
      this.filteredOptionsMulti.next(this.options.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the options
    this.filteredOptionsMulti.next(
      this.options.filter(option => option.firstName.toLowerCase().indexOf(search) > -1)
    );
  }

  optionSelected(e) {
    const usersId = e.value.map(el => el.id);
    this.onChange(usersId);
  }
}
