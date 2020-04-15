import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnChanges {
  @Input() recordData: any;
  public editing: boolean;
  public creating: boolean;
  private oriData: any;
  public dataChanged: boolean;

  profileForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
  });

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.creating = this.recordData ? false : true;
    if ( this.recordData ) {
      this.profileForm.patchValue(this.recordData);
      this.oriData = this.profileForm.value;
      this.profileForm.disable();
    }
  }

  ngOnInit(): void {
    this.profileForm.valueChanges.subscribe(res => {
      if (this.oriData) {
        if (JSON.stringify(this.oriData) !== JSON.stringify(this.profileForm.value)) {
          this.dataChanged = true;
        } else {
          this.dataChanged = false;
        }
      }
    });
  }

  enableForm() {
    this.editing = true;
    this.profileForm.enable();
  }

  cancelForm() {
    this.editing = false;
    this.profileForm.patchValue(this.recordData);
    this.profileForm.disable();
  }

  submitData() {
    console.log('submitted')
  }
}
