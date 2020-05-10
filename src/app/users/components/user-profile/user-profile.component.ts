import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnChanges {
  @Input() recordData: any;
  @Output() dataUpdated: EventEmitter<any> = new EventEmitter();
  @Output() userChanged: EventEmitter<any> = new EventEmitter();

  public hide = true;
  public creating: boolean;

  profileForm = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    phoneNumber: new FormControl(null),
    office: new FormControl(null),
    jobPosition: new FormControl(null),
    email: new FormControl(null, [Validators.required, Validators.email]),
    recordName: new FormControl(null, Validators.required),
  });

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.creating = false;
    if ( this.recordData ) {
      this.profileForm.removeControl('username');
      this.profileForm.removeControl('password');
      this.profileForm.patchValue(this.recordData);
      this.profileForm.disable();
    } else {
      this.creating = true;
    }
  }

  ngOnInit(): void {
  }

  editForm() {
    this.profileForm.controls['firstName'].enable();
    this.profileForm.controls['lastName'].enable();
    this.profileForm.controls['recordName'].enable();
    this.profileForm.controls['phoneNumber'].enable();
    this.profileForm.controls['office'].enable();
    this.profileForm.controls['jobPosition'].enable();
  }

  generatePassword() {
    const pass = Math.random().toString(36).slice(-12);
    this.profileForm.patchValue({password: pass});
  }

  checkIfValid() {
    // Generating User Name and Record Name
    const username = this.profileForm.value.email;
    const recordName = `${this.profileForm.value.firstName} ${this.profileForm.value.lastName}`;
    this.profileForm.patchValue({username});
    this.profileForm.patchValue({recordName});

    // Check if form is valid and return data or error
    this.profileForm.markAllAsTouched();
    if (!this.profileForm.invalid) {
      this.userChanged.emit({error: false, data: this.profileForm.value, profileValid: true});
      this.profileForm.disable();
    } else {
      this.userChanged.emit({error: true, data: null});
    }
  }
}
