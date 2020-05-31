import { DeleteWarningComponent } from './../delete-warning/delete-warning.component';
import { ErrorMessagesService } from './../../services/error-messages.service';
import { CrudService } from '../../services/crud.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-fields-modal',
  templateUrl: './settings-fields-modal.component.html',
  styleUrls: ['./settings-fields-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsFieldsModalComponent implements OnInit {
  types: string[] = ['Text', 'Dropdown', 'Number', 'Date'];
  contentTypes: any[] = [{key: 'clients', label: 'Clients'}, {key: 'services', label: 'Service Info'}];
  statuses: any[] = ['new'];
  options: any[] = [];
  fieldType: string;
  private oriData: any;

  loading: boolean;
  activeStep: number;
  disableSteps: number;
  statusError: boolean;

  fieldForm = new FormGroup({
    label: new FormControl(null, Validators.required),
    type: new FormControl('Text', Validators.required),
    contentType: new FormControl(null, Validators.required),
    defaultValue: new FormControl(null),
    visible: new FormControl(null),
    required: new FormControl(null),
    dropdownOptions: new FormControl([])
  });

  constructor(
    public dialogRef: MatDialogRef<SettingsFieldsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private crud: CrudService,
    private errorMessageService: ErrorMessagesService,
    public dialog: MatDialog,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.fieldType = 'Text';
    this.getServiceType();
  }

  getServiceType() {
    if (this.data) {
      this.crud.getRecordData('settings-fields', this.data).subscribe(res => {
        this.oriData = JSON.parse(JSON.stringify(res));
        this.options = res.dropdownOptions.map(opt => opt.label);
        res.dropdownOptions = res.dropdownOptions.map(opt => opt.label);
        this.fieldForm.patchValue(res);
        console.log(this.fieldForm.value);
        // this.oriData = JSON.parse(JSON.stringify(this.fieldForm.value));
        if (res.type) {
          this.fieldType = res.type;
          this.fieldForm.get('type').disable();
        } else {
          this.fieldForm.patchValue({type: 'Text'});
        }
        if (res.contentType) { this.fieldForm.get('contentType').disable(); }
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changeFieldOptions(type) {
    this.fieldType = type.value;
    console.log(type);
  }

  changeDefaultValues(event) {
    this.options = event;
  }

  deleteField() {
    const dialogRef = this.dialog.open(DeleteWarningComponent, {
      width: '300px',
      panelClass: 'delete-warning',
      data: {label: 'Field', contentType: 'settings-fields', id: this.oriData.id},
    });

    dialogRef.beforeClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }

  onSubmit() {
    const service: any = this.fieldForm.value;
    service.recordName = this.fieldForm.value.label;
    if (this.fieldForm.value.dropdownOptions) {
      service.dropdownOptions = this.fieldForm.value.dropdownOptions.map(opt => {
        return {label: opt};
      });
    }

    if (!this.fieldForm.invalid) {
      this.loading = true;
      if (this.data) {
        this.crud.updateRecord('settings-fields', this.oriData.id, service).subscribe(res => {
          this.loading = false;
          this.dialogRef.close();
        });
      } else {
        this.crud.createRecord('settings-fields', service).subscribe(res => {
          setTimeout(() => {
            this.loading = false;
            this.dialogRef.close();
          }, 5000);
        });
      }
    } else {
      console.log(this.fieldForm.errors);
    }
  }
}
