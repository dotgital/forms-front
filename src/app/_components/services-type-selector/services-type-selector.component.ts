import { CrudService } from './../../services/crud.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-services-type-selector',
  templateUrl: './services-type-selector.component.html',
  styleUrls: ['./services-type-selector.component.scss']
})
export class ServicesTypeSelectorComponent implements OnInit {
  types: string[] = ['Immigration Law', 'Criminal Defense', 'Family Law', 'Labor Law', 'Personal Injury', 'Bankruptcy'];
  names: any[] = [];
  loading: boolean;
  selectedType: any;

  servicesTypeSelectorForm = new FormGroup({
    serviceType: new FormControl(null, Validators.required),
    serviceName: new FormControl(null, Validators.required),
  });

  constructor(
    public dialogRef: MatDialogRef<ServicesTypeSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private crud: CrudService,
    ) { }

  ngOnInit(): void {
    this.servicesTypeSelectorForm.get('serviceName').disable();
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getServiceName(event) {
    console.log(event);
    const query = `serviceType=${event.value}`;
    this.crud.getRecordList('settings-services-templates', query).subscribe(res => {
      this.names = res;
      this.servicesTypeSelectorForm.get('serviceName').enable();
    });
  }

  onSubmit() {
    this.loading = true;
    const data = {
      template: this.servicesTypeSelectorForm.value.serviceName.id,
      client: this.data,
      name: this.servicesTypeSelectorForm.value.serviceName.serviceName,
      recordName: this.servicesTypeSelectorForm.value.serviceName.serviceName
    };

    this.crud.createRecord('services', data).subscribe(res => {
      console.log(res);
      this.loading = false;
      this.dialogRef.close();
    });
  }

}
