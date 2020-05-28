import { CrudService } from './../../services/crud.service';
import { MatSidenav } from '@angular/material/sidenav';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormItem } from './../../_interfaces/form-item';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-settings-layout',
  templateUrl: './settings-layout.component.html',
  styleUrls: ['./settings-layout.component.scss']
})
export class SettingsLayoutComponent implements OnInit {
  @ViewChild('sidebar') rightSide: MatSidenav;
  loading = true;
  left = [];
  right = [];
  hidden = [];
  sidebarOpened: boolean = true;
  contentType: string;
  // fields: FormItem[] = [];
  fieldsNew: FormItem[];
  showHidden: boolean;
  defaultValue: string;
  options: string[] = [];
  layoutChanged: boolean;
  fieldChanged: boolean;
  fieldType: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  formItem: FormItem = {
    fieldName: null,
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

  editFieldForm = new FormGroup({
    fieldName: new FormControl(null, Validators.required),
    label: new FormControl(null, Validators.required),
    options: new FormControl(null),
    default:  new FormControl(null),
    fieldType: new FormControl('text'),
    visible: new FormControl(null),
    required: new FormControl(null),
  });

  constructor(
    private breakpointObserver: BreakpointObserver,
    private crud: CrudService,
  ) {}

  ngOnInit(): void {
    this.contentType = 'clients';
    this.editFieldForm.disable();
    this.layoutChanged = false;
    this.fieldChanged = false;
    this.showHidden = false;
    this.getFieldSettings();
  }

  getFieldSettings() {
    // const contentType = 'clients';
    const query = `contentType=${this.contentType}`;
    this.crud.getRecordList('settings-fields', query).subscribe(res => {
      console.log(res);
      this.fieldsNew = res;
      this.displayLayout();
    });
  }

  chageVisibility(field) {
    field.column = 'hidden';
    field.visible = !field.visible;
    return field;
  }

  switchContentType(item) {
    this.contentType = item.value;
    this.getFieldSettings();
    console.log(item);
  }
  // getFieldSettings() {
  //   this.crud.getSettings('layout', 'clients').subscribe(res => {
  //     // this.fields = res;
  //     this.fieldsNew = res;
  //     this.displayLayout();
  //   });
  // }

  sidebarToogle(op){
    this.rightSide.toggle();
    this.sidebarOpened = op === 'open' ? true : false;
  }

  displayLayout() {
    this.left = this.fieldsNew.filter(obj => (obj.column === 'left' || obj.column === null));
    this.right = this.fieldsNew.filter(obj => obj.column === 'right');
    this.hidden = this.fieldsNew.filter(obj => obj.visible !== true );
    console.log(this.hidden);
    this.loading = false;
  }

  toggleHidden() {
    this.showHidden = !this.showHidden;
  }

  drop(event: CdkDragDrop<string[]>) {
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
      el.visible = true;
      el.position = key;
      this.fieldsNew.push(el);
    });

    this.right.forEach((el, key) => {
      el.column = 'right';
      el.visible = true;
      el.position = key;
      this.fieldsNew.push(el);
    });

    this.hidden.forEach((el, key) => {
      el.column = 'hidden';
      el.visible = false;
      el.position = key;
      this.fieldsNew.push(el);
    });

    this.fieldsNew.sort((a, b) => {
      return a.position - b.position;
    });
    this.layoutChanged = true;
  }

  cancelLayout() {
    this.loading = true;
    this.getFieldSettings();
  }

  saveLayout() {
    this.loading = true;
    this.crud.updateRecordCustom('settings-fields/multiple', this.fieldsNew).subscribe(res => {
      this.layoutChanged = false;
      this.loading = false;
    });
    // this.crud.updateRecord('global-preferences', '', {clients: this.fieldsNew}).subscribe(res => {
    //   this.layoutChanged = false;
    //   this.loading = false;
    // });
  }

  editField(field) {
    this.rightSide.open();
    this.editFieldForm.enable();
    this.editFieldForm.patchValue(field);
    this.fieldType = field.fieldType;
    this.options = field.options;
    this.fieldChanged = false;
    // this.defaultValue = field.default;
    this.editFieldForm.valueChanges.subscribe(() => this.fieldChanged = true);
  }

  cancelField() {
    this.editFieldForm.reset();
    this.fieldChanged = false;
  }

  saveField() {
    this.loading = true;
    const fieldName = this.editFieldForm.value.fieldName;
    this.fieldsNew = this.fieldsNew.map((obj) => {
      if ( obj.fieldName === fieldName ) {
        obj.label = this.editFieldForm.value.label;
        obj.visible =  this.editFieldForm.value.visible;
        obj.required = this.editFieldForm.value.required;
        obj.fieldType = this.editFieldForm.value.fieldType;
        obj.default = this.editFieldForm.value.default;
        obj.options = this.editFieldForm.value.options;
      }
      return obj;
    });
    this.crud.updateRecord('global-preferences', '', {clients: this.fieldsNew}).subscribe(res => {
      this.fieldChanged = false;
      this.displayLayout();
    });
  }
}
