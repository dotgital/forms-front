import { CrudService } from './../../../services/crud.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-filter-config',
  templateUrl: './filter-config.component.html',
  styleUrls: ['./filter-config.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FilterConfigComponent implements OnInit {

  activeStep: number;
  disableSteps: number;

  filterForm = new FormGroup({
    filterName: new FormControl(null, Validators.required),
    filterType: new FormControl(null, Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<FilterConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private crud: CrudService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.activeStep = 1;
    this.filterForm.valueChanges.subscribe(res => {
      if ( res.filterName !== '') {
        this.disableSteps = 2;
      } else {
        this.disableSteps = 0;
      }
      if ( res.filterType !== null) {
        this.disableSteps = 3;
      } else {
        this.disableSteps = 2;
      }
    });
    this.getFieldSettings();
  }

  getFieldSettings() {
    this.crud.getSettings('layout', 'clients').subscribe(res => {
      console.log(res);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changeStep(e: number) {
    this.activeStep = e;
  }

}
