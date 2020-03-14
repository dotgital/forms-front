import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { FieldSettings } from './../../_interfaces/field-settings';
import { Component, EventEmitter, OnInit, Input, OnDestroy, Output } from '@angular/core';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit, OnDestroy {
  @Input() field: Subject<FieldSettings>;
  @Output() saveFieldEvent = new EventEmitter<FieldSettings>();

  fieldValue: FieldSettings;
  formChanged: boolean;

  editFieldForm = new FormGroup({
    label: new FormControl(null, Validators.required)
  });

  constructor(
  ) { }

  ngOnInit(): void {
    this.field.subscribe(res => {
      this.fieldValue = res;
      this.editFieldForm.patchValue(this.fieldValue);
      this.onChanges();
    });
  }

  onChanges(): void {
    this.editFieldForm.valueChanges.subscribe(val => {
      this.formChanged = true;
    });
  }

  cancelEdit() {
    this.editFieldForm.patchValue(this.fieldValue);
    this.formChanged = false;
  }

  saveField(){
    this.formChanged = false;
    this.saveFieldEvent.emit(this.editFieldForm.value);
  }

  ngOnDestroy(): void {
    this.field.unsubscribe();
  }
}
