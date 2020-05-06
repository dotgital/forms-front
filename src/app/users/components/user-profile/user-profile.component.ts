import { ErrorMessagesService } from 'src/app/services/error-messages.service';
import { CrudService } from './../../../services/crud.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() recordData: any;
  // @Output() formChanged: EventEmitter<boolean> = new EventEmitter();
  // @Output() dataCreated: EventEmitter<any> = new EventEmitter();
  @Output() dataUpdated: EventEmitter<any> = new EventEmitter();

  @Output() profileChange: EventEmitter<any> = new EventEmitter();

  // public editing: boolean;
  public creating: boolean;
  private oriData: any;
  // public formChanged: boolean;

  profileForm = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    recordName: new FormControl(null, Validators.required),
  });

  constructor(
    private crud: CrudService,
    private errorMessageService: ErrorMessagesService,
  ) { }

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

  ngAfterViewInit(): void {
    this.profileForm.valueChanges.subscribe(res => {
      if (this.oriData) {
        if (JSON.stringify(this.oriData) !== JSON.stringify(this.profileForm.value)) {
          this.profileChange.emit({formChanged: true});
          // this.formChanged.emit(true);
        } else {
          // this.formChanged.emit(false);
          this.profileChange.emit({formChanged: false});
        }
      }
    });
  }

  ngOnInit(): void {
  }

  editForm() {
    this.profileForm.controls['firstName'].enable();
    this.profileForm.controls['lastName'].enable();
    this.profileForm.controls['recordName'].enable();
    this.oriData = this.profileForm.value;
  }

  generatePassword() {
    const pass = Math.random().toString(36).slice(-12);
    this.profileForm.patchValue({password: pass});
  }

  createUser() {
    // Generating User Name and Record Name
    const username = this.profileForm.value.email;
    const recordName = `${this.profileForm.value.firstName} ${this.profileForm.value.lastName}`;
    this.profileForm.patchValue({username});
    this.profileForm.patchValue({recordName});

    // Touch all controls to show any error
    this.profileForm.markAllAsTouched();

    if (!this.profileForm.invalid) {
      // Emit to parent to start loading overlay
      // this.dataCreated.emit({ loading: true });
      this.crud.createRecord('users', this.profileForm.value).subscribe(record => {
        this.profileChange.emit( {dataCreated: true, recordId: record['id'] } );
      }, err => {
        this.profileChange.emit( {dataCreated: false, error: true} );
        if (err[0].messages[0].field.includes('username')) {
          this.errorMessageService.showError('This email address is already taken');
        }
      });
    }
  }

  updateUser() {
    // Touch all controls to show any error
    this.profileForm.markAllAsTouched();

    if (!this.profileForm.invalid) {
      // Emit to parent to start Loading overlay and disable save button
      // this.formChanged.emit(false);

      // Updating the recorName
      const recordName = `${this.profileForm.value.firstName} ${this.profileForm.value.lastName}`;
      this.profileForm.patchValue({recordName});

      this.crud.updateRecord('user-update', this.recordData.id, this.profileForm.value).subscribe(record => {
        this.recordData = record;
        this.profileForm.patchValue(record);
        this.oriData = this.profileForm.value;
        this.profileChange.emit( {dataUpdated: true, record } );
        // this.formChanged.emit(false);
      }, err => {
        console.log(err);
        this.profileChange.emit( {dataUpdated: false, error: true } );
      });
    }
  }
}
