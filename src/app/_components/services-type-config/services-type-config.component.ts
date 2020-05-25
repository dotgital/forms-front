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
  private oriData: any;

  loading: boolean;
  activeStep: number;
  disableSteps: number;
  statusError: boolean;

  servicesTypeForm = new FormGroup({
    serviceType: new FormControl(null, Validators.required),
    serviceName: new FormControl(null, Validators.required),
    serviceStatuses: new FormControl(null, Validators.required)
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
    this.getServiceType();
    this.activeStep = 1;
  }

  getServiceType() {
    if (this.data) {
      this.crud.getRecordData('settings-services-templates', this.data).subscribe(res => {
        this.oriData = JSON.parse(JSON.stringify(res));
        console.log(this.oriData)
        res.serviceStatuses = res.status ? res.status.map(status => status.label) : this.statuses;
        this.servicesTypeForm.patchValue(res);
        // this.oriData = JSON.parse(JSON.stringify(this.servicesTypeForm.value));
        if (res.serviceName) { this.servicesTypeForm.get('serviceName').disable(); }
        if (res.serviceType) { this.servicesTypeForm.get('serviceType').disable(); }
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changeStep(e: number) {

    if (e !== 1 && this.activeStep === 1 ) {
      this.servicesTypeForm.get('serviceType').markAsTouched();
      this.servicesTypeForm.get('serviceName').markAsTouched();

      if (this.servicesTypeForm.get('serviceName').hasError('required') || this.servicesTypeForm.get('serviceType').hasError('required')) {
        this.errorMessageService.showError('Please check for any error before leave this tab');
      } else {
        this.activeStep = e;
      }
    }

    if (e !== 2 && this.activeStep === 2 ) {
      this.statusError = false;
      this.servicesTypeForm.get('serviceStatuses').markAsTouched();

      if (this.servicesTypeForm.get('serviceStatuses').hasError('required')) {
        this.statusError = true;
        this.errorMessageService.showError('Please check for any error before leave this tab');
      } else {
        this.activeStep = e;
      }
    }

    // console.log(this.servicesTypeForm.controls['serviceName'].hasError('required'));
    // // this.servicesTypeForm.markAllAsTouched();
    // if (this.servicesTypeForm.pristine) {
    //   this.activeStep = e;
    // } else {
    //   this.errorMessageService.showError('Please check for any error before leave this tab');
    // }
  }

  onSubmit() {
    const service: any = this.servicesTypeForm.value;
    service.recordName = this.servicesTypeForm.value.serviceName;
    service.status = this.servicesTypeForm.value.serviceStatuses.map(status => {
      return {label: status};
    });

    if (!this.servicesTypeForm.invalid) {
      this.loading = true;
      if (this.data) {
        this.crud.updateRecord('settings-services-templates', this.data, service).subscribe(res => {
          this.loading = false;
          this.crud.createActivityRecord(res.id, res, this.oriData);
          this.dialogRef.close();
        });
      } else {
        this.crud.createRecord('settings-services-templates', service).subscribe(res => {
          this.loading = false;
          this.crud.createActivityRecord(res.id, res, '');
          this.dialogRef.close();
        });
      }
    } else {
      console.log(this.servicesTypeForm.errors);
    }
  }
}
