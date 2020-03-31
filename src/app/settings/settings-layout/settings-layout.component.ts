import { FieldSettings } from './../../_interfaces/field-settings';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SettingsService } from './../../services/settings.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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
  fieldsNew: any[];
  showHidden: boolean;

  layoutChanged: boolean;
  fieldChanged: boolean;

  editFieldForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    label: new FormControl(null, Validators.required),
    column: new FormControl(null, Validators.required),
    position: new FormControl(null, Validators.required),
    configurable:  new FormControl(null, Validators.required),
    visible: new FormControl(null)
  });

  constructor(
    private settingService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.layoutChanged = false;
    this.fieldChanged = false;
    this.showHidden = false;
    this.getFieldSettings();
  }

  getFieldSettings() {
    this.settingService.getFieldSettings().subscribe(res => {
      // console.log(res);
      this.fields = res.fields;
      this.fieldsNew = this.fields;
      this.displayLayout();
      console.log(res);
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
    this.editFieldForm.patchValue(field);
    this.fieldChanged = false;
    this.editFieldForm.valueChanges.subscribe(() => this.fieldChanged = true);
  }

  cancelField() {
    this.editFieldForm.reset();
    this.fieldChanged = false;
  }

  saveField() {
    this.loading = true;
    const fieldName = this.editFieldForm.value.name;
    this.fieldsNew = this.fieldsNew.map((obj) => {
      if ( obj.name === fieldName ) {
        const field = {
          name: obj.name,
          label: this.editFieldForm.value.label,
          column: obj.column,
          position: obj.position,
          configurable: obj.configurable,
          custom: obj.custom,
          customNumber: obj.customNumber,
          visible: this.editFieldForm.value.visible,
        };
        return  field;
      } else {
        return obj;
      }
    });
    // console.log(this.fieldsNew);
    this.settingService.setFieldSettings(this.fieldsNew).subscribe(res => {
      this.fieldChanged = false;
      this.displayLayout();
    });
  }
}
