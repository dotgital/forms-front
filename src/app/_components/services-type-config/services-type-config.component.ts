import { ErrorMessagesService } from './../../services/error-messages.service';
import { Observable } from 'rxjs';
import { CrudService } from '../../services/crud.service';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-services-type-config',
  templateUrl: './services-type-config.component.html',
  styleUrls: ['./services-type-config.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServicesTypeConfigComponent implements OnInit {
  options: string[] = ['Immigration Law', 'Criminal Defense', 'Family Law', 'Labor Law', 'Personal Injury', 'Bankruptcy'];
  statuses: any[] = ['new'];
  types: any[];

  loading: boolean;
  activeStep: number;
  disableSteps: number;

  servicesTypeForm = new FormGroup({
    serviceType: new FormControl(null, Validators.required),
    serviceName: new FormControl(null, Validators.required),
    serviceStatuses: new FormControl(null)
  });

  constructor(
    public dialogRef: MatDialogRef<ServicesTypeConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private crud: CrudService,
    private errorMessageService: ErrorMessagesService,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log(this.data);
    this.activeStep = 1;
    this.servicesTypeForm.patchValue(this.data);
    // this.servicesTypeForm.valueChanges.subscribe(res => {
    //   console.log(res);
    // });
    // this.servicesTypeForm.patchValue(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changeStep(e: number) {
    this.servicesTypeForm.markAllAsTouched();
    if (!this.servicesTypeForm.invalid) {
      this.activeStep = e;
    } else {
      this.errorMessageService.showError('Please check for any error before leave this tab');
    }
  }

  onSubmit() {
    console.log(this.data);
    const service: any = this.servicesTypeForm.value;
    service.recordName = this.servicesTypeForm.value.serviceName;
    if (!this.servicesTypeForm.invalid) {
      this.loading = true;
      if (this.data.id) {
        this.crud.updateRecord('services-types', this.data.id, service).subscribe(res => {
          this.loading = false;
        });
      } else {
        this.crud.createRecord('services-types', service).subscribe(res => {
          this.loading = false;
        });
      }
    }
  }
}
