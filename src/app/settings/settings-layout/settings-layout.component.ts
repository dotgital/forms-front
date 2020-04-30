import { MatSidenav } from '@angular/material/sidenav';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormItem } from './../../_interfaces/form-item';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SettingsService } from './../../services/settings.service';
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

  editFieldForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    label: new FormControl(null, Validators.required),
    options: new FormControl(null),
    default:  new FormControl(null),
    fieldType: new FormControl('text'),
    visible: new FormControl(null),
    required: new FormControl(null),
  });

  constructor(
    private breakpointObserver: BreakpointObserver,
    private settingService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.editFieldForm.disable();
    this.layoutChanged = false;
    this.fieldChanged = false;
    this.showHidden = false;
    this.getFieldSettings();
  }

  getFieldSettings() {
    this.settingService.getSettings('layout', 'clients').subscribe(res => {
      console.log(res);
      // this.fields = res;
      this.fieldsNew = res;
      this.displayLayout();
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
      el.position = key;
      this.fieldsNew.push(el);
    });
    this.right.forEach((el, key) => {
      el.column = 'right';
      el.position = key;
      this.fieldsNew.push(el);
    });
    this.fieldsNew.sort((a, b) => {
      return a.position - b.position;
    });
    console.log(this.fieldsNew);
    this.layoutChanged = true;
    // console.log(this.fields)
  }

  // drop(event: CdkDragDrop < FormItem[] > ) {
  //   console.log(this.fields)
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex);
  //   }
  //   this.fieldsNew = [];
  //   this.left.forEach((el, key) => {
  //     el.column = 'left';
  //     el.position = key;
  //     this.fieldsNew.push(el);
  //   });
  //   this.right.forEach((el, key) => {
  //     el.column = 'right';
  //     el.position = key;
  //     this.fieldsNew.push(el);
  //   });
  //   this.layoutChanged = true;
  //   console.log(this.fields)
  // }

  cancelLayout() {
    this.loading = true;
    this.getFieldSettings();
    // this.fieldsNew = this.fields;
    // this.displayLayout();
    // this.layoutChanged = false;
  }

  saveLayout() {
    this.loading = true;
    console.log(this.fieldsNew);
    this.settingService.setSettings({clients: this.fieldsNew}).subscribe(res => {
      this.layoutChanged = false;
      this.loading = false;
    });
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
    // console.log(this.editFieldForm.value)
    this.loading = true;
    const fieldName = this.editFieldForm.value.name;
    this.fieldsNew = this.fieldsNew.map((obj) => {
      if ( obj.name === fieldName ) {
        obj.label = this.editFieldForm.value.label;
        obj.visible =  this.editFieldForm.value.visible;
        obj.required = this.editFieldForm.value.required;
        obj.fieldType = this.editFieldForm.value.fieldType;
        obj.default = this.editFieldForm.value.default;
        obj.options = this.editFieldForm.value.options;
      }
      return obj;
    });
    console.log(this.fieldsNew)
    this.settingService.setSettings({clients: this.fieldsNew}).subscribe(res => {
      this.fieldChanged = false;
      this.displayLayout();
    });
  }
}
