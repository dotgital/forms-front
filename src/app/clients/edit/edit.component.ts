import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  editing = false;

  addressForm = this.fb.group({
    company: null,
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    address: [null, Validators.required],
    address2: null,
    city: [null, Validators.required],
    state: [null, Validators.required],
    postalCode: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    ],
    shipping: ['free', Validators.required]
  });

  hasUnitNumber = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.addressForm.disable();
  }

  editForm(){
    this.editing = true;
    this.addressForm.enable();
  }

  cancelForm(){
    this.editing = false;
    this.addressForm.disable();
  }

  onSubmit() {
    this.editing = false;
    this.addressForm.disable();
    alert('Thanks!');
  }
}
