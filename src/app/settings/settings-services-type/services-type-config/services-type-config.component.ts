import { CrudService } from './../../../services/crud.service';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-services-type-config',
  templateUrl: './services-type-config.component.html',
  styleUrls: ['./services-type-config.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServicesTypeConfigComponent implements OnInit {
  loading: boolean;

  servicesTypeForm = new FormGroup({
    id: new FormControl(null),
    label: new FormControl(null, Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<ServicesTypeConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private crud: CrudService
  ) { dialogRef.disableClose = true; }

  ngOnInit(): void {
    this.servicesTypeForm.patchValue(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.data.label = this.servicesTypeForm.value.label;
    this.data.recordName = this.servicesTypeForm.value.label;
    if (!this.servicesTypeForm.invalid) {
      this.loading = true;
      if (this.data.id) {
        this.crud.updateRecord('services-types', this.data.id, this.data).subscribe(res => {
          this.loading = false;
        });
      } else {
        this.crud.createRecord('services-types', this.data).subscribe(res => {
          this.loading = false;
        });
      }
    }
  }
}
