import { Observable, ReplaySubject, Subject } from 'rxjs';
import { FormItem } from './../../_interfaces/form-item';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from './../../services/settings.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith, take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-settings-layout',
  templateUrl: './settings-layout.component.html',
  styleUrls: ['./settings-layout.component.scss']
})
export class SettingsLayoutComponent implements OnInit {
  loading = true;
  left = [];
  right = [];
  fields: any[];
  fieldType: string;
  fieldsNew: FormItem[];
  showHidden: boolean;
  formItem: FormItem = {
    name: null,
    label: null,
    default: null,
    type: null,
    required: null,
    column: null,
    position: null,
    visible: null,
    related: null,
    fieldType: null,
    options: null,
  };

  defaultValue: string;

  SearchPlaceholder = 'Search';
  visible = false;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER];
  options: string[] = [];
  // filteredOptions: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

  // onDestroy = new Subject<void>();

  layoutChanged: boolean;
  fieldChanged: boolean;

  editFieldForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    label: new FormControl(null, Validators.required),
    // column: new FormControl(null, Validators.required),
    options: new FormControl(null),
    default:  new FormControl(null),
    fieldType: new FormControl('text'),
    visible: new FormControl(null),
    required: new FormControl(null),
  });

  // public defaultFilter: FormControl = new FormControl();

  // @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  constructor(
    private settingService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.editFieldForm.disable();
    this.layoutChanged = false;
    this.fieldChanged = false;
    this.showHidden = false;
    this.fieldType = 'text';
    this.getFieldSettings();
    // this.defaultFilter.valueChanges
    // .pipe(takeUntil(this.onDestroy))
    // .subscribe((res) => {
    //   this.filterBanks();
    // });
  }

  // filterBanks() {
  //   if (!this.options) {
  //     return;
  //   }
  //   // get the search keyword
  //   let search = this.defaultFilter.value;
  //   if (!search) {
  //     this.filteredOptions.next(this.options.slice());
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   // filter the banks
  //   this.filteredOptions.next(
  //     this.options.filter(option => option.toLowerCase().indexOf(search) > -1)
  //   );
  // }

  getFieldSettings() {
    this.settingService.getFieldSettings().subscribe(res => {
      console.log(res);
      this.fields = res;
      this.fieldsNew = this.fields;
      this.displayLayout();
      // console.log(res);
    });
  }

  displayLayout() {
    this.left = this.fieldsNew.filter(obj => obj.column === 'left');
    this.right = this.fieldsNew.filter(obj => obj.column === 'right');
    this.loading = false;
  }

  toggleHidden() {
    this.showHidden = !this.showHidden;
    console.log(this.showHidden);
  }

  drop(event: CdkDragDrop < string[] > ) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.fieldsNew = [];
    this.left.forEach((el, key) => {
      el.column = 'left';
      el.position = key;
      this.fieldsNew.push(el);
    });
    this.right.forEach((el, key) => {
      el.column = 'right';
      el.position = key;
      this.fieldsNew.push(el);
    });
    this.layoutChanged = true;
  }

  cancelLayout() {
    this.loading = true;
    this.fieldsNew = this.fields;
    this.displayLayout();
    this.layoutChanged = false;
  }

  saveLayout() {
    this.loading = true;
    this.settingService.setFieldSettings(this.fieldsNew).subscribe(res => {
      this.layoutChanged = false;
      this.loading = false;
    });
  }

  editField(field) {
    this.editFieldForm.enable();
    this.editFieldForm.patchValue(field);
    this.fieldType = field.fieldType;
    this.options = field.options;
    this.fieldChanged = false;
    this.defaultValue = field.default;
    this.editFieldForm.valueChanges.subscribe(() => this.fieldChanged = true);
  }

  cancelField() {
    this.editFieldForm.reset();
    this.fieldChanged = false;
  }

  setDefaultValue(e){
    this.editFieldForm.patchValue({default: e});
    console.log(e)
  }

  saveField() {
    console.log(this.editFieldForm.value)
    this.loading = true;
    const fieldName = this.editFieldForm.value.name;
    this.fieldsNew = this.fieldsNew.map((obj) => {
      if ( obj.name === fieldName ) {
        obj.label = this.editFieldForm.value.label;
        obj.visible =  this.editFieldForm.value.visible;
        obj.required = this.editFieldForm.value.required;
        obj.fieldType = this.editFieldForm.value.fieldType;
        obj.default = this.editFieldForm.value.default;
        obj.options = this.options;
      }
      return obj;
    });
    this.settingService.setFieldSettings(this.fieldsNew).subscribe(res => {
      this.fieldChanged = false;
      this.displayLayout();
    });
  }



  addOption(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    this.fieldChanged = true;

    // Add our fruit
    if ((value || '').trim()) {
      this.options.push(value.trim());
    }

    this.options.sort();

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeOption(option): void {
    const index = this.options.indexOf(option);
    this.fieldChanged = true;

    if (index >= 0) {
      this.options.splice(index, 1);
    }
  }

  // ngOnDestroy() {
  //   this.onDestroy.next();
  //   this.onDestroy.complete();
  // }
}
